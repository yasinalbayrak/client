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
import { Box } from "@mui/material";
import { TextField, Input } from '@mui/material';

export default function AnnouncementTable(props) {
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [userApplications2, setUserApplications2] = useState([]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(props.tabValue);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const term = useSelector((state) => state.user.term);
  const userName = useSelector((state) => state.user.name + " " + state.user.surname);
  const userID = useSelector((state) => state.user.id);

  const [userApplications, setUserApplications] = useState([]);
  const [courseFilterTerm, setCourseFilterTerm] = useState("");
  const [instructorFilterTerm, setInstructorFilterTerm] = useState("");
  const [jobDetailsFilterTerm, setJobDetailsFilterTerm] = useState("");
  const [sortLastDate, setSortLastDate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        if (!isInstructor) {
          data = await getApplicationRequestsByStudentId(userID);
        } else {
          data = await getAllAnnouncementsOfInstructor();
        }


        const modifiedUserApplications = data.map((userApplication) => {
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
        console.log(modifiedUserApplications)
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

  // useEffect(() => {
  //   console.log(userApplications)
  // }, [userApplications]);

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
  const handleCourseFilter = (event, term) => {
    setCourseFilterTerm(term);
  };

  const emptyFilter = (event) => {
    setCourseFilterTerm("");
    setInstructorFilterTerm("");
    setJobDetailsFilterTerm("");
  }


  const handleInstructorFilter = (event, term) => {
    const value = event.target.value;
    setInstructorFilterTerm(term);
  }

  const handleJobDetailsFilter = (event, term) => {
    const value = event.target.value;
    setJobDetailsFilterTerm(term);
  }

  const handleSortLastDate = () => {
    setSortLastDate((prev) => !prev);
  }

  useEffect(() => {
    console.log(courseFilterTerm)
  }
    , [courseFilterTerm]);


  const filterEligibility = (filter) => {
    setRows(filter.length > 0 ? allRows.filter((row) => (filter.includes(row.isStudentEligible))) : allRows)
  }

  const statusFilter = (filter) => {
    setUserApplications(filter.length>0 ? userApplications2.filter((row) => (filter.includes((row.status).toLowerCase()))) : userApplications2)
  }
  const setFollowingCallback = (applicationId) => {
    setRows(prev => prev.map(
      item => item.applicationId === applicationId 
        ? { ...item, isFollowing: !item.isFollowing } 
        : item
    ));
  };
  
  return (

    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{
        maxHeight: '75vh', overflow: "auto",
        scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }
      }}>



        <Table sx={{ minWidth: 600 }} stickyHeader aria-label="simple table" >
          <AnnouncementsTableHead
            isInstructor={isInstructor} 
            tabValue={tabValue} 
            handleCourseFilter={handleCourseFilter} 
            handleInstructorFilter={handleInstructorFilter} 
            handleJobDetailsFilter={handleJobDetailsFilter} 
            emptyFilter={emptyFilter} 
            handleSortLastDate={handleSortLastDate} 
            sortLastDate={sortLastDate} 
            filterEligibilityCallback = {filterEligibility}
            statusFilterCallback = {statusFilter}
            />
          <TableBody>
            {(tabValue === 1
              ? userApplications
              : rows
            )
              .filter((rowData) => rowData.term === term.term_desc)
              
              .filter((rowData) => {
                const courseCode = rowData.application ? rowData.application.course.courseCode : rowData.course.courseCode;
                return courseCode.toLowerCase().includes(courseFilterTerm?.toLowerCase());
              })
              .filter((rowData) => rowData.instructor_names.some((instructor) => instructor.toLowerCase().includes(instructorFilterTerm?.toLowerCase())))
              .filter((rowData) => {
                const jobDetails = rowData.application ? rowData.application.jobDetails : rowData.jobDetails;
                return jobDetails.toLowerCase().includes(jobDetailsFilterTerm?.toLowerCase());
              })
              .sort((a, b) => {
                if (!sortLastDate) return 0;
                const dateA = new Date(a.application ? a.application.lastApplicationDate : a.lastApplicationDate);
                const dateB = new Date(b.application ? b.application.lastApplicationDate : b.lastApplicationDate);
                return dateA - dateB;
              })

              .map((rowData, index) => {
                console.log("rowdata", rowData)
                return (
                  <AnnouncementRow
                    key={index}
                    data={rowData}
                    tabValue={tabValue}
                    userName={userName}
                    navigate={navigate}
                    isInstructor={isInstructor}
                    isApplied={isApplied}
                    isApplied2={isApplied2}
                    deleteCallBack={deleteApplication}
                    setFollowingCallback={setFollowingCallback}

                  />
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}