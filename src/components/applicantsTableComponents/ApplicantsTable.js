import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, IconButton, Collapse, Snackbar, Grid, Button, Divider } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SwapVertTwoToneIcon from '@mui/icons-material/SwapVertTwoTone';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { getApplicationRequestsByStudentId, updateApplicationRequestStatus, getCourseGrades, getCurrentTranscript, getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements, finalizeStatus } from "../../apiCalls";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import QuestionAnswer from "./QuestionsAndAnswers";
import LaHistoryTable from "./LaHistoryTable";
import TextField from '@mui/material/TextField';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomRow(props) {
  const { row, index, questions, appId, courseCode } = props;
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [LaHistory, setLaHistory] = React.useState([]);
  const [userID, setUserID] = React.useState("");
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = React.useState({});

  console.log(row);


  useEffect(() => {
    setUserID(row.student.user.id);
  }, [row.student.user.id]);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleChange = (event) => {
    const toStatus = event.target.value
    updateApplicationRequestStatus(row.applicationRequestId, toStatus).then((res) => {
      row.statusIns = toStatus;
      setSnackOpen(true);
      console.log(res);
    });
  };

  console.log(row.applicationRequestId);



  function changeName(student_name) {
    const [lastName, firstName] = student_name.split(",");
    const modifiedStudentName = firstName.trim() + " " + lastName.trim();
    return modifiedStudentName;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTranscript = await getCurrentTranscript(row.student.user.id);
        setStudentDetails(currentTranscript);

        const courseGrades = await getCourseGrades([props.courseCode], userID);
        if (courseGrades.length > 0) {
          setStudentDetails((prev) => ({
            ...prev,
            course: {
              courseCode: props.courseCode,
              grade: courseGrades[0].grade,
            },
          }));
        }
      } catch (error) {
        // Centralized error handling or log the error
        console.error("Error fetching data:", error);
        setStudentDetails(null);
      }
    };
    if (userID){
      fetchData();
    }
    
  }, [row.student.user.id, props.courseCode, userID]);


  useEffect(() => {
    getApplicationRequestsByStudentId(row.student.user.id)
      .then((res) => {
        setLaHistory(res);
      })
      .catch((_) => {
      });
  }, [row.student.user.id, courseCode, row.status]);




  return (
    <>
      <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
          {row.student.user.name + " " + row.student.user.surname}
        </TableCell>
        <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
          {studentDetails?.program && studentDetails.program.majors.map((major, index) => (
              <div key={index}>{major}</div>
          ))}
        </TableCell>

        <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} component="th" scope="row">
          {studentDetails?.program && studentDetails.program.minors.map((minor, index) => (
              <div key={index}>{minor}</div>
          ))}
        </TableCell>
        <TableCell sx={{ borderBottom: "none" }} align="left">
          {studentDetails?.course && studentDetails.course.grade}
        </TableCell>

        <TableCell sx={{ borderBottom: "none" }} align="left">
          <Snackbar
            open={snackOpen}
            autoHideDuration={3000}
            onClose={handleSnackClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleSnackClose} severity="success">
              Status is successfully changed
            </Alert>
          </Snackbar>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={row.statusIns} label="Status" onChange={handleChange}>
              <MenuItem value={"ACCEPTED"}>Accepted</MenuItem>
              <MenuItem value={"REJECTED"}>Rejected</MenuItem>
              <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
              <MenuItem value={"WAIT_LISTED"}>Wait Listed</MenuItem>
            </Select>
          </FormControl>

        </TableCell>
        <TableCell sx={{ borderBottom: "none" }} align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
              console.log(row);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow style={{alignItems: "start", verticalAlign: "top"}}>
        <TableCell style={{ paddingBottom: 0, paddingTop: "1rem" ,}} colSpan={2}>
          <td>
            <Collapse in={open} align="top" component="tr" style={{ padding: 0, display: "block",  }}>
              <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" style={{ width: "20rem" }}>
                {/* Q&A Section */}
                {row.qandA.length > 0 && row.qandA.map((element, index) => (
                  <QuestionAnswer
                    key={index}
                    qNo={index + 1}
                    question={element.question}
                    answer={element.answer}
                  />
                ))}
              </Grid>
            </Collapse>
          </td>
        </TableCell>


        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} component="tr" style={{ display: "block" }}>
            <td style={{ width: "100%" }}>
              <LaHistoryTable
                LaHistory={LaHistory}
              />
              <Box sx={{ minWidth: 120, mY: "15px", height: "100%" }} textAlign="center">

                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>

                  <Button
                    variant="outlined"
                    endIcon={<AccountCircleIcon />}
                    sx={{ m: "10px" }}
                    onClick={() => navigate("/profile/" + userID, { replace: false })}
                  >
                    Student Profile
                  </Button>
                </Box>

              </Box>
            </td>
          </Collapse>
        </TableCell>

      </TableRow>
    </>
  );
}

function ApplicantsTable(props) {
  const [sortOrder, setSortOrder] = React.useState(null);
  const [sortedRows, setSortedRows] = React.useState([]);
  const [gradeSortOrder, setGradeSortOrder] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const isApplicantsListEmpty = props.rows.length === 0;

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const filteredRows = sortedRows.filter((row) => {
    const fullName = row.student.user.name.toLowerCase() + " " + row.student.user.surname.toLowerCase();
    return fullName.includes(searchText);
  });

  const sortRows = (rows) => {
    return rows.sort((a, b) => {
      let nameComparison = 0;
      let gradeComparison = 0;

      if (sortOrder === "asc" || sortOrder === "desc") {
        const nameA = a.student.user.name.toLowerCase();
        const nameB = b.student.user.name.toLowerCase();
        nameComparison = nameA.localeCompare(nameB);
        if (sortOrder === "desc") nameComparison *= -1;
      }

      if (gradeSortOrder === "asc" || gradeSortOrder === "desc") {
        const gradeA = a.studentDetails?.course?.grade || 0;
        const gradeB = b.studentDetails?.course?.grade || 0;
        gradeComparison = gradeA - gradeB;
        if (gradeSortOrder === "desc") gradeComparison *= -1;
      }

      return gradeSortOrder ? gradeComparison || nameComparison : nameComparison || gradeComparison;
    });
  };

  useEffect(() => {
    setSortedRows(sortRows([...props.rows]));
  }, [props.rows, sortOrder, gradeSortOrder]);
  console.log(props.rows)

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc");
  };

  const toggleGradeSortOrder = () => {
    setGradeSortOrder(gradeSortOrder === "asc" ? "desc" : gradeSortOrder === "desc" ? null : "asc");
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const getSortIconColor = () => {
    return sortOrder ? (sortOrder === "asc" ? "blue" : "red") : "grey";
  };

  const getGradeSortIconColor = () => {
    return gradeSortOrder ? (gradeSortOrder === "asc" ? "blue" : "red") : "grey";
  };

  const finalizeStatuss = (appId) => {
    try {
      finalizeStatus(appId).then((res) => {
        console.log(res);
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
      <TableContainer component={Paper}>
        {isApplicantsListEmpty ? (
            <Typography variant="h6" align="center" style={{ padding: 20 }}>
                <Alert severity="info">
                  No student has applied yet.
                </Alert>
            </Typography>
        ) : (
            <Table sx={{ minWidth: 600}}  aria-label="simple table">
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
                  <TableCell align="left">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Student Name
                      <IconButton onClick={toggleSortOrder} style={{ color: getSortIconColor() }}>
                        <SwapVertTwoToneIcon />
                      </IconButton>
                      <IconButton onClick={toggleFilterVisibility} style={{ color: isFilterVisible ? 'blue' : undefined }}>
                        <FilterAltIcon />
                      </IconButton>
                    </Box>
                    {isFilterVisible && (
                        <TextField
                            fullWidth
                            size="small"
                            value={searchText}
                            onChange={handleSearchChange}
                            placeholder="Filter by name..."
                        />
                    )}
                  </TableCell>
                  <TableCell align="left">Majors</TableCell>
                  <TableCell align="left">Minors</TableCell>
                  <TableCell align="left">
                    Grade
                    <IconButton onClick={toggleGradeSortOrder} style={{ color: getGradeSortIconColor() }}>
                      <SwapVertTwoToneIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left" sx={{ width: "10rem" }}>Status</TableCell>
                  <TableCell align="left">Details</TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                    <CustomRow
                        appId={props.appId}
                        row={row}
                        courseCode={props.courseCode}
                        index={index}
                        questions={props.questions}
                        key={index}
                    />
                ))}
              </TableBody>
            
              
              <Button
                    variant="outlined"
                    endIcon={<SaveIcon />}
                    sx={{ m: "10px", bgcolor: "green", color: "white", ":hover": { bgcolor: "black"}, float: "right", alignSelf: "center"}}
                    onClick={() => {finalizeStatuss(props.appId)}}
                  >
                    Announce Final Results
              </Button>
              
            </Table>
        )}
      </TableContainer>
  );
}

export default ApplicantsTable;
