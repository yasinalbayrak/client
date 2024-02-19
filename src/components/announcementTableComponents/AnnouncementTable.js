import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAnnouncementsOfInstructor, getApplicationRequestsByStudentId } from "../../apiCalls";
import AnnouncementsTableHead from "./AnnouncementsTableHead"
import AnnouncementRow from "./AnnouncementRow"
import { WidthFull } from "@mui/icons-material";
import { Box } from "@mui/material";
import { TextField, Input } from '@mui/material';

export default function AnnouncementTable(props) {
  const [rows, setRows] = useState([]);
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
          if(!isInstructor) {
            app = userApplication.application
          }
          const workTime = app.weeklyWorkHours?? app.application.weeklyWorkHours;
          const slicedHour = workTime.slice(2);
          const modifiedWorkHour = slicedHour.slice(0, -1);
          const modifiedInstructorNames = (app.authorizedInstructors ?? app.application.authorizedInstructors).map((instructor)=>{
            const [firstName, lastName] = [(instructor.user.name), instructor.user.surname];
      
            const formattedFirstName = (firstName).charAt(0).toUpperCase() + (firstName).slice(1);
            const formattedLastName = (lastName).charAt(0).toUpperCase() + (lastName).slice(1);
            const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
            return modifiedInstructorName
          })


          const notSpacedCourse = app.course?.courseCode?? app.application?.course?.courseCode;
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
        const modifiedInstructorNames = row.authorizedInstructors.map((instructor)=>{
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
    }
  }, [props.rows]);

  const isApplied = (applicationID) => {
    return userApplications.some((userApplication) => {
      return userApplication.application?.applicationId === applicationID;
    });
  }
  const deleteApplication = (id) => {
    setUserApplications((prev) => prev.filter((app) => (app?.application?.applicationId || app?.applicationId) !== id));
    setRows((prev) => prev.filter((app) => app?.applicationId !== id));
  };
  const handleCourseFilter = (event) => {
    const value = event.target.value;
    setCourseFilterTerm(value);
  };

  const emptyFilter = (event) => {
    setCourseFilterTerm("");
    setInstructorFilterTerm("");
    setJobDetailsFilterTerm("");
  }


  const handleInstructorFilter = (event) => {
    const value = event.target.value;
    setInstructorFilterTerm(value);
  }

  const handleJobDetailsFilter = (event) => {
    const value = event.target.value;
    setJobDetailsFilterTerm(value);
  }

  const handleSortLastDate = () => {
    setSortLastDate((prev) => !prev);
  }

  useEffect(() => {
    console.log(courseFilterTerm)
  }
  , [courseFilterTerm]);
  
  return (

     <Box sx={{ width: '100%' }}> 
    <TableContainer component={Paper} sx={{maxHeight:'75vh'}}>
      
      

      <Table sx={{ minWidth: 600 }} stickyHeader aria-label="simple table">
        <AnnouncementsTableHead isInstructor={isInstructor} tabValue={tabValue} handleCourseFilter={handleCourseFilter} handleInstructorFilter={handleInstructorFilter} handleJobDetailsFilter = {handleJobDetailsFilter} emptyFilter={emptyFilter} handleSortLastDate={handleSortLastDate} sortLastDate= {sortLastDate} />
        <TableBody>
          { ( tabValue === 1
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
            console.log("rowdata",rowData)
            return (
            <AnnouncementRow
              key={index}
              data={rowData}
              tabValue={tabValue}
              userName={userName}
              navigate={navigate}
              isInstructor={isInstructor}
              isApplied = {isApplied}
              deleteCallBack= {deleteApplication}
            />
          )})}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}