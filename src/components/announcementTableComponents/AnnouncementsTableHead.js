import React from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TextField, Input, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import SortIcon from '@mui/icons-material/Sort';
import Popup from 'reactjs-popup';
import SearchBar from '../SearchBar';
import { styled } from '@mui/material/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import FilterDropdown from './FilterDropdown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


function AnnouncementsTableHead({ tabValue, isInstructor, handleCourseFilter, handleInstructorFilter, handleJobDetailsFilter, filterEligibilityCallback, filterActionCallback, statusFilterCallback, courseFilterTerm, instructorFilterTerm, jobDetailsFilterTerm,handleSortDateAsc,handleSortDateDesc,sortDateAsc,sortDateDesc }) {

 
  const [eligibilityDropdownOpen, setEligibilityDropdownOpen] = React.useState(false);
  const [courseSearchOpen, setCourseSearchOpen] = React.useState(false);
  const [instructorSearchOpen, setInstructorSearchOpen] = React.useState(false);
  const [jobDetailsSearchOpen, setJobDetailsSearchOpen] = React.useState(false);

  const [labels, setLabels] = React.useState([
    {
      id: 1,
      name: "Eligible",
      checked: false
    },
    {
      id: 2,
      name: "Not Eligible",
      checked: false
    },
    {
      label: 3,
      name: "Deadline Passed",
      checked: false
    }])

  const [actionLabels, setActionLabels] = React.useState([
    {
      id: 1,
      name: "Saved",
      checked: false
    }
  ])

  const [statusLabels, setStatusLabels] = React.useState([
    {
      id: 1,
      name: "Accepted",
      checked: false
    },
    {
      id: 2,
      name: "Rejected",
      checked: false
    },
    {
      label: 3,
      name: "In Progress",
      checked: false
    },
    {
      label: 4,
      name: "Added to Waiting List",
      checked: false

    }])

  const checkStatusLabel = (labelName) => {
    setStatusLabels(prevLabels =>
      prevLabels.map(label =>
        label.name === labelName ? { ...label, checked: !label.checked } : label
      )
    );
  }

  const clearStatusLabels = () => {
    setStatusLabels(prevLabels =>
      prevLabels.map(label => ({ ...label, checked: false }))
    );
  }

  const checkLabel = (labelName) => {
    setLabels(prevLabels =>
      prevLabels.map(label =>
        label.name === labelName ? { ...label, checked: !label.checked } : label
      )
    );
  };

  const checkActionLabel = (actionLabelName) => {
    setActionLabels(prevLabels =>
      prevLabels.map(label =>
        label.name === actionLabelName ? { ...label, checked: !label.checked } : label
      )
    );
  };

  const clearLabels = () => {
    setLabels(prevLabels =>
      prevLabels.map(label => ({ ...label, checked: false }))
    );
  };
  const clearActionLabels = () => {
    setActionLabels(prevLabels =>
      prevLabels.map(label => ({ ...label, checked: false }))
    );
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      //backgroundColor: theme.palette.common.black,
      //color: theme.palette.common.white,
      backgroundColor: '#FAFAFA',
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const handleCourseSearch = () => {
    setCourseSearchOpen(!courseSearchOpen);
  }

  const handleInstructorSearch = () => {
    setInstructorSearchOpen(!instructorSearchOpen);
  }

  const handleJobDetailsSearch = () => {
    setJobDetailsSearchOpen(!jobDetailsSearchOpen);
  }




  return (
    <TableHead>
      <TableRow sx={{ borderBottom: 0, borderColor: '#FAFAFA' }}>
  <StyledTableCell >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            Course Code
            <SearchIcon onClick={handleCourseSearch} sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} />
            
          </Box>
          {courseSearchOpen && 
          <TextField
                id="outlined-basic"
                autoFocus={true}
                label="Search"
                variant="outlined"
                value={courseFilterTerm}
                onChange={handleCourseFilter}
                sx={{ paddingInline: 0.5 }}
                size="small"
            />}
  </StyledTableCell>


        <StyledTableCell align="left">Course Section</StyledTableCell>

        <StyledTableCell>
          <Box sx={{ width: 1, height: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: instructorSearchOpen ? 'column' : '' }}>
            <Box>
            Instructors
            <SearchIcon onClick={handleInstructorSearch} sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} /></Box>
            {instructorSearchOpen &&
            <TextField
              id="outlined-basic"
              autoFocus={true}
              label="Search"
              variant="outlined"
              value={instructorFilterTerm}
              onChange={handleInstructorFilter}
              sx={{ paddingInline: 0.5 }}
              size="small"
            />}
          </Box>
          
        </StyledTableCell>

        <StyledTableCell>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'row' }}>
            Deadline
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <IconButton onClick={handleSortDateAsc} style={{ marginBottom: '-10px', fontSize:'xs' }}>  {/* Decrease marginBottom here */}
                <ArrowDropUpIcon sx={{ paddingInline: 0.3, color: sortDateAsc? "green":"" , "&:hover": { color: "green", cursor: "pointer" } }} />
              </IconButton>
              <IconButton onClick={handleSortDateDesc} style={{ marginTop: '-8px', fontSize:'s' }}>
                <ArrowDropDownIcon sx={{ paddingInline: 0.3, color: sortDateDesc? "green":"" , "&:hover": { color: "green", cursor: "pointer" } }} />
              </IconButton>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell align="center">Weekly Work Hours</StyledTableCell>

        <StyledTableCell >

          <Box sx={{ width: 1, height: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: jobDetailsSearchOpen ? 'column' : '' }}>
            <Box>Details
            <SearchIcon onClick={handleJobDetailsSearch} sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} />   </Box>   

            {jobDetailsSearchOpen &&
            <TextField
            id="outlined-basic"
            autoFocus={true}
            label="Search"
            variant="outlined"
            value={jobDetailsFilterTerm}
            onChange={handleJobDetailsFilter}
            sx={{ paddingInline: 0.5 }}
            size="small"
          /> }      
            </Box>
            
        </StyledTableCell>


        {tabValue === 1 && !isInstructor && <StyledTableCell align="center">
          Application Status
          <FilterDropdown
            labels={statusLabels}
            setLabels={setStatusLabels}
            checkLabelCallback={checkStatusLabel}
            searchCallback={statusFilterCallback}
            clearCallback={clearStatusLabels}

          /></StyledTableCell>}
        {!(!isInstructor && tabValue === 1) && <StyledTableCell align="center"
        >Actions

        </StyledTableCell>}
        {(!isInstructor && tabValue === 0) && <StyledTableCell align="center" sx={{ minWidth: "6rem" }}>
          Eligibility
          <FilterDropdown
            labels={labels}
            setLabels={setLabels}
            checkLabelCallback={checkLabel}
            searchCallback={filterEligibilityCallback}
            clearCallback={clearLabels}

          />

        </StyledTableCell>

        }

        {(!isInstructor && tabValue === 0) && <StyledTableCell align="center" sx={{ width: "10px" , padding:0}}>
          <FilterDropdown
            labels={actionLabels}
            setLabels={setActionLabels}
            checkLabelCallback={checkActionLabel}
            searchCallback={filterActionCallback}
            clearCallback={clearActionLabels}

          />

        </StyledTableCell>

        }


      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


