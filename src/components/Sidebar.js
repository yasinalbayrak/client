import CampaignIcon from "@mui/icons-material/Campaign";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";

import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Button, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, styled, Toolbar, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AppBarHeader from "./AppBarHeader";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, setIsLoading, setTerm, switchIsInstructor } from "../redux/userSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { getTerms, logout as invalidateToken } from "../apiCalls";
import NotificationButton from "./notificationComponents/notifications";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { DriveFileRenameOutlineRounded } from "@mui/icons-material";
import apps from "../assets/apps.png"
import resumeIcon from "../assets/resumeIcon.png"
import S from "../assets/sula.png"
const drawerWidth = 210;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, sidebarOpen }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(sidebarOpen && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, sidebarOpen }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(sidebarOpen && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!sidebarOpen && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function Sidebar({ setTabInitial }) {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [listOpen, setListOpen] = React.useState(true);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const name = useSelector((state) => state.user.name);
  const surname = useSelector((state) => state.user.surname);
  const term = useSelector((state) => state.user.term);
  const token = useSelector((state) => state.user.JwtToken);
  const showTerms = useSelector((state) => state.user.showTerms);
  const unreadCount = useSelector((state) => state.user.unreadNotifications);
  const userID = useSelector((state) => state.user.id);
  const photoUrl = useSelector((state) => state.user.photoUrl);
  console.log('photoUrl :>> ', photoUrl);
  const [termSelect, setTermSelect] = React.useState(term);
  const [allTerms, setAllTerms] = React.useState([]);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleListClick = () => {
    if (!sidebarOpen) handleSidebarOpen();
    setListOpen(!listOpen);
  };

  const handleTermSelect = (event) => {
    dispatch(setTerm({ term: event.target.value }));
    setTermSelect(event.target.value);
  };

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setListOpen(false);
  };

  useEffect(() => {
    getTerms().then((res) => {
      setAllTerms(res);
      console.log('term :>> ', term);
      console.log('termSelect :>> ', termSelect);
      const termSet = (termSelect !== "")
      console.log('termSet :>> ', termSet);
      if (res.length > 0) {
        const activeTerm = res.find(term => termSet ? term.term_code === termSelect.term_code : term.is_active === '1');
        if (activeTerm) {
          dispatch(setTerm({ term: activeTerm }));
          setTermSelect(activeTerm);
        }
      }

    }).catch(() => {
    });
  }, []);



  const handleLogout = () => {
    dispatch(setIsLoading({ isLoading: true }));
    token && invalidateToken(token)
      .then(result => {
        console.log("Logout successful");
      })
      .catch(error => {
        console.error("Logout failed:", error);
      });


    const url = window.location.href;
    var homePageURL = "http://pro2-dev.sabanciuniv.edu/build";
    if (url.indexOf("pro2") === -1) {
      homePageURL = "http://localhost:3000/build/"
    }
    const logoutURL = `https://login.sabanciuniv.edu/cas/logout?service=${encodeURIComponent(homePageURL)}`;


    window.location.href = logoutURL;



  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sidebarOpen={sidebarOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleSidebarOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(sidebarOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box width={200}>
            {showTerms && <FormControl
              sx={{
                m: 1,
                minWidth: 150,
                color: "white !important",
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
              size="small"
            >
              <InputLabel id="simple-select-label" sx={{
                color: termSelect !== "" ? "white" : "rgba(255, 255, 255, 0.6)",
                "&.Mui-focused": {
                  color: "white",
                },
              }}>
                Select Term
              </InputLabel>
              <Select
                id="simple-select"
                labelId="simple-select-label"
                label="Select Term"
                onChange={handleTermSelect}
                defaultValue={termSelect}
                value={termSelect}
                sx={{
                  height: "2.5rem",
                  color: "white",
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "white",
                  },
                }}
              >
                {
                  allTerms.map((term) => (
                    <MenuItem key={term.term_code} value={term}>
                      {term.term_desc}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>}
          </Box>

          <Box
            sx={{ display: "flex", marginLeft: "auto" }}
          >
            <NotificationButton unreadCount={unreadCount} />

            <Button
              startIcon={<LogoutIcon />}
              variant="none"
              onClick={handleLogout}
            />
          </Box>


        </Toolbar>
      </AppBar>
      <Drawer sidebarOpen={sidebarOpen} variant="permanent" PaperProps={{ sx: { backgroundColor: "#394263", color: "white" } }}>
        <AppBarHeader>
          <IconButton onClick={handleSidebarClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon sx={{ color: "white" }} /> : <ChevronLeftIcon sx={{ color: "white" }} />}
          </IconButton>
        </AppBarHeader>
        <Divider sx={{ bgcolor: "#e0e0e0" }} />
        <List>
          <ListItem sx={{ justifyContent: "center" }}>
            <Box
              component="img"
              sx={{
                width: 150,
                height: 50,
                ...(!sidebarOpen && { display: "none" }),
              }}
              //src={`${process.env.PUBLIC_URL}/build/sula.png`}
              src={S}
            />
            {!sidebarOpen ? <Box sx={{ height: 50 }}></Box> : <div></div>}
          </ListItem>
          <ListItem disablePadding>
            <Box
              sx={{
                backgroundColor: "#4D5571",
                flex: "1",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    ...(!sidebarOpen && { width: 38, height: 38 }),
                  }}
                  src={photoUrl}
                ></Avatar>
              </Box>
              <Typography
                sx={{
                  textAlign: "center",
                  padding: "3px",
                  ...(!sidebarOpen && { display: "none" }),
                }}
              >
                {name} {surname}
              </Typography>
              {sidebarOpen && (<Typography
                sx={{
                  textAlign: "center",
                  padding: "3px",
                  fontStyle: "italic",
                  ...(!sidebarOpen && { display: "none" }),
                }}
              >
                {isInstructor && "Instructor"}
                {!isInstructor && "Student"}
              </Typography>)}

            </Box>
          </ListItem>
          <ListItem sx={{ padding: "0px" }}>
            <ListItemButton onClick={() => navigate("/home", { replace: true })} /*to="/home"*/ style={{ textDecoration: "none", color: "white" }}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Home"} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ bgcolor: "#e0e0e0", margin: "3px" }} />

          {!isInstructor && (<><ListItem sx={{ padding: "0px" }}>
            <ListItemButton onClick={() => navigate("/profile/" + userID, { replace: false })} style={{ textDecoration: "none", color: "white" }}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <AccountCircleIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Profile"} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
            <Divider sx={{ bgcolor: "#e0e0e0", margin: "3px" }} /> </>
          )}

          {!isInstructor && (
            <><ListItem sx={{ padding: "0px" }}>
              <ListItemButton as={Link} to="/commit" style={{ textDecoration: "none", color: "white" }}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <HandshakeIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={"Commitments"} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
              <Divider sx={{ bgcolor: "#e0e0e0", margin: "3px" }} /> </>
          )}



          <ListItem sx={{ padding: "0px" }}>
            <ListItemButton onClick={() => navigate("/home", { replace: true })} >
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <CampaignIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Announcements"} sx={{ opacity: sidebarOpen ? 1 : 0 }} />

            </ListItemButton>

          </ListItem>

          {isInstructor && (<>
            <Divider sx={{ bgcolor: "#e0e0e0", margin: "3px" }} />
            <ListItem sx={{ padding: "0px" }}>
              <ListItemButton as={Link} to="/applicants" >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  
                  <img src={resumeIcon} style={{height: 25, width: 25, color: "white"}}></img>
                </ListItemIcon>
                <ListItemText primary={"Applications"} />

              </ListItemButton>

            </ListItem></>)}



        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
