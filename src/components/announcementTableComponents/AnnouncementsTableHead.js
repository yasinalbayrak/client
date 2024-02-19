import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TextField, Input, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import SortIcon from '@mui/icons-material/Sort';
import Popup from 'reactjs-popup';
import SearchBar from '../SearchBar';

function AnnouncementsTableHead({ tabValue, isInstructor, handleCourseFilter, handleInstructorFilter, handleJobDetailsFilter, emptyFilter, handleSortLastDate, sortLastDate }) {

  const [courseSearch, setCourseSearch] = React.useState(false);
  const [instructorSearch, setInstructorSearch] = React.useState(false);
  const [jobDetailsSearch, setJobDetailsSearch] = React.useState(false);
  

  


  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell >
          <Box sx={{width:120, display: 'flex', justifyContent: courseSearch? 'flex-start': 'center', alignItems: courseSearch? 'left':'center', flexDirection: courseSearch? 'column':''}}>
          Course Code
         <Popup trigger={<SearchIcon sx={{paddingInline:0.5, "&:hover": { color: "green", cursor:"pointer" }}}/>} position="right">
          <SearchBar handleSearch={handleCourseFilter} empty={emptyFilter} />
        </Popup> 
          </Box>
        </TableCell>


        <TableCell align="left">Course Section</TableCell>
        
        <TableCell>
        <Box sx={{width:1, height:1, display: 'flex', justifyContent: instructorSearch? 'flex-start': 'center', alignItems: instructorSearch? 'left':'center', flexDirection: instructorSearch? 'column': ''}}>
         Instructors
         <Popup trigger={<SearchIcon sx={{paddingInline:0.5, "&:hover": { color: "green", cursor:"pointer" }}}/>} position="right">
          <SearchBar handleSearch={handleInstructorFilter} empty={emptyFilter} />
        </Popup> 
        </Box>
        </TableCell>
        
        <TableCell>
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'row'}}>
          Last Application Date/Time
          <SortIcon
          
          onClick={handleSortLastDate}
          sx={{color:sortLastDate? '#ffffff':"text.disabled"  , paddingInline:0.5, "&:hover": { color: sortLastDate? "": "green", cursor:"pointer" }, bgcolor: sortLastDate? "info.main":"", borderRadius:'50%' }}/>
          </Box>
        </TableCell>
        <TableCell align="left">Term</TableCell>
        <TableCell align="center">Weekly Work Hours</TableCell>
        <TableCell align="center">More Details</TableCell>

        <TableCell >

        <Box sx={{width:1, height:1, display: 'flex', justifyContent: jobDetailsSearch? 'flex-start':'center', alignItems: jobDetailsSearch? 'left':'center', flexDirection: jobDetailsSearch? 'column':''}}> 
        Details
        {jobDetailsSearch ? <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'90%', flexDirection: 'row'}}>
          <TextField 
          id="outlined-basic" 
          label="Search" 
          variant="outlined" 
          size="small" 
          onChange={handleJobDetailsFilter} 
          />
          <CancelIcon 
          variant='outlined' 
          fontSize='small' 
          color='disabled'
          sx={{ "&:hover": { color: "red",  cursor:"pointer" }}}
          onClick={() => {setJobDetailsSearch(false); emptyFilter()}} />
           </Box>
        :  <Popup trigger={<SearchIcon sx={{paddingInline:0.5, "&:hover": { color: "green", cursor:"pointer" }}}/>} position="left">
        <SearchBar handleSearch={handleJobDetailsFilter} empty={emptyFilter} />
        </Popup>} </Box>
        </TableCell>
        
        {tabValue === 1 && !isInstructor && <TableCell align="left">Application Status</TableCell>}
        <TableCell align="left">Actions</TableCell>
        
          
        
        
      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


