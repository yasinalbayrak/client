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
function AnnouncementsTableHead({ tabValue, isInstructor, handleCourseFilter, handleInstructorFilter, handleJobDetailsFilter, emptyFilter, handleSortLastDate, sortLastDate, filterEligibilityCallback, filterActionCallback }) {

  const [courseSearch, setCourseSearch] = React.useState(false);
  const [instructorSearch, setInstructorSearch] = React.useState(false);
  const [jobDetailsSearch, setJobDetailsSearch] = React.useState(false);
  const [eligibilityDropdownOpen, setEligibilityDropdownOpen] = React.useState(false);

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
    },
    {
      id: 2,
      name: "Not Saved",
      checked: false
    }
  ])

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



  return (
    <TableHead>
      <TableRow sx={{ borderBottom: 0, borderColor: '#FAFAFA' }}>
        <StyledTableCell >
          <Box sx={{ display: 'flex', justifyContent: courseSearch ? 'flex-start' : 'center', alignItems: courseSearch ? 'left' : 'center', flexDirection: courseSearch ? 'column' : '' }}>
            Course Code
            <Popup trigger={<SearchIcon sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} />} position="right">
              <SearchBar handleSearch={handleCourseFilter} empty={emptyFilter} />
            </Popup>
          </Box>
        </StyledTableCell>


        <StyledTableCell align="left">Course Section</StyledTableCell>

        <StyledTableCell>
          <Box sx={{ width: 1, height: 1, display: 'flex', justifyContent: instructorSearch ? 'flex-start' : 'center', alignItems: instructorSearch ? 'left' : 'center', flexDirection: instructorSearch ? 'column' : '' }}>
            Instructors
            <Popup trigger={<SearchIcon sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} />} position="right">
              <SearchBar handleSearch={handleInstructorFilter} empty={emptyFilter} />
            </Popup>
          </Box>
        </StyledTableCell>

        <StyledTableCell>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'row' }}>
            Deadline
            <SortIcon

              onClick={handleSortLastDate}
              sx={{ color: sortLastDate ? '#ffffff' : "text.disabled", paddingInline: 0.5, "&:hover": { color: sortLastDate ? "" : "green", cursor: "pointer" }, bgcolor: sortLastDate ? "info.main" : "", borderRadius: '50%' }} />
          </Box>
        </StyledTableCell>
        <StyledTableCell align="center">Weekly Work Hours</StyledTableCell>

        <StyledTableCell >

          <Box sx={{ width: 1, height: 1, display: 'flex', justifyContent: jobDetailsSearch ? 'flex-start' : 'center', alignItems: jobDetailsSearch ? 'left' : 'center', flexDirection: jobDetailsSearch ? 'column' : '' }}>
            Details
            {jobDetailsSearch ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90%', flexDirection: 'row' }}>
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
                sx={{ "&:hover": { color: "red", cursor: "pointer" } }}
                onClick={() => { setJobDetailsSearch(false); emptyFilter() }} />
            </Box>
              : <Popup trigger={<SearchIcon sx={{ paddingInline: 0.5, "&:hover": { color: "green", cursor: "pointer" } }} />} position="left">
                <SearchBar handleSearch={handleJobDetailsFilter} empty={emptyFilter} />
              </Popup>} </Box>
        </StyledTableCell>

        {tabValue === 1 && !isInstructor && <StyledTableCell align="center" >Application Status</StyledTableCell>}
        <StyledTableCell align="center"
        >Actions
          {(!isInstructor && tabValue === 0 )&& <FilterDropdown
            labels={actionLabels}
            setLabels={setActionLabels}
            checkLabelCallback={checkActionLabel}
            searchCallback={filterActionCallback}
            clearCallback={clearActionLabels}

          />}
        </StyledTableCell>
        {(!isInstructor && tabValue === 0) && <StyledTableCell align="center" sx={{ minWidth: "6rem" }}>
          Eligibility
          <FilterDropdown
            labels={labels}
            setLabels={setLabels}
            checkLabelCallback={checkLabel}
            searchCallback={filterEligibilityCallback}
            clearCallback={clearLabels}

          />

        </StyledTableCell>}




      </TableRow>
    </TableHead>
  );
}

export default AnnouncementsTableHead;


