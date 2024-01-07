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
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { getApplicationRequestsByStudentId, updateApplicationRequestStatus, getCourseGrades, getCurrentTranscript, getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements } from "../../apiCalls";
import { useParams } from "react-router";
import DownloadIcon from '@mui/icons-material/Download';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import QuestionAnswer from "./QuestionsAndAnswers";
import LaHistoryTable from "./LaHistoryTable";

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
      row.status = toStatus;
      setSnackOpen(true);
      console.log(res);
    });
  };

  function changeName(student_name) {
    const [lastName, firstName] = student_name.split(",");
    const modifiedStudentName = firstName.trim() + " " + lastName.trim();
    return modifiedStudentName;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTranscript = await getCurrentTranscript();
        setStudentDetails(currentTranscript);

        const courseGrades = await getCourseGrades([props.courseCode]);
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

    fetchData();
  }, [row.student.user.id, props.courseCode]);

  // useEffect(() => {
  //   getApplicationRequestsByStudentId(row.student.user.id)
  //     .then((res) => {
  //       const { courseHistory, laHistory } = res.reduce(
  //         (acc, each) => {
  //           each.application.course.courseCode === courseCode ? acc.courseHistory.push(each) : acc.laHistory.push(each);
  //           return acc;
  //         },
  //         { courseHistory: [], laHistory: [] }
  //       );

  //       setLaHistory(laHistory);
  //       setCourseHistory(courseHistory);
  //     })
  //     .catch((_) => {
  //     });
  // }, [row.student.user.id, courseCode]);

  useEffect(() => {
    getApplicationRequestsByStudentId()
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
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={row.status} label="Status" onChange={handleChange}>
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
                  {/* <Button
                    variant="outlined"
                    endIcon={<DownloadIcon />}
                    sx={{ m: "10px", padding: "20px" }}
                    onClick={() => {
                      getTranscript(studentDetails.transcriptId).then((res) => {
                        const base64Content = res.content;

                        // Decode the base64 content
                        const byteCharacters = atob(base64Content);
                        const byteArray = new Uint8Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteArray[i] = byteCharacters.charCodeAt(i);
                        }

                        // Create a Blob from the byte array
                        const file = new Blob([byteArray], { type: 'application/pdf' });

                        // Open the PDF in a new window
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank');
                      });
                    }}
                  >
                    Transcript
                  </Button> */}

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
  // const rows = [
  //     { id: 1, courseCode: 'CS201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B+', wHour: "5", details: "lorem ipsum"},
  //     { id: 2, courseCode: 'CS210', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "5", details: "lorem ipsum"},
  //     { id: 3, courseCode: 'MATH201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A-', wHour: "5", details: "lorem ipsum"},
  //     { id: 4, courseCode: 'CS300', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "5", details: "lorem ipsum"},
  //     { id: 5, courseCode: 'MATH204', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "10", details: "lorem ipsum" },
  //     { id: 6, courseCode: 'ENS206', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B+', wHour: "10", details: "lorem ipsum"},
  //     { id: 7, courseCode: 'ECON201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B', wHour: "5", details: "lorem ipsum"},
  //     { id: 8, courseCode: 'CS301', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "10", details: "lorem ipsum"},
  //     { id: 9, courseCode: 'HUM201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B+', wHour: "5", details: "lorem ipsum"},
  //   ];
  const [questions, setQuestions] = React.useState([]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#eeeeee" }}>
            <TableCell align="left">Student Name</TableCell>
            <TableCell align="left">Majors</TableCell>
            <TableCell align="left">Minors</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell align="left" sx={{ width: "10rem" }}>Status</TableCell>
            <TableCell align="left">Details</TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left"></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => (
            <CustomRow appId={props.appId} row={row} courseCode={props.courseCode} index={index} questions={questions}></CustomRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApplicantsTable;
