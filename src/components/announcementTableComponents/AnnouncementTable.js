import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAnnouncementsOfInstructor, getApplicationRequestsByStudentId, getApplicationsByFollower } from "../../apiCalls";
import AnnouncementsTableHead from "./AnnouncementsTableHead"
import AnnouncementRow from "./AnnouncementRow"
import { WidthFull } from "@mui/icons-material";
import {Box, Divider, Grid, Typography} from "@mui/material";
import { TextField, Input } from '@mui/material';
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function AnnouncementTable(props) {
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(props.tabValue);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const term = useSelector((state) => state.user.term);
  const userName = useSelector((state) => state.user.name + " " + state.user.surname);
  const userID = useSelector((state) => state.user.id);

  const [userApplications, setUserApplications] = useState([]);
  const [userApplications2, setUserApplications2] = useState([]);
  const [courseFilterTerm, setCourseFilterTerm] = useState("");
  const [instructorFilterTerm, setInstructorFilterTerm] = useState("");
  const [jobDetailsFilterTerm, setJobDetailsFilterTerm] = useState("");
  const [sortDateAsc, setSortDateAsc] = useState(false);
  const [sortDateDesc, setSortDateDesc] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        if (!isInstructor) {
          data = await getApplicationRequestsByStudentId(userID);
        } else {
          data = await getAllAnnouncementsOfInstructor();
        }


        const modifiedUserApplications = data.content.map((userApplication) => {
          let app = userApplication
          if (!isInstructor) {
            app = userApplication.application
          }
          const workTime = app.weeklyWorkHours ?? app.application.weeklyWorkHours;
          const slicedHour = workTime.slice(2);
          const modifiedWorkHour = slicedHour.slice(0, -1);
          const modifiedInstructorNames = (app.authorizedInstructors ?? app.application.authorizedInstructors).map((instructor) => {
            const [firstName, lastName] = [(instructor.user.name), instructor.user.surname];

            const formattedFirstName = (firstName).charAt(0).toUpperCase() + (firstName).slice(1);
            const formattedLastName = (lastName).charAt(0).toUpperCase() + (lastName).slice(1);
            const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
            return modifiedInstructorName
          })


          const notSpacedCourse = app.course?.courseCode ?? app.application?.course?.courseCode;
          const spacedCourse = notSpacedCourse.replace(/([A-Z]+)(\d+)/g, '$1 $2');

          return {
            ...userApplication,
            weeklyWorkingTime: modifiedWorkHour,
            instructor_names: modifiedInstructorNames,
            modifiedCourseCode: spacedCourse,
            term: app.term,
            ...(isInstructor ? { application: app } : {})
          };
        });
        console.log("deneme",modifiedUserApplications)
        setUserApplications(modifiedUserApplications);
        setUserApplications2(modifiedUserApplications);
      } catch (error) {
        console.error("Failed to fetch user applications:", error);
      }
    }

    fetchData();
  }, [isInstructor, userName, userID, props.rows]);

  useEffect(() => {
    setTabValue(props.tabValue);
  }, [props.tabValue]);




  useEffect(() => {
    if (props.rows && props.rows.length > 0) {
      const modifiedRows = props.rows.map((row) => {
        const modifiedInstructorNames = row.authorizedInstructors.map((instructor) => {
          const [firstName, lastName] = [(instructor.user.name), instructor.user.surname];

          const formattedFirstName = (firstName).charAt(0).toUpperCase() + (firstName).slice(1);
          const formattedLastName = (lastName).charAt(0).toUpperCase() + (lastName).slice(1);
          const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
          return modifiedInstructorName
        })


        const workTime = row.weeklyWorkHours;
        const slicedHour = workTime.slice(2);
        const modifiedWorkHour = slicedHour.slice(0, -1);

        return {
          ...row,
          weeklyWorkingTime: modifiedWorkHour,
          instructor_names: modifiedInstructorNames,
        };
      });

      setRows(modifiedRows);
      setAllRows(modifiedRows)
    }
  }, [props.rows]);

  const isApplied = (applicationID) => {
    return userApplications.some((userApplication) => {
      return userApplication.application?.applicationId === applicationID;
    });
  }

  const isApplied2 = (applicationID) => {
    return userApplications?.filter((userApplication) => {
      return userApplication.application?.applicationId === applicationID;
    });
  }
  const deleteApplication = (id) => {
    setUserApplications((prev) => prev.filter((app) => (app?.application?.applicationId || app?.applicationId) !== id));
    setRows((prev) => prev.filter((app) => app?.applicationId !== id));
  };
  const handleCourseFilter = (event) => {
    setCourseFilterTerm(event.target.value);
  };


  const handleInstructorFilter = (event) => {
    const value = event.target.value;
    setInstructorFilterTerm(value);
  }

  const handleJobDetailsFilter = (event) => {
    const value = event.target.value;
    setJobDetailsFilterTerm(value);
  }

  const handleSortDateAsc = () => {
    setSortDateDesc(false);
    setSortDateAsc((prev) => !prev);
  }

  const handleSortDateDesc = () => {
    setSortDateAsc(false);
    setSortDateDesc((prev) => !prev);
  }

  useEffect(() => {
    console.log(courseFilterTerm)
  }
    , [courseFilterTerm]);


  const filterEligibility = (filter) => {
    setRows(filter.length > 0 ? allRows.filter((row) => (filter.includes(row.isStudentEligible))) : allRows)
  }
  const statusFilter = (filter) => {
    setUserApplications(filter.length>0 ? userApplications2.filter((row) => (filter.includes(row.status))) : userApplications2)
  }
  const filterActionCallback = (filter) => {
    console.log('filtterr :>> ', filter);
    setRows(filter.length === 1 ? allRows.filter((row) => (filter.includes("Saved") ? row.isFollowing : !row.isFollowing)) : allRows)
  }
  const setFollowingCallback = (applicationId, isFollowing) => {
    setAllRows(prev => prev.map(
      item => item.applicationId === applicationId 
        ? { ...item, isFollowing: isFollowing } 
        : item
    ));
    setRows(prev => prev.map(
      item => item.applicationId === applicationId 
        ? { ...item, isFollowing: isFollowing } 
        : item
    ));
  };


  const uncommittedAcceptedCount = userApplications.filter(
      (app) => !app.committed &&!app.forgiven && app.status === "Accepted"
  ).length;

  
  return (

    <Box sx={{ width: '100%' }}>
      {!isInstructor && uncommittedAcceptedCount!==0 && (
          <Grid item>
            <Divider />
            <br />
            <Stack sx={{ width: '72%' }} spacing={2}>
              <Alert severity="warning">
                You have {uncommittedAcceptedCount} application(s) that have been accepted for Learning Assistantship. You need to decide them on the{' '}
                <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    onClick={() => navigate('/commit')}
                    sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                >
                  Commitments page
                </Typography>.
              </Alert>
            </Stack>
            <br />
          </Grid>
      )}

      <TableContainer component={Paper} sx={{
        maxHeight: '75vh', overflow: "auto",
        scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }
      }}>



        <Table sx={{ minWidth: 600 }} stickyHeader aria-label="simple table" >
          <AnnouncementsTableHead
            isInstructor={isInstructor} 
            tabValue={tabValue} 
            handleCourseFilter={handleCourseFilter}
            courseFilterTerm={courseFilterTerm}
            handleInstructorFilter={handleInstructorFilter} 
            instructorFilterTerm={instructorFilterTerm}
            handleJobDetailsFilter={handleJobDetailsFilter} 
            jobDetailsFilterTerm={jobDetailsFilterTerm}
            handleSortDateAsc={handleSortDateAsc}
            sortDateAsc={sortDateAsc}
            handleSortDateDesc={handleSortDateDesc}
            sortDateDesc={sortDateDesc}
            filterEligibilityCallback = {filterEligibility}
            filterActionCallback= {filterActionCallback}
            statusFilterCallback = {statusFilter}
            />
          <TableBody>
            {(tabValue === 1
              ? userApplications
              : rows
            )
              .filter((rowData) => {
                const courseCode = rowData.application ? rowData.application.course.courseCode : rowData.course.courseCode;
                const jobDetails = rowData.application ? rowData.application.jobDetails : rowData.jobDetails;
                return rowData.term === term.term_desc &&  courseCode.toLowerCase().includes(courseFilterTerm?.toLowerCase())
                && rowData.instructor_names.some((instructor) => instructor.toLowerCase().includes(instructorFilterTerm?.toLowerCase()))
                && jobDetails.toLowerCase().includes(jobDetailsFilterTerm?.toLowerCase());
              
              })
          
              .sort((a, b) => {
                if (!sortDateAsc && !sortDateDesc) return 0;
                const dateA = new Date(a.application ? a.application.lastApplicationDate : a.lastApplicationDate);
                const dateB = new Date(b.application ? b.application.lastApplicationDate : b.lastApplicationDate);
                if (sortDateDesc) return dateB - dateA;
                else
                return dateA - dateB;
              })

              .map((rowData, index) => {
                
                const isNotification = rowData.application ? rowData.application.applicationId === props.notificationAppId : rowData.applicationId === props.notificationAppId;
                
                return (
                  <AnnouncementRow
                    key={rowData.application? rowData.application.applicationId: rowData.applicationId}
                    data={rowData}
                    tabValue={tabValue}
                    userName={userName}
                    navigate={navigate}
                    isInstructor={isInstructor}
                    isApplied={isApplied}
                    isApplied2={isApplied2}
                    deleteCallBack={deleteApplication}
                    setFollowingCallback={setFollowingCallback}
                    isNotification={isNotification}
                  />
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}