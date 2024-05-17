import React, { useEffect, useState } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Popup from '../popup/Popup';
import { deleteApplicationById, getTranscriptInfo, addFollowerToApplication, removeFollowerFromApplication, getApplicationsByFollower } from "../../apiCalls"
import InstructorList from './InstructorList';
import IconButton from '@mui/material/IconButton';
import { useStyles } from '../../pages/EligibilityTable';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import FollowButton from '../buttons/FollowButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { keyframes } from '@mui/system';
import { useDispatch } from 'react-redux';


export default function AnnouncementRow({ key, data, tabValue, userName, navigate, isInstructor, isApplied, isApplied2, deleteCallBack, filterEligibilityCallback, setFollowingCallback, isNotification }) {

  const { instructor_names, weeklyWorkingTime, term, section, status: applicationStatus, isTimedOut, authorizedInstructors, isFollowing } = data;
  const [isTranscriptUploaded, setIsTranscriptUploaded] = useState(null); // Or false, depending on your data
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  

  const spin = keyframes`from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }`;

  const pulse = keyframes`from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }`;

  useEffect(() => {

    if (isInstructor == false) {
      getTranscriptInfo().then((res) => {
        if (res.isUploadedAnyTranscript !== undefined) {
          setIsTranscriptUploaded(res.isUploadedAnyTranscript);
        }
      }).catch(_ => {
        // Error handling
      });
    }
  }, []);


  // useEffect(() => {
  //   console.log(isTranscriptUploaded);
  // }, [isTranscriptUploaded]);

  



  const { lastApplicationDate,
    minimumRequiredGrade,
    jobDetails,
    applicationId,
    previousCourseGrades,
    isInprogressAllowed,
    course,
    isStudentEligible
  } = data.application ?? data;

  const appliedAppReqId = isApplied2(applicationId)[0]?.applicationRequestId;
  const applicationRequestId = data.applicationRequestId ?? "";

  const [deletePopupOpened, setDeletePopupOpened] = useState(false);

  const now = new Date();
  const deadline = new Date(lastApplicationDate);
  // console.log('now :>> ', now);
  // console.log('deadline :>> ', deadline);
  // console.log('javaDateTime < now', now < deadline);
  const flipPopup = () => {
    setDeletePopupOpened((prev) => !prev);
  };

  const deleteApplication = () => {
    flipPopup()
    deleteApplicationById(applicationId).then((_) => {
      deleteCallBack(applicationId)
    }).catch((_) => (null))
  }


  const handleCreateCopy = () => {
    navigate("/create-announcement?app="+ applicationId);
  }

  const renderButtons = () => {
    if (isInstructor) {
      if (instructor_names.some((instructor) => (userName.toLowerCase() === instructor.toLowerCase()))) {
        return (<>
          <IconButton
            onClick={() => navigate(`/edit-announcement/${applicationId}`, { replace: true })}
            sx={{ color: "blue" }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={flipPopup}
            color='error'
            sx={{
              marginLeft: '0rem',
              color: "red"
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
          <IconButton
            color='gray'
            onClick={() => setPopOpen(true)}
          >
            <ContentCopyIcon />
          </IconButton>

          <Popup
            opened={deletePopupOpened}
            flipPopup={flipPopup}
            title={"Confirm Deletion?"}
            text={"This action is irreversible, and the selected application will be permanently deleted."}
            posAction={deleteApplication}
            negAction={flipPopup}
            posActionText={"Delete"}
          />
          <Popup
            opened={popOpen}
            flipPopup={()=>setPopOpen(prev=>!prev)}
            title={`Create Copy of ${course.courseCode}`}
            text={"You will be redirected to copied application for further modifications."}
            posAction={handleCreateCopy}
            negAction={()=>setPopOpen(prev=>!prev)}
            posActionText={"Continue"}
          />

        </>

        );
      }
      return null;
    }

    // Conditions for non-instructor
    if (tabValue === 0) {
      // console.log(data)
      //console.log("isApplied", isApplied(data.applicationId));
      // console.log("key", key);
      // console.log("indxx", indxx);
      //const applicationId = data.applicationId;
      if (isApplied(applicationId)) {
        return (
          <IconButton
            sx={{ color: "blue" }}
            onClick={() => navigate("/edit-apply/" + appliedAppReqId, { replace: true })}
          >
            <EditIcon />
          </IconButton>
        );
      }
      else {

        return (
          <Button
            variant="outlined"
            color='success'
            onClick={() => {
              if (isTranscriptUploaded) {
                navigate("/apply/" + applicationId);
              } else {
                navigate("/transcriptUploadPage/" + applicationId);
              }
            }}
            sx={{
              height: "30px"
            }}
            disabled={isTimedOut || isStudentEligible === "Not Eligible"}
          >
            Apply
          </Button>

        )
      }
    }




    let statusColor;
    switch (applicationStatus) {
      case 'Accepted':
        statusColor = 'green';
        break;
      case 'Rejected':
        statusColor = 'red';
        break;
      default:
        statusColor = 'black';
        break;
    }

    return (
      <span className={getClassStatus(applicationStatus)}>
        {applicationStatus}
      </span>
    );
  };

  const getClassByElibility = (elibility) => {
    switch (elibility) {
      case "Eligible":

        return classes.eligibleBox;
      case "Not Eligible":

        return classes.notEligibleBox;

      case "Deadline Passed":
        return classes.deadlinePassed;
      default:
        return;
    }
  }

  const getClassStatus = (status) => {
    switch (status) {
      case "Accepted":
        return classes.acceptedBox;
      case "Rejected":
        return classes.rejectedBox;
      case "In Progress":
        return classes.pendingBox;
      case "Withdrawn":
        return classes.withdrawnBox;
      case "Added to Waiting List":
        return classes.waitlistedBox;
      default:
        return;
    }
  }
  function getEditButtonTooltip(applicationStatus, now, deadline) {
    if (applicationStatus !== "In Progress") {
      return `You can not edit your application, it has been already ${applicationStatus.toLowerCase()}`
    } else if (now > deadline) {
      return `You can not edit your application, the deadline is passed.`
    } else {
      return "Edit your application"
    }
  }

  const addFollower = (applicationId) => {
    addFollowerToApplication(applicationId).then((res) => {
      setFollowingCallback(applicationId, res.isFollowing)

    }).catch((_) => (null))


  }

  const removeFollower = (applicationId) => {
    removeFollowerFromApplication(applicationId).then((res) => {
      setFollowingCallback(applicationId, res.isFollowing)
    }).catch((_) => (null))

  }

  const handleNavigateEligibility = () => {
    if (isStudentEligible !== "Eligible" && isStudentEligible !== "Not Eligible") {
      return;
    }

    navigate("/eligibilityPage/" + applicationId);
  }
  return (
    (course.courseCode) &&

    <TableRow sx={{
      "&:last-child td, &:last-child th": { border: 0 }, borderBottom: 1, animation: isNotification ? `${pulse} 0.5s 3` : "none", height: "fit-content",
      "& > *": {
        maxHeight: "1rem"
      }
    }}>
      <TableCell sx={{ bgcolor: "#FAFAFA", width: "6rem", minWidth: "6rem", maxWidth: "6rem" }} component="th" scope="row">
        {course.courseCode}

      </TableCell>
      <TableCell sx={{ width: "4rem", minWidth: "4rem", maxWidth: "4rem" }} align="left" component="th" scope="row">
        {(!isInstructor && tabValue === 1 ? data.application?.section : section) || "All Sections"}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", minWidth: "14rem", maxWidth: "14rem", width: "14rem" }} align="left" component="th" scope="row">
        <InstructorList
          instructor_names={instructor_names}
          authorizedInstructors={(!isInstructor && tabValue === 1) ? data.application.authorizedInstructors : authorizedInstructors}
        />
      </TableCell>
      <TableCell sx={{ width: "4rem", minWidth: "4rem", maxWidth: "4rem" }} align="left" component="th" scope="row">
        {lastApplicationDate ? (
          <>
            {new Date(lastApplicationDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            /{" "}
            {new Date(lastApplicationDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </>
        ) : (
          "N/A"
        )}
      </TableCell>

      <TableCell sx={{ bgcolor: "#FAFAFA", width: "7rem", maxWidth: "7rem", minWidth: "7rem" }} align="center" component="th" scope="row">
        {weeklyWorkingTime + " Hours"}
      </TableCell>

      <TableCell sx={{ maxWidth: "10rem", width: "10rem", whiteSpace: "normal", wordWrap: "break-word", maxHeight: "10rem" }} align="left" component="th" scope="row">
        <Box sx={{ maxHeight: "6rem", width: '100%', padding: 0 }}>
          {jobDetails.length > 50 ? (
            <>
              {jobDetails.slice(0, 100) + '... '}
              <span style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline', fontSize: "12px" }} onClick={() => setOpen(true)}>
                read more
              </span>
            </>
          ) : (
            jobDetails
          )}
        </Box>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            {course.courseCode + " Job Details"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ wordWrap: "break-word" }}>
              {jobDetails}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </TableCell>

      <TableCell sx={{ bgcolor: "#FAFAFA", width: "4rem", minWidth: "5rem", padding: 0 }} align="center" component="th" scope="row">
        <Box width="100%" display="flex" justifyContent="center" >
          {renderButtons()}
          {(!isInstructor && tabValue === 1) && ((!(applicationStatus === "In Progress" && now < deadline)) ? (
            <Tooltip
              title={getEditButtonTooltip(applicationStatus, now, deadline)}
              placement="bottom"
            >
              <span>
                <IconButton
                  sx={{ color: "blue", ml: 1 }}
                  onClick={() => navigate("/edit-apply/" + applicationRequestId, { replace: true })}
                  disabled={!(applicationStatus === "In Progress" && now < deadline)}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip
              title={getEditButtonTooltip(applicationStatus, now, deadline)}
              placement="bottom"
            >
              <IconButton
                sx={{ color: "blue", ml: 1 }}
                onClick={() => navigate("/edit-apply/" + applicationRequestId, { replace: true })}
                disabled={!(applicationStatus === "In Progress" && now < deadline)}
              >
                <EditIcon />

              </IconButton>
            </Tooltip>
          ))}

        </Box>

      </TableCell>



      {(!isInstructor && tabValue === 0) && <TableCell sx={{ width: "4rem", minWidth: "4rem" }} align="center" component="th" scope="row">
        <Box
          onClick={handleNavigateEligibility}
          sx={{
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
            cursor: isStudentEligible === "Eligible" || isStudentEligible === "Not Eligible" ? "pointer" : "default"
          }}
          className={getClassByElibility(isStudentEligible)}
        >
          {isStudentEligible}
        </Box>

      </TableCell>}

      {(!isInstructor && tabValue === 0) && <TableCell align="center" component="th" scope="row" sx={{ padding: 0 }}>
        {<FollowButton
          isInstructor={isInstructor}
          isFollowing={isFollowing}
          applicationId={applicationId}
          addFollower={addFollower}
          removeFollower={removeFollower}
        />}
      </TableCell>}



    </TableRow>
  );
}