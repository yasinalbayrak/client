import React, { useState, useRef, useEffect } from 'react';
import './notification.css';
import { Button, Grid } from '@mui/material';
import useOutsideAlerter from '../alerts/outsideAlerter';
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentTurnedInSharpIcon from '@mui/icons-material/AssignmentTurnedInSharp';
import MarkChatReadSharpIcon from '@mui/icons-material/MarkChatReadSharp';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { changeNotificationPreferences, changeNotificationStatus, getNotifications, getApplicationsByFollower } from '../../apiCalls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import CampaignIcon from '@mui/icons-material/Campaign';
import UpdateIcon from '@mui/icons-material/Update';
import graduated from "../../assets/graduated.png"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useDispatch, useSelector } from "react-redux";
import { increaseUnreadNotificationCountByOne, setNotificationPreference, setPublicSubscription, setUnreadNotificationCount } from "../../redux/userSlice"
import { handleInfo } from '../../errors/GlobalErrorHandler';
import webSocketService from '../service/WebSocketService';
import { useNavigate } from 'react-router';
import { toHtml } from '@fortawesome/fontawesome-svg-core';

const NotificationButton = ({ unreadCount }) => {


    const [dropdownVisible, setDropdownVisible] = useState(false);
    const buttonRef = useRef(null)
    useEffect(() => {
        const closeDropdown = () => {
            if (dropdownVisible) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("click", closeDropdown);

        return () => {
            document.removeEventListener("click", closeDropdown);
        };
    }, [dropdownVisible]);


    const handleButtonClick = (event) => {
        event.stopPropagation();
        
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <Button
            startIcon={<NotificationIcon unreadCount={unreadCount} dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />}
            variant="none"
            onClick={handleButtonClick}
            ref={buttonRef}
            disableRipple={true}

        />
    );
};




const NotificationIcon = ({ unreadCount, dropdownVisible, setDropdownVisible }) => {

    const handleDropdownClick = (event) => {

        event.stopPropagation();
    };


    return (
        <div className="notification-icon-wrapper" onClick={handleDropdownClick}>
            <div className="nt" onClick={() => setDropdownVisible(!dropdownVisible)}>
                {unreadCount > 0 ? <div className="icon-class" style={{width: "24px", height: "24px"}}>🔔</div> : <NotificationsIcon />}
                {unreadCount > 0 && <span className="notification-counter">{unreadCount}</span>}
            </div>

            {dropdownVisible && <NotificationDropdown dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />}
        </div>
    );
}

const NotificationDropdown = (props) => {
    const [showAll, setShowAll] = useState(true);
    const [allNotifications, setAllNotifications] = useState(null);
    const [filteredNotifications, setFilteredNotifications] = useState(null);
    const [value, setValue] = useState("one");
    const [notificationPreferences, setNotificationPreferences] = useState(null);
    const unreadCount = useSelector((state) => state.user.unreadNotifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {dropdownVisible, setDropdownVisible} = props;

    


    const [followedApplications, setFollowedApplications] = useState([]);


    useEffect(() => {
        getNotifications().then((data) => {
            console.log('data', data)
            setAllNotifications(data);
            setFilteredNotifications(data);
        }).catch((_) => {
            /* Error already printed */
        });


    }, []);

    useEffect(() => {
        getApplicationsByFollower().then((data) => {
            console.log('data', data)
            setFollowedApplications(data);
        }).catch((_) => {
            /* Error already printed */
        });
    }, []);

    const updateNotifications = (newData) => {
        setAllNotifications(newData);
        setFilteredNotifications(showAll ? newData : newData.filter(each => !each.read));
    };


    const handleNotificationStatusChange = (read, notificationId) => {
        const request = [{ notificationId, read }];

        changeNotificationStatus(request).then(() => {
            dispatch(
                setUnreadNotificationCount({ unreadNotifications: unreadCount + (read ? -1 : 1) })
            )
            updateNotifications(allNotifications.map((nt) => {
                return nt.id === notificationId ? { ...nt, read } : nt;
            }));
        }).catch((_) => {
            /* Error already printed */
        });
    };

    const handleMarkAllRead = () => {

        const request = allNotifications.map((each) => ({
            "notificationId": each.id,
            "read": true
        }));
        changeNotificationStatus(request).then(() => {
            dispatch(
                setUnreadNotificationCount({ unreadNotifications: 0 })
            )
            updateNotifications(allNotifications.map((nt) => ({ ...nt, read: true })));
        }).catch((_) => {
            /* Error already printed */
        });
    };

    useEffect(() => {
        if (showAll) {
            setFilteredNotifications(allNotifications);
        } else {
            setFilteredNotifications(allNotifications.filter(each => !each.read));
        }
    }, [showAll, allNotifications]);

    if (!filteredNotifications) {
        return null;
    }



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getTabComponent = (tabValue) => {
        switch (tabValue) {
            case "one":
                return <NotificationItem
                    allNotifications={allNotifications}
                    filteredNotifications={filteredNotifications}
                    handleNotificationStatusChangeCallback={handleNotificationStatusChange}
                    relation="DIRECT"
                    navigate={navigate}
                    dropdownVisible={dropdownVisible}
                    setDropdownVisible={setDropdownVisible}
                />;
            case "two":

                return <NotificationItem
                allNotifications={allNotifications}
                filteredNotifications={filteredNotifications}
                handleNotificationStatusChangeCallback={handleNotificationStatusChange}
                relation="FOLLOW"
                navigate={navigate}
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}

                />;

            case "three":
                return <Settings />;
                
            default:
                return null;
        }
    }


    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <p className='notification-header-title'>Notifications</p>
                {value !== "three" && <div className="unread-only">
                    <div className='notification-source'>Show only unread notifications</div>
                    <div className={`toggle-unread  ${!showAll ? 'active' : ''}`} onClick={() => setShowAll(!showAll)}>

                        {!showAll ? <DoneIcon sx={{ fontSize: "15px" }} /> : <CloseIcon sx={{ fontSize: "15px" }} />}

                    </div>
                    {/*<MoreVertIcon sx={{ color: "black", marginLeft: "5px" }} />*/}
                </div>
                }

            </div>

            <Box sx={{ width: '100%', borderBottom: "1px solid #3f50b5" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="secondary tabs example"
                >
                    <Tab sx={{ textTransform: 'none' }} value="one" label="Direct" />
                    <Tab sx={{ textTransform: 'none' }} value="two" label="Following" />
                    <Tab sx={{ textTransform: 'none' }} value="three" label="Settings" />
                </Tabs>
            </Box>

            {filteredNotifications.length !== 0 && <div className="fwb">
                <a onClick={handleMarkAllRead} className='mark-all-read'>{!showAll && "Mark all as read"}</a>
            </div>}

            {getTabComponent(value)}


        </div>
    );
}

const getIconForNotification = (type) => {
    switch (type) {
        case "NEW_ANNOUNCEMENT":
            return <CampaignIcon sx={{ color: "#ffd900", width: "30px", height: "30px" }} />
        case "ANNOUNCEMENT_UPDATE":
            return <UpdateIcon sx={{ color: "grey", width: "30px", height: "30px" }} />
        case "INFO":
            return <InfoIcon sx={{ color: "blue", width: "30px", height: "30px" }} />
        case "ACCEPT":
            return <svg fill="none" height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M9.00012 12L11.0001 14L15.0001 10M7.83486 4.69705C8.55239 4.63979 9.23358 4.35763 9.78144 3.89075C11.0599 2.80123 12.9403 2.80123 14.2188 3.89075C14.7667 4.35763 15.4478 4.63979 16.1654 4.69705C17.8398 4.83067 19.1695 6.16031 19.3031 7.83474C19.3603 8.55227 19.6425 9.23346 20.1094 9.78132C21.1989 11.0598 21.1989 12.9402 20.1094 14.2187C19.6425 14.7665 19.3603 15.4477 19.3031 16.1653C19.1695 17.8397 17.8398 19.1693 16.1654 19.303C15.4479 19.3602 14.7667 19.6424 14.2188 20.1093C12.9403 21.1988 11.0599 21.1988 9.78144 20.1093C9.23358 19.6424 8.55239 19.3602 7.83486 19.303C6.16043 19.1693 4.83079 17.8397 4.69717 16.1653C4.63991 15.4477 4.35775 14.7665 3.89087 14.2187C2.80135 12.9402 2.80135 11.0598 3.89087 9.78132C4.35775 9.23346 4.63991 8.55227 4.69717 7.83474C4.83079 6.16031 6.16043 4.83067 7.83486 4.69705Z"
                stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>
        case "REJECT":
            return <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 512 512">
                <path fill="#fa0000" d="M256 48a208 208 0 1 1 0 416a208 208 0 1 1 0-416m0 464a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-81-337c-9.4 9.4-9.4 24.6 0 33.9l47 47l-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47l47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47l47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47l-47-47c-9.4-9.4-24.6-9.4-33.9 0"></path></svg>
        case "STUDENT_STATUS_UPDATE":
            return <img src={graduated} alt="Logo Right" style={{ width: "30px", height: "30px" }} />
        default:
            return <InfoIcon sx={{ color: "blue", width: "30px", height: "30px" }} />
    }
}



const goToApplication = (applicationId,title, navigate, dropdown, setDropdownVisible) => {
    if (applicationId && navigate && typeof navigate === 'function'){
        setDropdownVisible(!dropdown);
        navigate("/Home", { replace: true, state: { notificationAppId: applicationId, notificationTitle:title } });
    }
    
}

const NotificationItem = ({ allNotifications, filteredNotifications, handleNotificationStatusChangeCallback, relation, navigate, dropdownVisible, setDropdownVisible }) => filteredNotifications.filter((notification) => notification.relation==relation).length === 0 ? <>
    <div className="no-data">
        {allNotifications.filter((notification) => notification.relation==relation).length === 0 ? <NotificationsOffIcon sx={{ color: "black", fontSize: "12rem" }} /> : <MarkChatReadSharpIcon sx={{ color: "green", fontSize: "12rem" }} />}
        <div className="no-not">{allNotifications.filter((notification) => notification.relation==relation).length === 0 ? "No notifications for the last 60 days." : "You have read all of your notifications."}</div>

    </div>
</>

    : filteredNotifications.filter((notification)=> notification.relation==relation).map(notification => (
        <div className='otr' >
            <div className="ic">
                {getIconForNotification(notification.notificationType)}

            </div>
            <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                <div className="notification-title">
                    {notification.title}
                    <Tooltip title={notification.read ? "Mark as unread" : "Mark as read"} placement="left" className='outer-circle' onClick={() => { handleNotificationStatusChangeCallback(!notification.read, notification.id) }}> {!notification.read && <span className="unread-indicator"></span>}</Tooltip>
                </div>
                <div onClick={()=>goToApplication(notification.applicationId, notification.title, navigate, dropdownVisible, setDropdownVisible)} className="notification-description">{notification.description}</div>
                <div className="notification-timestamp">{notification.timestamp.split("T")[0] + " " + notification.timestamp.split("T")[1].slice(0, 5)}</div>
            </div>
        </div>
    ))


const SavedItems = ({ followedApplications }) => followedApplications.length === 0 ? <>
<div className="no-data">
    {followedApplications.length === 0 ? <NotificationsOffIcon sx={{ color: "black", fontSize: "12rem" }} /> : <MarkChatReadSharpIcon sx={{ color: "green", fontSize: "12rem" }} />}
    <div className="no-not">{followedApplications.length === 0 ? "No followed applications yet." : "You have followed all applications."}</div>
</div>
</>
    : followedApplications.map(application => (
        <div className='otr'>
            <div className="ic">
                <AssignmentTurnedInSharpIcon sx={{ color: "green", width: "30px", height: "30px" }} />
            </div>
            <div key={application.applicationId} className={`notification-item`}>
                <div className="notification-title">
                    {application.course.courseCode}
                </div>
                <div className="notification-title">
                {application.term}
                </div>
                <div className="notification-title">
                    {application.isTimedOut? "Closed":"Active"}
                </div>
                <div className="notification-description">Instructor: {application.authorizedInstructors[0].user.name + " " + application.authorizedInstructors[0].user.surname }</div>
                <div ></div>
            </div>
        </div>
    ))




const Settings = () => {
    const dispatch = useDispatch();
    const reduxPreferences = useSelector((state) => (state.user.notificationPreference));
    const stompClient = useSelector((state) => (state.user.stompClient));
    const publicSubscription = useSelector((state) => (state.user.publicSubscription));



    const handleChange = (preferenceKey) => (event) => {
        var updatedPreferences = {
            ...reduxPreferences,
            [preferenceKey]: event.target.checked
        };

        delete updatedPreferences.id

        changeNotificationPreferences(updatedPreferences).then((response) => {

            dispatch(setNotificationPreference({ notificationPreference: response }));
        }).catch((_) => { })

    };


    /*
    // very nice public subscription  feature but another design was applied :(

    useEffect(() => {
        console.log('reduxPreferences', reduxPreferences)
        console.log('publicSubscription', publicSubscription)
        const handlePublicNotification = (notification) => {

            dispatch(increaseUnreadNotificationCountByOne());
            handleInfo(notification.description);
        };
        const topic = `/topic`;

        if (!publicSubscription) {
            if (reduxPreferences?.followingNewAnnouncement) {
                webSocketService.subscribe(topic, handlePublicNotification);
                dispatch(setPublicSubscription({ publicSubscription: true }))
            }
        } else {
            if (!(reduxPreferences?.followingNewAnnouncement ?? false)) {
                
                webSocketService.unsubscribe(topic, handlePublicNotification);
                dispatch(setPublicSubscription({ publicSubscription: false }))
            }
        }

    }, [publicSubscription, stompClient, dispatch, reduxPreferences?.followingNewAnnouncement]);
    */


    return (
        <div className="settings-form-group">
            <span className='ctg'>Direct</span>
            <div className="settings-form-control">
                <span>Push Notifications</span>
                <Switch
                    className='sw'
                    checked={reduxPreferences?.directPush}
                    onChange={handleChange('directPush')}
                />
            </div>
            <div className="settings-form-control">
                <span>Email Notifications</span>
                <Switch
                    className='sw'
                    checked={reduxPreferences?.directEmail}
                    disabled
                />
            </div>

            <span className='ctg'>Following</span>
            <div className="settings-form-control">
                <span>Push Notifications</span>
                <Switch
                    className='sw'
                    checked={reduxPreferences?.followingPush}
                    onChange={handleChange('followingPush')}
                />
            </div>
            <div className="settings-form-control">
                <span>Email Notifications</span>
                <Switch
                    className='sw'
                    checked={reduxPreferences?.followingEmail}
                    onChange={handleChange('followingEmail')}
                />
            </div>

            <span className='ctg'>Preferences</span>
            <div className="settings-form-control">
                <span>Notify me on new announcements</span>
                <Switch
                    className='sw'
                    checked={reduxPreferences?.followingNewAnnouncement}
                    onChange={handleChange('followingNewAnnouncement')}
                />
            </div>

        </div>
    );
};
export default NotificationButton;
