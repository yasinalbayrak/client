
import { Typography, IconButton, Collapse, Snackbar, Grid, Button, Divider, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnnouncementTable from "../components/announcementTableComponents/AnnouncementTable";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { getAllAnnouncements, getApplicationRequestsByStudentId } from "../apiCalls";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";




function ProfilePage(){
    const {id} = useParams();

    

return(
    <>
    <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        
      </Box>
    </>)
}

export default ProfilePage;