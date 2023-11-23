import CampaignIcon from "@mui/icons-material/Campaign";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
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
import { logout, setTerm, switchIsInstructor } from "../redux/userSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { getTerms, logout as invalidateToken } from "../apiCalls";

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
  
      if (res.length > 0) {
        const activeTerm = res.find(term => term.is_active === '1');
        if (activeTerm) {
          dispatch(setTerm({ term: activeTerm }));
          setTermSelect(activeTerm);
        }
      }
    }).catch(() => {
      // Handle any errors if needed
    });
  }, []);
  


  const handleLogout = () => {
    token && invalidateToken(token)
      .then(result => {
        console.log("Logout successful");
      })
      .catch(error => {
        console.error("Logout failed:", error);
      });




    const homePageURL = "http://localhost:3000";
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
            <FormControl
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
            </FormControl>
          </Box>

          <Button
            sx={{
              color: "white",
              borderColor: "white",
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              paddingRight: 0,
              width: "fit-content",
              backgroundColor: "red", // Button color
              transition: "background-color 0.3s", // Smooth transition for the hover effect
              "&:hover": {
                backgroundColor: "#4DB6AC", // Hover color (light blue)
              },
            }}
            startIcon={<LogoutIcon />}
            color="error"
            variant="contained"
            onClick={handleLogout}
          />

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
              src={"/sula.png"}
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
                  src={
                    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fplaceholder-image&psig=AOvVaw2wfM2StbhQiMuN3S_8-PLK&ust=1672766858605000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCKiuraS0qfwCFQAAAAAdAAAAABAJ"
                  }
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
            <ListItemButton onClick={() => navigate("/home", {replace:true})} /*to="/home"*/ style={{ textDecoration: "none", color: "white" }}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Home"} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ bgcolor: "#e0e0e0", margin: "3px" }} />
          <ListItem sx={{ padding: "0px" }}>
            <ListItemButton onClick={handleListClick}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <CampaignIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Announcements"} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
              {sidebarOpen && (listOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={listOpen} timeout="auto">
            <List>
              <ListItem sx={{ padding: "0px" }}>
                <ListItemButton /*as={Link} to="/home"*/ onClick={() => navigate("/home", {replace:true})} style={{ textDecoration: "none", color: "white" }}>
                  <ListItemText primary={"- All Announcements"} sx={{ textAlign: "center" }} />
                </ListItemButton>
              </ListItem>
              {isInstructor && (
                <ListItem sx={{ padding: "0px" }}>
                  <ListItemButton as={Link} to="/applicants" style={{ textDecoration: "none", color: "white" }}>
                    <ListItemText primary={"- Check Applications"} sx={{ textAlign: "center" }} />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
