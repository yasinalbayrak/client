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
import { getApplicationsByPost, updateApplicationById, getAnnouncement, getTranscript, getApplicationByUsername, getAllAnnouncements } from "../apiCalls";
import { useParams } from "react-router";
import DownloadIcon from '@mui/icons-material/Download';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomRow(props) {
  const { row, index, questions } = props;
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [qAndA, setQAndA] = React.useState([]);
  const [LaHistory, setLaHistory] = React.useState([]);
  const [courseHistory, setCourseHistory] = React.useState([]);
  const [announcements, setAnnouncements] = React.useState([]);
  const [courseTitle, setCourseTitle] = React.useState("");

  useEffect(() => {
    var temp = [];
    if (questions.length !== 0 && row) {
      for (let index = 0; index < row.answers.length; index++) {
        const a = row.answers[index].answer;
        const q = questions[index].question;
        var temp2 = [];
        temp2.push(q);
        temp2.push(a);
        temp.push(temp2);
      }
      console.log(temp);
      setQAndA(temp);
    }
  }, [questions]);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
    updateApplicationById(
      row.id,
      row.student_username,
      row.grade,
      row.faculty,
      row.working_hours,
      event.target.value,
      row.post_id,
      row.answers
    ).then((res) => {
      row.status = event.target.value;
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
    getAllAnnouncements().then((res) => {
      setAnnouncements(res);
    });
  }, [])
  
  useEffect(() => {
    var tmp2 = announcements.filter((annc) => annc.id == row.post_id);
    if (tmp2.length != 0) {
      setCourseTitle(tmp2[0].course_code);
    }
    getApplicationByUsername(row.student_username).then((res) => {
      setLaHistory(res.filter((application) => application.status.toLowerCase() == "accepted"));

      var tempList = [];
      res.map((application) => {
        var tmp = announcements.filter((annc) => annc.id == application.post_id);
        if (tmp.length != 0 && tmp[0].course_code == courseTitle && row.term != application.term) {
          tempList.push(application);
        }
      });
      setCourseHistory(tempList);
    });
  }, [announcements, courseTitle])

  return (
    <>
      <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
          {changeName(row.student_name)}
        </TableCell>
        <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
          {row.faculty}
        </TableCell>
        <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
          {row.grade}
        </TableCell>
        <TableCell sx={{ borderBottom: "none" }} align="left">
          {row.working_hours}
        </TableCell>
        <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", minWidth: 120 }} align="left">
          {row.status}
        </TableCell>
        {/* <TableCell sx={{ borderBottom: "none" }} align="left">
          {row.post_id}
        </TableCell> */}
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} component="tr" style={{ display: "block" }}>
            <td>
              <Grid container direction="column" alignItems="center" justifyContent="center">
                {qAndA.map((element) => (
                  <Grid item container m={2}>
                  <Grid item>
                    <Typography>{element[0]}:</Typography>
                  </Grid>
                      <Grid item>
                        <Typography>{element[1]}</Typography>
                      </Grid>
                      </Grid>
                ))}
                <Grid item container direction="row" alignItems="center" justifyContent="center">
                  <Grid item xs={6}>
                    <Typography><strong>LA History</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography><strong>{courseTitle} History</strong></Typography>
                  </Grid>
                </Grid>
                <Grid item container direction="row" alignItems="center" justifyContent="space-evenly">
                  <Grid item container direction="column" justifyContent="flex-start" xs={6}>
                    {LaHistory.map((application) => (
                      <Grid item>
                        {announcements.filter((annc) => annc.id == application.post_id).map((elem) => (
                          <Typography>{elem.course_code}</Typography>
                        ))}
                      </Grid>
                    ))}
                    {(LaHistory.length == 0) && 
                    <Grid>
                      <Typography>None</Typography>
                    </Grid>
                    }
                  </Grid>
                  <Grid item container direction="column" justifyContent="flex-start" xs={6}>
                    <Grid>
                      <Typography variant="caption" color="gray">(Including rejected)</Typography>
                    </Grid>
                    {courseHistory.map((application) => (
                      <Grid item>
                        <Typography>{application.status} - {application.term}</Typography>
                      </Grid>
                    ))}
                    {(courseHistory.length == 0) && 
                    <Grid>
                      <Typography>None</Typography>
                    </Grid>
                    }
                  </Grid>
                  <Grid item container m={1}>
                      </Grid>
                </Grid>
              </Grid>
            </td>
          </Collapse>
        </TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} component="tr" style={{ display: "block" }}>
            <Box sx={{ minWidth: 120, mY: "15px" }} textAlign="center">
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
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={status} label="Status" onChange={handleChange}>
                  <MenuItem value={"Applied"}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Accepted"}>Accepted</MenuItem>
                  <MenuItem value={"Rejected"}>Rejected</MenuItem>
                  <MenuItem value={"Interested"}>Interested</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" endIcon={<DownloadIcon />} sx={{ m: "20px", marginTop: "35px" }} onClick={() => {
                getTranscript(row.id).then((res) => {
                  const file = new Blob(
                    [res], 
                    {type: 'application/pdf'});
                  //Build a URL from the file
                  const fileURL = URL.createObjectURL(file);
                  // Open the URL on new Window
                  window.open(fileURL);
                  // const link = document.createElement("a");
                  // link.download = 'pdf.pdf';
                  // link.href = fileURL;
                  // link.click();
                });
              }}>Transcript</Button>
            </Box>
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
  const [rows, setRows] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const { postId } = useParams();

  useEffect(() => {
    getApplicationsByPost(postId).then((results) => setRows(results));
    getAnnouncement(postId).then((res) => {
      setQuestions(res.questions);
    });
    console.log(rows);
  }, [props]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#eeeeee" }}>
            <TableCell align="left">Student Name</TableCell>
            <TableCell align="left">Faculty</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell align="left">Working hours</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Details</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <CustomRow row={row} index={index} questions={questions}></CustomRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApplicantsTable;
