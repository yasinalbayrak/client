
import { Typography, IconButton, Collapse, Snackbar, Grid, Button, Divider, Box, TableContainer,
TableCell, Paper, Table, TableHead, TableBody, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnnouncementTable from "./components/announcementTableComponents/AnnouncementTable";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {getAcceptedApplicationRequestsByStudent,updateApplicationRequestStatus, getCourseGrades, getCurrentTranscript, getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements } from "./apiCalls";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackButton from "./components/buttons/BackButton";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Sidebar from "./components/Sidebar";




function Forbidden403() {

    const navigate = useNavigate();

  return (
    <>
            <Box sx={{ display: "flex" }}>
                <Sidebar></Sidebar>
                <Box component="main"  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box direction="columns" sx={{ mt:40, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            403 Forbidden
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            You are not authorized to view this page.
                        </Typography>

                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/home')}>
                            Go to Home Page
                        </Button>
                    </Box>
                </Box>
            </Box>
            </>
  );
}
export default Forbidden403;