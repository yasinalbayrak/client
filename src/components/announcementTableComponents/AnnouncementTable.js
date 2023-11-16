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

export default function AnnouncementTable(props) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(props.tabValue);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const term = useSelector((state) => state.user.term);
  const userName = useSelector((state) => state.user.name + " " + state.user.surname);
  const userID = useSelector((state) => state.user.id);

  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        if (!isInstructor) {
          data = await getApplicationRequestsByStudentId(userID);
        } else {
          data = await getAllAnnouncementsOfInstructor(userID);
        }
  
        
        const modifiedUserApplications = data.map((userApplication) => {
          let app = userApplication
          if(!isInstructor) {
            app = userApplication.application
          }
          const workTime = app.weeklyWorkHours?? app.application.weeklyWorkHours;
          const slicedHour = workTime.slice(2);
          const modifiedWorkHour = slicedHour.slice(0, -1);
          const authInsts = app.authorizedInstructors ?? app.application.authorizedInstructors;
          const [firstName, lastName] = [(authInsts[0]?.user.name || 'no instructor assigned yet'), authInsts[0]?.user.surname || ''];
          const formattedFirstName = (firstName || "no instructor assigned yet").charAt(0).toUpperCase() + (firstName || "no instructor assigned yet").slice(1);
          const formattedLastName = (lastName || "").charAt(0).toUpperCase() + (lastName || "").slice(1);
          const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
          const notSpacedCourse = app.course?.courseCode?? app.application?.course?.courseCode;
          const spacedCourse = notSpacedCourse.replace(/([A-Z]+)(\d+)/g, '$1 $2');
          
          return {
            ...userApplication,
            weeklyWorkingTime: modifiedWorkHour,
            instructor_name: modifiedInstructorName,
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
  }, [isInstructor, userName, userID]);
  
  useEffect(() => {
    setTabValue(props.tabValue);
  }, [props.tabValue]);

  // useEffect(() => {
  //   console.log(userApplications)
  // }, [userApplications]);
  
  useEffect(() => {
    if (props.rows && props.rows.length > 0) {
      const modifiedRows = props.rows.map((row) => {
        const [firstName, lastName] = [(row.authorizedInstructors[0]?.user.name || 'no instructor assigned yet'), row.authorizedInstructors[0]?.user.surname || ''];
    
        const formattedFirstName = (firstName || "no instructor assigned yet").charAt(0).toUpperCase() + (firstName || "no instructor assigned yet").slice(1);
        const formattedLastName = (lastName || "").charAt(0).toUpperCase() + (lastName || "").slice(1);
        const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
        const workTime = row.weeklyWorkHours;
        const slicedHour = workTime.slice(2);
        const modifiedWorkHour = slicedHour.slice(0, -1);
        const notSpacedCourse = row.course.courseCode;
        const spacedCourse = notSpacedCourse.replace(/([A-Z]+)(\d+)/g, '$1 $2');
  
        return {
          ...row,
          weeklyWorkingTime: modifiedWorkHour,
          instructor_name: modifiedInstructorName,
          modifiedCourseCode: spacedCourse,
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
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <AnnouncementsTableHead isInstructor={isInstructor} tabValue={tabValue} />
        <TableBody>
          { ( tabValue === 1
            ? userApplications 
            : rows 
          )
          .filter((rowData)=> (rowData.term === term.term_desc))
          .map((rowData, index) => {
            console.log(rowData)
            return (
            <AnnouncementRow
              key={index}
              data={rowData}
              tabValue={tabValue}
              userName={userName}
              navigate={navigate}
              isInstructor={isInstructor}
              isApplied = {isApplied}

            />
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}