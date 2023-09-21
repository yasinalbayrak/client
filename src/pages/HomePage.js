import { Box, Button, Grid, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnnouncementTable from "../components/AnnouncementTable";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { getAllAnnouncements } from "../apiCalls";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  const [value, setValue] = useState(0);
  const [rows, setRows] = useState([]);
  const isInstructor = useSelector((state) => state.user.isInstructor);

  // useEffect(() => {
  //   getAllAnnouncements().then((results) => setRows(results));
  //   console.log(rows);
  // }, []); //needs to be fixed

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Fetch the announcements data here using your API function
        const announcements = await getAllAnnouncements();

        // If the location state includes updatedAnnouncement and the update status is false, update the rows state
        if (location.state && location.state.updatedAnnouncement && !updated) {
          // Update the rows state with the updated data or refetch the announcements data
          setRows(announcements);
          setUpdated(true); // Set the update status to true
        } else {
          // Set the rows state with the fetched data
          setRows(announcements);
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

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <AppBarHeader />
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row" justifyContent="space-between">
            <Grid item></Grid>
            <Grid item>
              <Tabs onChange={handleAnnouncementTableChange} value={value}>
                <Tab label="All Announcements" />
                {!isInstructor && <Tab label="My Applications" />}
                {isInstructor && <Tab label="My Announcements" />}
              </Tabs>
            </Grid>
            <Grid item>
              {isInstructor && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                  navigate("/create-announcement", { replace: true });
                }}>
                  Add
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <AnnouncementTable rows={rows} tabValue={value}></AnnouncementTable>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HomePage;
