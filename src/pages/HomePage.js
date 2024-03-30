import { Box, Button, Grid, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnnouncementTable from "../components/announcementTableComponents/AnnouncementTable";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { getAllAnnouncements, getApplicationRequestsByStudentId } from "../apiCalls";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const { notificationAppId, notificationTitle } = location.state || {};
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  const [value, setValue] = useState(0);
  const [rows, setRows] = useState([]);
  const state = useSelector((state) => state);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const userID = useSelector((state) => state.user.id);
  
  

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {

        const announcements = await getAllAnnouncements();

        // If the location state includes updatedAnnouncement and the update status is false, update the rows state
        if (location.state && location.state.updatedAnnouncement && !updated) {
          // Update the rows state with the updated data or refetch the announcements data
          setRows(announcements.content);
          setUpdated(true); // Set the update status to true
        } else {
          // Set the rows state with the fetched data
          setRows(announcements.content);
        }
      } catch (error) {
        // Handle the error here
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [location, updated]); // Include the updated status in the dependencies


  const handleAnnouncementTableChange = (event, newValue) => {
    setValue(newValue);
  };

  const setTabInitial = () => {
  }

 
  useEffect(() => {
    if(notificationAppId){
      console.log("notificationAppId: ", notificationAppId);
      console.log("notificationTitle: ", notificationTitle);
      if(notificationTitle === "New Announcement" || notificationTitle === "Announcement Updated"){
        setValue(0);
      } else if(notificationTitle === "Application Status Updated"){
        setValue(1);
      }
    }
  }
  , [notificationAppId]);
  

  return (
     <Box sx={{ display: "flex" }}>
      <Sidebar
      setValue={setTabInitial}></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <AppBarHeader />
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row" justifyContent="space-between">
            <Grid item></Grid>
            <Grid item>
              <Tabs onChange={(e,newValue)=>{handleAnnouncementTableChange(e,newValue); if(notificationAppId){location.state.notificationAppId=null}; }} value={value}>
                <Tab label="All Announcements" />
                {!isInstructor && <Tab label="My Applications" />}
                {isInstructor && <Tab label="My Announcements" />}
              </Tabs>
            </Grid>
            <Grid item>
              {isInstructor && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                  navigate("/create-announcement");
                }}>
                  Add
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <AnnouncementTable rows={rows} tabValue={value} notificationAppId={notificationAppId}></AnnouncementTable>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HomePage;
