import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function AnnouncementsTableHead({ tabValue, isInstructor }) {
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell>Course Code</TableCell>
        <TableCell align="left">Primary Instructor</TableCell>
        <TableCell align="left">Last Application Date/Time</TableCell>
        <TableCell align="left">Minimum Desired Letter Grade</TableCell>
        <TableCell align="left">Weekly Work Hours</TableCell>
        <TableCell align="left">Details</TableCell>
        <TableCell align="center">
          {tabValue === 1 && !isInstructor && "Application Status"}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


