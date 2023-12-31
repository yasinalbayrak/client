import React, { useEffect, useRef, useState } from "react";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import {
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { applyToPost, getAnnouncement, postTranscript } from "../apiCalls";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { getCurrentTranscript } from "../apiCalls";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import BackButton from "../components/buttons/BackButton";


const ApplyPage = (props) => {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const state = useSelector((state) => state);
  const name = useSelector((state) => state.user.name);
  const surname = useSelector((state) => state.user.surname);
  const userID = useSelector((state) => state.user.id);
  const [studentInfo, setstudentInfo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTranscript = await getCurrentTranscript();
        setstudentInfo(currentTranscript);

      } catch (error) {
        // Centralized error handling or log the error
        console.error("Error fetching data:", error);
        setstudentInfo(null);
      }
    };

    fetchData();
  }, [userID]);
  const rows = [
    { name: "Student ID:", val: studentInfo?.studentSuId },
    { name: "Name Surname:", val: studentInfo?.studentName },
    { name: "GPA:", val: studentInfo?.cumulativeGPA },
    { name: "Current term:", val: studentInfo?.term },
    { name: "Faculty:", val: studentInfo?.faculty },
    { name: "Major:", val: studentInfo?.program?.majors },
    { name: "Minor:", val: studentInfo?.program?.minors },
    { name: "Year:", val: studentInfo?.year },

  ];
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [announcementInfo, setAnnouncementInfo] = useState(null);
  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [filename, setFile] = useState(() => {
    const initialFileName = "No File Uploaded";
    return initialFileName;
  });

  const data = useRef();
  const isLoading = useRef();



  console.log(state.user)

  const onAnswerChange = (e, question) => {
    e.preventDefault();
    let temp = questionsAndAnswers;
    for (const [q, a] of Object.entries(temp)) {
      if (q == question.id) {
        temp[q] = e.target.value;
      }
    }
    setQuestionsAndAnswers(temp);
  };

  const onMultipleChoiceAnswerChange = (e, question) => {
    e.preventDefault();
    let temp = questionsAndAnswers;
    for (const [q, a] of Object.entries(temp)) {
      if (q == question.id) {
        temp[q] = e.target.value;
      }
    }
    setQuestionsAndAnswers(temp);
    console.log(questionsAndAnswers);
  };

  useEffect(() => {
    var temp = {};
    if (questions !== undefined) {
      for (let index = 0; index < questions.length; index++) {
        const element = questions[index].id;
        temp[element] = "";
      }
      setQuestionsAndAnswers(temp);
    }
  }, [questions]);

  const onFileChange = (e) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    setTranscript(file);
    const { name } = file;
    setFile(name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", userID)
    console.log(formData);

    postTranscript(formData).then((res) => {
      console.log(res);
    }
    );
  };

  const onFileSubmit = () => {

  }

  useEffect(() => {
    if (transcript) {
      console.log("Transcript is added correctly:" + transcript);
    } else {
      console.log("Transcript is not added correctly.");
    }
  }, [transcript]);

  useEffect(() => {
    // Ensure 'id' is available and not undefined or null
    if (id) {
      const fetchAnnouncement = async () => {
        try {
          // Now we're sure 'id' is passed to 'getAnnouncement'
          const results = await getAnnouncement(id);
          setAnnouncementInfo(results);
          data.current = results;
          isLoading.current = false;
          console.log(results);
        } catch (error) {
          console.error('Failed to fetch announcement:', error);
        }
      };

      fetchAnnouncement(); // Execute the function
    } else {
      console.warn('Warning: missing ID.');
    }
  }, [id]); // Dependency array is correct, assuming 'id' changes when expected
  return (
    <>
      {(!announcementInfo) ? (<div>Loading...</div>) : (
        <Box sx={{ display: "flex" }}>
          <Sidebar></Sidebar>
          <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
            <BackButton to={"/home"} />
            <AppBarHeader />
            <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
              <Grid item>
                <Typography variant="h4">{announcementInfo.course.courseCode} LA Application</Typography>
                <Divider></Divider>
              </Grid>
              <Grid item sx={{ m: 2 }}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 500, border: 1.5, borderColor: "#cccccc" }} aria-label="simple table">
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row" align="center" sx={index % 2 === 0 && { backgroundColor: "#f2f2f2" }}>
                            {row.name}
                          </TableCell>
                          <TableCell align="center" sx={index % 2 === 0 && { backgroundColor: "#f2f2f2" }}>
                            {row.val}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid>
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="info">
                    You are applying with the information above. If there is a mistake, you can upload another transcript.  — <strong>Please upload your most current transcript!</strong>
                  </Alert>
                </Stack>
              </Grid>
              <br></br>
              <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                <Grid item>
                  <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => navigate("/transcriptUploadPage/" + id, { replace: true })} color="primary">
                    Upload new transcript
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" startIcon={<SendIcon />} color="success" onClick={() => navigate("/eligibilityPage/" + id)}>
                    Check my eligibility
                  </Button>
                  {/* {announcementInfo.questions.length > 0 ? (
                  <Button variant="contained" startIcon={<SendIcon />} color="success" onClick={() => navigate("/questionPage/"+ id, { replace: true })}>
                  Continue with questions
                  </Button>
                  ) : (
                    <Button variant="contained" startIcon={<ArrowForwardIcon />} color="success" onClick={onSubmit}>
                      Complete the application
                    </Button>
                  )} */}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );

};


export default ApplyPage;
