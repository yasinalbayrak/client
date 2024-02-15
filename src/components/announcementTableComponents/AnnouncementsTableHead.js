import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TextField, Input, Box} from '@mui/material';

function AnnouncementsTableHead({ tabValue, isInstructor, handleCourseFilter, handleInstructorFilter, handleJobDetailsFilter }) {


  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell>Course Code 
          <TextField id="outlined-basic" label="Search" variant="outlined" size="small" onChange={handleCourseFilter} sx={{ width: 100 }}/>
        </TableCell>
        <TableCell align="left">Course Section</TableCell>
        
        <TableCell align="center">Instructors
        <TextField id="outlined-basic" label="Search" variant="outlined" size="small" onChange={handleInstructorFilter}  sx={{ width: 100 }}/>
        </TableCell>
        
        <TableCell align="left">Last Application Date/Time</TableCell>
        <TableCell align="left">Term</TableCell>
        <TableCell align="center">Weekly Work Hours</TableCell>
        <TableCell align="center">More Details</TableCell>
        <TableCell align="left">Details
        <TextField id="outlined-basic" label="Search" variant="outlined" size="small" onChange={handleJobDetailsFilter} sx={{ width: 100 }}/>
        </TableCell>
        
        {tabValue === 1 && !isInstructor && <TableCell align="left">Application Status</TableCell>}
        <TableCell align="left">Actions</TableCell>
        
          
        
        
      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


