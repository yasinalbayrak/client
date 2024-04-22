import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, IconButton, Collapse, Snackbar, Grid, Button, Divider, Tab, Container, Tooltip } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { getApplicationRequestsByStudentId, updateApplicationRequestStatus, getCourseGrades, getCurrentTranscript, getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements, finalizeStatus, acceptAllRequestByAppId, rejectAllRequestByAppId, getStudentLaHistory } from "../../apiCalls";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import QuestionAnswer from "./QuestionsAndAnswers";
import LaHistoryTable from "./LaHistoryTable";
import ReqCourseGrades from "./ReqCourseGrades";
import TextField from '@mui/material/TextField';
import Popup from "../../components/popup/Popup";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { borders } from '@mui/system';
import { toast } from "react-toastify";
import { handleInfo } from "../../errors/GlobalErrorHandler";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Avatar from '@mui/material/Avatar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomRow(props) {
  const { row, index, questions, appId, courseCode, ann } = props;
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [LaHistory, setLaHistory] = React.useState([]);
  const [userID, setUserID] = React.useState("");
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = React.useState({});
  const [laHistoryPage, setLaHistoryPage] = React.useState(0);
  const [requiredCourses, setRequiredCourses] = React.useState([]);

  console.log(row);
  console.log(ann);


  const determineCommitmentStatus = () => {
    if (row.committed && row.forgiven) {
      return 'Error';  // Both true
    } else if (row.committed && !row.forgiven) {
      return 'Committed';  // Committed true, forgiven false
    } else if (!row.committed && row.forgiven) {
      return 'Forgiven';  // Committed false, forgiven true
    } else {
      return 'Not Committed';  // Both false
    }
  };

  useEffect(() => {
    const prevCourseGrades = ann.previousCourseGrades;
    const transcript = row.transcript;

    console.log(prevCourseGrades);
    console.log(transcript);

    prevCourseGrades.map((req) => {
      const course = transcript.course.find((course) => course.courseCode === req.course.courseCode);

      setRequiredCourses((prev) => [
        ...prev,
        {
          courseCode: req.course.courseCode,
          grade: course.grade

        }
      ]);
    });

  }, []);

  console.log(requiredCourses);



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
    if (userID) {
      fetchData();
    }

  }, [row.student.user.id, props.courseCode, userID]);


  useEffect(() => {
    getStudentLaHistory(row.student.user.id, props.appId, laHistoryPage)
      .then((res) => {
        setLaHistory(res);
      })
      .catch((_) => {
      });
  }, [row.student.user.id, props.appId, row.status, laHistoryPage]);


  const handlePageChange = (event, value) => {
    setLaHistoryPage(value - 1);
  };





  return (
    <>
      <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell sx={{  borderBottom: "none" }} align="left">
          <Avatar
            src={row.student.user.photoUrl}
            alt="Student Photo"
            sx={{ width: 64, height: 64 }}
            slotProps={{
              img: {
                style: {
                  padding: "0px",
                  height: '100%',
                  width: '100%',
                  objectFit: 'fill',
                  
                }
              }
            }}
          />
        </TableCell>
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
        <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
          {studentDetails?.cumulativeGPA}
        </TableCell>
        <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
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
          <FormControl fullWidth color={row.statusIns !== row.status ? "info" : ""} focused={row.statusIns !== row.status ? "True" : ""}>
            <InputLabel id="demo-simple-select-label">{row.statusIns !== row.status ? "Status (!!)" : "Status"}</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={row.statusIns} label={row.statusIns !== row.status ? "Status(!!)" : "Status"} onChange={handleChange}>

              <MenuItem value={"Accepted"}>Accepted</MenuItem>
              <MenuItem value={"Rejected"}>Rejected</MenuItem>
              <MenuItem value={"In Progress"}>In Progress</MenuItem>
              <MenuItem value={"Added to Waiting List"}>Wait Listed</MenuItem>
            </Select>
          </FormControl>

        </TableCell>
        <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
          {determineCommitmentStatus()}
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
      <TableRow style={{ alignItems: "start", verticalAlign: "top" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: "1rem", }} colSpan={2}>
          <td>
            <Collapse in={open} align="top" component="tr" style={{ padding: 0, display: "block", }}>
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

        {requiredCourses.length > 0 &&
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} >
            <Collapse in={open} component="tr" style={{ display: "block" }}>
              <td style={{ width: "100%" }}>
                <ReqCourseGrades
                  requiredCourses={requiredCourses}
                />
              </td>
            </Collapse>
          </TableCell>}




        <TableCell style={{ paddingBottom: 0, paddingTop: 0, allign: "right" }} colSpan={8}>
          <Collapse in={open} component="tr" style={{ display: "block" }}>
            <td style={{ width: "100%", paddingLeft: "16rem" }}>
              <Stack spacing={0}>
                <LaHistoryTable
                  LaHistory={LaHistory}
                />

                <Pagination count={LaHistory.totalPages} page={laHistoryPage + 1} onChange={handlePageChange} />
              </Stack>

            </td>
            <Box sx={{ height: "100%" }} textAlign="center">

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

  const [finalizePopoUpOpened, setFinalizePopoUpOpened] = React.useState(false);
  const ann = props.announcement;

  console.log(ann);
  console.log(props.rows);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const flipPopup = () => {
    setFinalizePopoUpOpened((prev) => !prev);
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


  const finalizeStatuss = (appId) => {
    try {
      finalizeStatus(appId).then((res) => {
        console.log(res);
        handleInfo("Changes are successfully finalized.")
        props.setRows(res);
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleAcceptAll = () => {
    acceptAllRequestByAppId(props.appId).then(() => {

      setSortedRows((prev) => prev.map(
        (row) => ({ ...row, statusIns: "Accepted" })
      ))
    }).catch(_ => {
      console.error("Error");
    })
  }
  const handleRejectAll = () => {
    rejectAllRequestByAppId(props.appId).then(() => {
      setSortedRows((prev) => prev.map(
        (row) => ({ ...row, statusIns: "Rejected" })
      ))
    }).catch(_ => {
      console.error("Error");
    })
  }

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
    <Box>
      {isApplicantsListEmpty ? (
        <Typography variant="h6" align="center" style={{ padding: 20 }}>
          <Alert severity="info">
            No student has applied yet.
          </Alert>
        </Typography>
      ) : (
        <>


          <TableContainer component={Paper} sx={{
            overflow: "auto",
            scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }
          }}>
            <Table sx={{ minWidth: 600 }} stickyHeader aria-label="simple table" >
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
                  <StyledTableCell align="left">

                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Student Name
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton onClick={toggleSortOrder} style={{ marginBottom: '-10px' }}>
                          <ArrowDropUpIcon />
                        </IconButton>
                        <IconButton onClick={toggleSortOrder} style={{ marginTop: '-8px' }}>
                          <ArrowDropDownIcon />
                        </IconButton>
                      </Box>
                      <IconButton onClick={toggleFilterVisibility} style={{ color: isFilterVisible ? 'blue' : undefined, marginLeft: '-10px' }}>
                        <SearchIcon />
                      </IconButton>
                    </Box>
                    {isFilterVisible && (
                      <TextField
                        fullWidth
                        size="small"
                        value={searchText}
                        onChange={handleSearchChange}
                        placeholder="Search by name..."
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="left">Majors</StyledTableCell>
                  <StyledTableCell align="left">Minors</StyledTableCell>
                  <StyledTableCell align="left">GPA</StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Grade
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton onClick={toggleGradeSortOrder} style={{ marginBottom: '-10px' }}>  {/* Decrease marginBottom here */}
                          <ArrowDropUpIcon />
                        </IconButton>
                        <IconButton onClick={toggleGradeSortOrder} style={{ marginTop: '-8px' }}>
                          <ArrowDropDownIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="left" sx={{ width: "10rem" }}>Status</StyledTableCell>
                  <StyledTableCell align="left" sx={{ width: "10rem" }}>Commitment Status</StyledTableCell>
                  <StyledTableCell align="left">Details</StyledTableCell>

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
                    ann={ann}
                  />
                ))}
              </TableBody>



            </Table>
          </TableContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}>
            <Button variant="outlined" color="success" sx={{ marginRight: "1rem", marginTop: "0.5rem" }}
              onClick={handleAcceptAll}
            >
              Accept all
            </Button>
            <Button variant="outlined" color="error"
              onClick={handleRejectAll}
              sx={{ marginTop: "0.5rem", marginRight: "1rem" }}
            >
              Reject all
            </Button>

            <div container style={{
              display: "flex",
              alignItems: "start",
              marginTop: "0.5rem",
              direction: "columns",

            }}>
              <Button
                variant="outlined"
                endIcon={<SaveIcon />}
                sx={{ bgcolor: "green", color: "white", ":hover": { bgcolor: "black" }, float: "right", alignSelf: "center" }}
                onClick={flipPopup}
              >
                Announce Final Results
              </Button>
              <Tooltip
                title="(!!) stands for the students who have different status than the final status. (e.g. Accepted but not finalized yet.)"
                placement="right"
                sx={{ fontSize: 'small' }}
                arrow

              >
                <HelpCenterIcon />

              </Tooltip>
            </div>

          </div>

          <Popup
            opened={finalizePopoUpOpened}
            flipPopup={flipPopup}
            title={"Confirm Announcing Final Status?"}
            text={"If there would be a final status announcement, all the students will be notified about their final status. Are you sure you want to announce the final status?\n Final status can be done again after this action."}
            posAction={() => { finalizeStatuss(props.appId); flipPopup(); props.setFinalize((prev) => !prev); }}
            negAction={flipPopup}
            posActionText={"Finalize"}
          />

        </>

      )}
    </Box>

  );
}

export default ApplicantsTable;
