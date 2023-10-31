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
          
          
          const modifiedUserApplication = { ...userApplication };
          if(!isInstructor){

          }
          const workTime = userApplication.weeklyWorkHours?? userApplication.application.weeklyWorkHours;
          const slicedHour = workTime.slice(2);
          const modifiedWorkHour = slicedHour.slice(0, -1);
          const authInsts = userApplication.authorizedInstructors ?? userApplication.application.authorizedInstructors;
          const [firstName, lastName] = [(authInsts[0]?.user.name || 'no instructor assigned yet'), authInsts[0]?.user.surname || ''];
          const formattedFirstName = (firstName || "no instructor assigned yet").charAt(0).toUpperCase() + (firstName || "no instructor assigned yet").slice(1);
          const formattedLastName = (lastName || "").charAt(0).toUpperCase() + (lastName || "").slice(1);
          const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
          const notSpacedCourse = userApplication.course?.courseCode?? userApplication.application?.course?.courseCode;
          const spacedCourse = notSpacedCourse.replace(/([A-Z]+)(\d+)/g, '$1 $2');
  
          return {
            ...userApplication,
            weeklyWorkingTime: modifiedWorkHour,
            instructor_name: modifiedInstructorName,
            modifiedCourseCode: spacedCourse,
          };
        });
  
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
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <AnnouncementsTableHead isInstructor={isInstructor} tabValue={tabValue} />
        <TableBody>
          { ( tabValue === 1
            ? userApplications 
            : rows 
          ).map((rowData, index) => (
            <AnnouncementRow
              key={index}
              data={tabValue === 0 || isInstructor ? rowData : rowData   }
              tabValue={tabValue}
              userName={userName}
              navigate={navigate}
              isInstructor={isInstructor}

            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}