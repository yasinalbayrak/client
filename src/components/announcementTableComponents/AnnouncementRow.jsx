import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { red } from '@mui/material/colors';

export default function AnnouncementRow({ data, tabValue, userName, navigate, isInstructor }) {
 
  const { modifiedCourseCode, instructor_name,weeklyWorkingTime, term , status : applicationStatus } = data;

  const {lastApplicationDate ,
   minimumRequiredGrade ,
   jobDetails ,
   applicationId} = data.application ??data;
  
  console.log("applicationStatus", applicationStatus);

  const renderButton = () => {
    // Condition for instructor
    if (isInstructor) {
      if (instructor_name !== "no instructor assigned yet" && instructor_name.toLowerCase() === userName.toLowerCase()) {
        return (
          <Button
            variant="contained"
            onClick={() => navigate("/edit-announcement/" + applicationId, { replace: true })}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        );
      }
      return null;  
    }
  
    // Conditions for non-instructor
    if (tabValue === 0) {
      return (
        <Button
          variant="contained"
          onClick={() => navigate("/apply/" + applicationId, { replace: true })}
        >
          Apply
        </Button>
      );
    }
    let statusColor;
  switch (applicationStatus) {
    case 'ACCEPTED':
      statusColor = 'green';
      break;
    case 'REJECTED':
      statusColor = 'red';
      break;
    default:
      statusColor = 'black';
      break;
  }

  return (
    <span style={{ color: statusColor }}>
      {applicationStatus}
    </span>
  );
  };

  return (modifiedCourseCode &&
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
        {modifiedCourseCode}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
        {instructor_name}
      </TableCell>
      <TableCell sx={{ borderBottom: "none" }} align="left">
        {lastApplicationDate ? (
          <>
            {new Date(lastApplicationDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            /{" "}
            {new Date(lastApplicationDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
        {term}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
        {minimumRequiredGrade}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
        {weeklyWorkingTime}
      </TableCell>
      <TableCell sx={{ borderBottom: "none" }} align="left">
        {jobDetails}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="center">
        {renderButton()}
      </TableCell>
    </TableRow>
  );
}