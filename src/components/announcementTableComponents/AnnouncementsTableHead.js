import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function AnnouncementsTableHead({ tabValue, isInstructor }) {
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell>Course Code</TableCell>
        <TableCell align="left">Instructors</TableCell>
        <TableCell align="left">Last Application Date/Time</TableCell>
        <TableCell align="left">Term</TableCell>
        <TableCell align="left">Minimum Desired Letter Grade</TableCell>

        <TableCell align='left'>Enrolled Allowed</TableCell>

        <TableCell align="center">Weekly Work Hours</TableCell>
        <TableCell align="center">Grade Requirements</TableCell>
        <TableCell align="left">Details</TableCell>
        
        {tabValue === 1 && !isInstructor && <TableCell align="left">Application Status</TableCell>}
        <TableCell align="left">Actions</TableCell>
        
          
        
        
      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


