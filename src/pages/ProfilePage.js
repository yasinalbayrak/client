
import { Typography, IconButton, Collapse, Snackbar, Grid, Button, Divider, Box, TableContainer,
TableCell, Paper, Table, TableHead, TableBody, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import AnnouncementTable from "../components/announcementTableComponents/AnnouncementTable";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {getAcceptedApplicationRequestsByStudent,updateApplicationRequestStatus, getCourseGrades, getCurrentTranscript, getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements } from "../apiCalls";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackButton from "../components/buttons/BackButton";




function ProfilePage(){
    const {id} = useParams();
    const userID = useSelector((state) => state.user.id);
    const[user, setUser] = useState();
    const[showAll, setShowAll] = useState(false);
    const[courses, setCourses] = useState();

    const expandButton = () => {
        return (courses &&
        courses.length > 7 && (
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Less" : "More"}
            </Button>
          )

        )
        
    }



    useEffect(() => {
        const fetchData = async () => {
          try {
            const currentTranscript = await getCurrentTranscript(id);
            setUser(currentTranscript);
          } catch (error) {
            // Centralized error handling or log the error
            console.error("Error fetching data:", error);
            setUser(null);
          }
        };
    
        fetchData();
      }, [id]);

    console.log(user);

    useEffect(() => {
        setCourses(user?.course);
    }
    , [user]);

    const displayedCourses = showAll ? courses : courses?.slice(courses?.length-6, courses?.length);


    if(!user){
        return (
            <>
            <Box sx={{ display: "flex" }}>
                <Sidebar></Sidebar>
                <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ mt:40, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                         No Transcript Info For Current Student
                        </Typography>
                    </Box>
                </Box>
            </Box>
            </>

        )
        
    }


return(
    <>
     <Box sx={{ display: "flex" }}>
  <Sidebar></Sidebar>
  <Box component="main" sx={{ flexGrow: 1, m:3 }}>
  <BackButton to={"/home"}/>
    <Box sx={{ p: 5 }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{user?.studentName}</Typography>
    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>SU-ID: {user?.studentSuId}</Typography>
    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>GPA: {user?.cumulativeGPA}</Typography>
    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Total Credit: {user?.cumulativeCredits}</Typography>
    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Class: {user?.year}</Typography>
    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Last Transcript Term: {user?.term}</Typography>
    
    </Box>

    <Divider sx={{ my: 1, mx:2 }} />

    
    <Typography align="center" width='40%' variant="h5" sx={{ px:5}}>Transcript</Typography>

    <Box sx={{ mb: 2, width:'40%', px:5 }}>
    <TableContainer component={Paper} sx={{}}>
      <Table aria-label="simple table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Course Name</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Grade</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Term</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedCourses?.slice().reverse().map((course, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {course.courseCode}
              </TableCell>
              <TableCell align="center">{course.grade}</TableCell>
              <TableCell align="center">{course.term}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mr:2 }}>
            {expandButton()}
        </Box>
    </Box>
    
  </Box>
  
</Box>
    </>)
}

export default ProfilePage;