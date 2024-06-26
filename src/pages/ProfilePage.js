
import {
  Typography, IconButton, Collapse, Snackbar, Grid, Button, Divider, Box, TableContainer,
  TableCell, Paper, Table, TableHead, TableBody, TableRow, Avatar
} from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts';
import React, { useEffect, useState } from "react";
import AnnouncementTable from "../components/announcementTableComponents/AnnouncementTable";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAcceptedApplicationRequestsByStudent, updateApplicationRequestStatus, getCourseGrades, getCurrentTranscript, getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements } from "../apiCalls";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackButton from "../components/buttons/BackButton";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FilterDropdown from '../components/announcementTableComponents/FilterDropdown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import WaitingPage from "./WaitingPage/WaitingPage";




function ProfilePage() {
  const { id } = useParams();
  const userID = useSelector((state) => state.user.id);
  const isInstructor = useSelector((state) => state.user.isInstructor);

  const [user, setUser] = useState(null);
  const [courseSearchOpen, setCourseSearchOpen] = React.useState(false);
  const [showAll, setShowAll] = useState(false);
  const [courses, setCourses] = useState();
  const navigate = useNavigate();
  const [gradeFilter, setGradeFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const gradeOptions = [
    { name: 'A', checked: false },
    { name: 'A-', checked: false },
    { name: 'B+', checked: false },
    { name: 'B', checked: false },
    { name: 'B-', checked: false },
    { name: 'C+', checked: false },
    { name: 'C', checked: false },
    { name: 'C-', checked: false },
    { name: 'D+', checked: false },
    { name: 'D', checked: false },
    { name: 'F', checked: false },
    { name: 'S', checked: false },
    { name: 'W', checked: false },
    { name: 'I.P.', checked: false }
  ];


  console.log("user", id);
  console.log("userID", userID);

  const getGPAColor = (gpa) => {
    if (gpa >= 3.7) {
      return "#0ea915";
    } else if (gpa >= 3.3) {
      return "#51b655";
    } else if (gpa >= 3.0) {
      return "#f6cb03";
    } else if (gpa >= 2.7) {
      return "#f1ab09";
    } else if (gpa >= 2.3) {
      return "#ff9800";
    } else if (gpa >= 2.0) {
      return "#ff4d00";
    } else {
      return "#ff0f00";
    }
    //"#3f51b5"
  }

  useEffect(() => {
    if (!user?.course) return;
    const filteredCourses = user.course.filter(course => gradeFilter.includes(course.grade) || gradeFilter.length === 0);
    setCourses(filteredCourses);
  }, [user, gradeFilter]);
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
    setLoading(true);
    const fetchData = async () => {
      try {
        const currentTranscript = await getCurrentTranscript(id);
        console.log(currentTranscript);
        setUser(currentTranscript);
      } catch (error) {
        // Centralized error handling or log the error
        console.error("Error fetching data:", error);
        setUser(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);



  useEffect(() => {
    setCourses(user?.course);
  }
    , [user]);

  const displayedCourses = showAll ? courses : courses?.slice(courses?.length - 6, courses?.length);


  const handleCourseSearch = () => {
    setCourseSearchOpen(!courseSearchOpen);
  }
  const handleGradeFilterChange = (gradeName) => {
    setGradeFilter(prev => {
      const isGradeSelected = prev.includes(gradeName);
      if (isGradeSelected) {
        return prev.filter(g => g !== gradeName); // Remove grade from filter
      } else {
        return [...prev, gradeName]; // Add grade to filter
      }
    });
  };
  if (loading) {
    return (
      <WaitingPage />
    );
  }

  if (user == null && !loading) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <Sidebar></Sidebar>
          <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BackButton to={"/home"} />
            <Box direction="columns" sx={{ mt: 40, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                No Transcript Info For Current Student
              </Typography>

              {id !== undefined && id == userID && !isInstructor && <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => navigate("/transcriptUploadPage", { replace: true })} color="primary" sx={{ position: "relative", mt: "3rem" }}>
                Upload new transcript
              </Button>}
            </Box>
          </Box>
        </Box>
      </>

    )

  }



  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
          <Grid item container direction="rows" alignItems="center" justifyContent="space-between" sx={{}}>
            <Grid item><BackButton to={"/home"} /></Grid>
            {id !== undefined && id == userID && !isInstructor && <Grid item>
              <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => navigate("/transcriptUploadPage", { replace: true })} color="primary" sx={{ position: "relative", mt: "3rem" }}>
                Upload new transcript
              </Button>
            </Grid>}
          </Grid>
          <Box sx={{ p: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,

                }}
                src={user?.photoUrl}
              ></Avatar>
            </Box>
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{user?.studentName}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>SU-ID: {user?.studentSuId}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Faculty: {user?.faculty}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Major: {`${user?.program?.majors}`}</Typography>
                {user?.program?.minors && <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Minor: {`${user?.program?.minors}`}</Typography>}
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Total Credit: {user?.cumulativeCredits}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Class: {user?.year}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Last Transcript Term: {user?.term}</Typography>
              </Grid>
              <Grid item>
                <Gauge
                  value={user?.cumulativeGPA}
                  valueMax={4}
                  height={200}
                  width={400}
                  label="GPA"
                  valueLabel="GPA"
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 20,
                      transform: 'translate(0px, 0px)',
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: getGPAColor(user?.cumulativeGPA),
                    }
                  }}
                  text={
                    ({ value, valueMax }) => `GPA: ${value} / ${valueMax}`
                  }

                />

              </Grid>
            </Grid>

          </Box>

          <Divider sx={{ my: 1, mx: 2 }} />


          <Typography align="center" width='40%' variant="h5" sx={{ px: 5 }}>Transcript</Typography>

          <Box sx={{ mb: 2, width: '40%', px: 5 }}>
            <TableContainer component={Paper} sx={{}}>
              <Table aria-label="simple table">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course Name
                      <IconButton onClick={handleCourseSearch} style={{ marginLeft: '0px' }}>
                        <SearchIcon sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} />
                      </IconButton></TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Grade
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: '-7px' }}>
                          <IconButton onClick={1} style={{ marginBottom: '-10px' }}>
                            <ArrowDropUpIcon />
                          </IconButton>
                          <IconButton onClick={1} style={{ marginTop: '-8px' }}>
                            <ArrowDropDownIcon />
                          </IconButton>
                        </Box>
                        <Box > {/* Adjust minWidth to manage space between elements */}
                          <FilterDropdown
                            labels={gradeOptions}
                            setLabels={(updatedLabels) => {
                              const selectedGrades = updatedLabels.filter(label => label.checked).map(label => label.name);
                              setGradeFilter(selectedGrades); // This updates the gradeFilter based on selections
                            }} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Term
                      <FilterDropdown
                        labels={gradeOptions}
                        setLabels={(updatedLabels) => {
                          const selectedGrades = updatedLabels.filter(label => label.checked).map(label => label.name);
                          setGradeFilter(selectedGrades); // This updates the gradeFilter based on selections
                        }} />
                    </TableCell>
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
            <Box sx={{ display: "flex", justifyContent: "center", mr: 2 }}>
              {expandButton()}
            </Box>
          </Box>

        </Box>

      </Box>
    </>)
}

export default ProfilePage;