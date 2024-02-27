import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import UpdateIcon from '@mui/icons-material/Update';
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "../components/Sidebar";
import AppBarHeader from "../components/AppBarHeader";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { getAnnouncement, getApplicationByUsername, updateApplicationById, getCurrentTranscript, getApplicationRequestById, updateApplicationRequest, withdrawApplication} from "../apiCalls";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import SendIcon from "@mui/icons-material/Send";
import BackButton from "../components/buttons/BackButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
import Popup from "../components/popup/Popup";
import { toast } from 'react-toastify';

function EditApplyPage() {
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
        const currentTranscript = await getCurrentTranscript(userID);
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
    { name: "Major:", val: studentInfo?.program?.majors},
    { name: "Minor:", val: studentInfo?.program?.minors },
    { name: "Year:", val: studentInfo?.year },

  ];
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [appReqInfo, setAppReqInfo] = useState(null);
  const [applicationInfo, setApplicationInfo] = useState({});
  const [applicationId, setApplicationId] = useState();
  const [defaultAnswers, setDefaultAnswers] = useState([]);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [answerIds, setAnswerIds] = useState([]);
  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [filename, setFile] = useState(() => {
    const initialFileName = username + "_transcript.pdf";
    return initialFileName;
  });

  const data = useRef();
  const isLoading = useRef();

  const [withdrawPopupOpened, setWithdrawPopupOpened] = useState(false);

  const flipPopup = () => {
    setWithdrawPopupOpened((prev) => !prev);
  };

  const withdrawApplicationn = () => {
    
    flipPopup()
    withdrawApplication(id).then((_) => {
      navigate("/home", { replace: true });
      toast.success("Your application has been withdrawn successfully.")
    }).catch((_) => (null))

    
    
  }

  useEffect(() => {
    // Ensure 'id' is available and not undefined or null
    if (id) {
      const fetchApplicationRequest = async () => {
        try {
          // Now we're sure 'id' is passed to 'getAnnouncement'
          const results = await getApplicationRequestById(id);
          setAppReqInfo(results);
          setApplicationId(results.application.applicationId);
          data.current = results;
          isLoading.current = false;
          console.log(results);
        } catch (error) {
          console.error('Failed to fetch app request:', error);
        }
      };

      fetchApplicationRequest(); // Execute the function
    } else {
      console.warn('Warning: missing ID.');
    }
  }, [id]); // Dependency array is correct, assuming 'id' changes when expected
  

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
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

  useEffect(() => {
    if (transcript) {
      console.log("Transcript is added correctly:" + transcript);
    } else {
      console.log("Transcript is not added correctly.");
    }
  }, [transcript]);

  const onSubmit = () => {
    console.log(questionsAndAnswers);
    var temp = [];
    var idx = 0;
    for (var q in questionsAndAnswers) {
      if (!questionsAndAnswers.hasOwnProperty(q)) continue;

      var temp2 = {};
      temp2.question_id = parseInt(q);
      temp2.id = answerIds[idx];
      if (!questionsAndAnswers[q]) {
        for (let index = 0; index < questions.length; index++) {
          const element = questions[index];
          if (element.id == q && element.type !== "Multiple Choice") {
            temp2.answer = defaultAnswers[index];
          }
          if (element.id == q && element.type === "Multiple Choice") {
            temp2.answer = defaultAnswers[index];
          }
        }
      } else {
        temp2.answer = questionsAndAnswers[q];
      }
      temp.push(temp2);
      idx += 1;
    }
    console.log(temp);
    let intID = parseInt(id);
    console.log(
      applicationInfo.id,
      applicationInfo.student_username,
      applicationInfo.grade,
      applicationInfo.faculty,
      applicationInfo.working_hours,
      applicationInfo.status,
      intID,
      temp,
      transcript
    );
    if (transcript && transcript.size > 1000000) {
      setSnackOpen(true);
      console.log("file too big")
      return;
    }
    try{
      updateApplicationById(
        applicationInfo.id,
        applicationInfo.student_username,
        applicationInfo.grade,
        applicationInfo.faculty,
        applicationInfo.working_hours,
        applicationInfo.status,
        intID,
        temp,
        transcript
      ).then((res) => {
        console.log(res);
        if (res == "invalid transcript") {
          setSnackOpen(true);
        }
        else {
          navigate("/home", { replace: true, state: { successText: "Your application has been successfully updated." } });
        }
      });
    }
    catch (error) {
    }
    
  };

  const onSubmit2 = () => {
    console.log(questionsAndAnswers);
    let intID = parseInt(id);
    console.log(
      appReqInfo.applicationRequestId,
      appReqInfo.application.applicationId,
      appReqInfo.qandA
    );
    var temp = [];
    var idx = 0;
    for (var q in questionsAndAnswers) {
      if (!questionsAndAnswers.hasOwnProperty(q)) continue;

      var temp2 = {};
      temp2.question_id = parseInt(q);
      temp2.id = answerIds[idx];
      if (!questionsAndAnswers[q]) {
        for (let index = 0; index < questions.length; index++) {
          const element = questions[index];
          if (element.id == q && element.type !== "Multiple Choice") {
            temp2.answer = defaultAnswers[index];
          }
          if (element.id == q && element.type === "Multiple Choice") {
            temp2.answer = defaultAnswers[index];
          }
        }
      } else {
        temp2.answer = questionsAndAnswers[q];
      }
      temp.push(temp2);
      idx += 1;
    }
    console.log(temp);
    
    if (transcript && transcript.size > 1000000) {
      setSnackOpen(true);
      console.log("file too big")
      return;
    }
    try{
      updateApplicationRequest(
        appReqInfo.applicationRequestId,
      appReqInfo.application.applicationId,
      "",
      appReqInfo.qandA
      ).then((res) => {
        console.log(res);
        if (res == "invalid transcript") {
          setSnackOpen(true);
        }
        else {
          navigate("/home", { replace: true, state: { successText: "Your application has been successfully updated." } });
        }
      });
    }
    catch (error) {
    }
    
  };

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
    var ct = 0;
    for (const [q, a] of Object.entries(temp)) {
      if (q == question.id) {
        temp[q] = e.target.value;
        var defaultTemp = [...defaultAnswers];
        defaultTemp[ct] = e.target.value;
        setDefaultAnswers(defaultTemp);
      }
      ct += 1;
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
  };
  
  // useEffect(() => {
  //   getAnnouncement(id).then((results) => {
  //     setAnnouncementInfo(results);
  //   });
  //   // ----------
  // }, [id]);

  // useEffect(() => {
  //   setQuestions(announcementInfo.questions);
  //   if (announcementInfo.questions !== undefined) {
  //     let temp = questionsAndAnswers;
  //     announcementInfo.questions.map((q) => {
  //       temp[q.id] = "";
  //     });
  //     setQuestionsAndAnswers(temp);
  //   }
  //   getApplicationByUsername(username).then((results) => {
  //     for (let index = 0; index < results.length; index++) {
  //       const element = results[index];
  //       console.log(element, announcementInfo.id);
  //       if (element.post_id === announcementInfo.id) {
  //         setApplicationInfo(element);
  //         var tmpAnswers = [];
  //         var tmpIds = [];
  //         for (let i = 0; i < element.answers.length; i++) {
  //           const ans = element.answers[i];
  //           tmpAnswers.push(ans.answer);
  //           tmpIds.push(ans.id);
  //         }
  //         setAnswerIds(tmpIds);
  //         setDefaultAnswers(tmpAnswers);
  //         console.log(tmpAnswers);
  //       }
  //     }
  //   });
  // }, [announcementInfo]);

  
  console.log(appReqInfo)
  console.log(data.current)

  return (
    <>
      {(!appReqInfo) ? (<div>Loading...</div>) : (
        <Box sx={{ display: "flex" }}>
          <Sidebar></Sidebar>
          <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
            <BackButton to={"/home"}/>
            <AppBarHeader />
            <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
              <Grid item>
                <Typography variant="h4">{appReqInfo.application.course?.courseCode} LA Application Edit Page</Typography>
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
                  You are editing your application with the information above. If there is a mistake, you can upload another transcript.  — <strong>Please upload your most current transcript!</strong>
                  </Alert>
                </Stack>
              </Grid>
              <br></br>
            <Grid direction="column" alignItems="center" display="flex">
              <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                <Grid item>
                  <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => navigate("/transcriptUploadPage/"+id, { replace: true })} color="primary">
                    Upload new transcript
                  </Button>
                </Grid>
                <Grid item>
                  {appReqInfo.application?.questions.length > 0 ? (
                  <Button variant="contained" startIcon={<SendIcon />} color="success" onClick={() => navigate("/edit-questionPage/"+ id, { replace: true })}>
                  Continue with questions
                  </Button>
                  ) : (
                    <Button variant="contained" startIcon={<ArrowForwardIcon />} color="success" onClick={onSubmit2}>
                      Complete the application
                    </Button>
                  )}
                </Grid>
              </Grid>
              <br></br>
              <Grid>
                
                  <Button variant="contained" startIcon={<ClearIcon />} color="error" onClick={flipPopup}>
                  Withdraw the application
                  </Button>
                  <Popup
                  opened={withdrawPopupOpened}
                  flipPopup={flipPopup}
                  title={"Confirm Withdrawal?"}
                  text={"This action is irreversible, and the selected application will be permanently withdrawed."}
                  posAction={withdrawApplicationn}
                  negAction={flipPopup}
                  posActionText={"Withdraw"}
                />
              </Grid>
            </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
}

export default EditApplyPage;
