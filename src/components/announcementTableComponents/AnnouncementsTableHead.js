import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TextField, Input, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

function AnnouncementsTableHead({ tabValue, isInstructor, handleCourseFilter, handleInstructorFilter, handleJobDetailsFilter, emptyFilter }) {

  const [courseSearch, setCourseSearch] = React.useState(false);
  const [instructorSearch, setInstructorSearch] = React.useState(false);
  const [jobDetailsSearch, setJobDetailsSearch] = React.useState(false);

  


  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>Course Code </div>
         {courseSearch ? <div>
         <TextField 
          id="outlined-basic" 
          label="Search" 
          variant="outlined" 
          size="small" 
          onChange={handleCourseFilter} 
          sx={{ width: 100 }} />
          <CancelIcon 
          variant='outlined' 
          fontSize='small' 
          color='disabled' 
          onClick={() => {setCourseSearch(false); emptyFilter()} } />
          </div>: <SearchIcon  onClick={() => setCourseSearch(true)}/>}
        </TableCell>
        <TableCell align="left">Course Section</TableCell>
        
        <TableCell sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div>Instructors</div> 
        {instructorSearch? <div>
          <TextField 
            id="outlined-basic" 
            label="Search" 
            variant="outlined" 
            size="small" 
            onChange={handleInstructorFilter} 
            sx={{ width: 100 }} />
            <CancelIcon 
            variant='outlined' 
            fontSize='small' 
            color='disabled'
            onClick={() => {setInstructorSearch(false); emptyFilter()}} />
            </div> 
            : <SearchIcon onClick={() => setInstructorSearch(true)}/>}
        </TableCell>
        
        <TableCell align="left">Last Application Date/Time</TableCell>
        <TableCell align="left">Term</TableCell>
        <TableCell align="center">Weekly Work Hours</TableCell>
        <TableCell align="center">More Details</TableCell>
        <TableCell sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <div>Details</div>
        {jobDetailsSearch ? <div>
          <TextField 
          id="outlined-basic" 
          label="Search" 
          variant="outlined" 
          size="small" 
          onChange={handleJobDetailsFilter} 
          sx={{ width: 100 }} />
          <CancelIcon 
          variant='outlined' 
          fontSize='small' 
          color='disabled'
          onClick={() => {setJobDetailsSearch(false); emptyFilter()}} />
          </div> 
        : <SearchIcon onClick={() => setJobDetailsSearch(true)}/>}
        </TableCell>
        
        {tabValue === 1 && !isInstructor && <TableCell align="left">Application Status</TableCell>}
        <TableCell align="left">Actions</TableCell>
        
          
        
        
      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


