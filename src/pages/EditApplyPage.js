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
import React, { useEffect, useState } from "react";
import UpdateIcon from '@mui/icons-material/Update';
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "../components/Sidebar";
import AppBarHeader from "../components/AppBarHeader";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { getAnnouncement, getApplicationByUsername, updateApplicationById } from "../apiCalls";

function EditApplyPage() {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const name = useSelector((state) => state.user.name);
  const surname = useSelector((state) => state.user.surname);
  const rows = [
    { name: "Student ID:", val: "00000000" },
    { name: "Name - Surname:", val: name + " " + surname },
    { name: "Admit term:", val: "-" },
    { name: "Faculty:", val: "-" },
    { name: "Program:", val: "-" },
  ];
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [announcementInfo, setAnnouncementInfo] = useState({});
  const [applicationInfo, setApplicationInfo] = useState({});
  const [defaultAnswers, setDefaultAnswers] = useState([]);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [answerIds, setAnswerIds] = useState([]);
  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [filename, setFile] = useState(() => {
    const initialFileName = username + "_transcript.pdf";
    return initialFileName;
  });

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

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
        navigate("/success", { replace: true, state: { successText: "Your application has been successfully updated." } });
      }
    });
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
  
  useEffect(() => {
    getAnnouncement(id).then((results) => {
      setAnnouncementInfo(results);
    });
    // ----------
  }, [id]);

  useEffect(() => {
    setQuestions(announcementInfo.questions);
    if (announcementInfo.questions !== undefined) {
      let temp = questionsAndAnswers;
      announcementInfo.questions.map((q) => {
        temp[q.id] = "";
      });
      setQuestionsAndAnswers(temp);
    }
    getApplicationByUsername(username).then((results) => {
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        console.log(element, announcementInfo.id);
        if (element.post_id === announcementInfo.id) {
          setApplicationInfo(element);
          var tmpAnswers = [];
          var tmpIds = [];
          for (let i = 0; i < element.answers.length; i++) {
            const ans = element.answers[i];
            tmpAnswers.push(ans.answer);
            tmpIds.push(ans.id);
          }
          setAnswerIds(tmpIds);
          setDefaultAnswers(tmpAnswers);
          console.log(tmpAnswers);
        }
      }
    });
  }, [announcementInfo]);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
        <AppBarHeader />
        <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
          <Grid item>
            <Typography variant="h4">{announcementInfo.course_code} LA Application</Typography>
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
          <Grid item>
            <Typography variant="h5">Questions</Typography>
          </Grid>
          {questions &&
            questions.map((question, index) => (
              <Grid item container direction="column" sx={{ border: 1, borderRadius: 3, borderColor: "#cccccc", backgroundColor: "#f5f5f5", marginY: 2, p: 2 }}>
                <Grid item sx={{ m: 1 }}>
                  <Typography>Question {index + 1} - {question.question}</Typography>
                </Grid>
                <Grid item sx={{ m: 1 }}>
                  {question.type === "Multiple Choice" && (
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={defaultAnswers[index] ? defaultAnswers[index] : "a"}
                        name="radio-buttons-group"
                        onChange={(e) => {
                          onMultipleChoiceAnswerChange(e, question);
                        }}
                      >
                        {JSON.parse(question.multiple_choices).map((ans) => (
                            <FormControlLabel value={ans} control={<Radio />} label={ans}></FormControlLabel>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                  {question.type !== "Multiple Choice" && (
                    <TextField
                      defaultValue={defaultAnswers[index]}
                      name={question}
                      value={questionsAndAnswers.question}
                      onChange={(e) => {
                        onAnswerChange(e, question);
                      }}
                      multiline
                      fullWidth
                      sx={{ backgroundColor: "white", display: "flex" }}
                    ></TextField>
                  )}
                </Grid>
              </Grid>
            ))}
          <Grid item container direction="rows" alignItems="center" justifyContent="center" sx={{ m: 1, marginBottom: 3 }}>
            <Grid item xs={2}>
              <Snackbar
                open={snackOpen}
                autoHideDuration={10000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert onClose={handleSnackClose} severity="error">
                  File upload error. File needs to be a PDF of transcript and less than 1MB.
                </Alert>
              </Snackbar></Grid>
            <Grid item xs={2}>
              <Typography textAlign="center">Upload your transcript:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid item container direction="rows">
                <Button variant="contained" component="label">
                  Upload File
                  <input type="file" hidden onChange={onFileChange} />
                </Button>
                <Typography alignItems="center" justifyContent="center" textAlign="center" m={2}>
                  {filename}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
          <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
            <Grid item>
              <Button variant="contained" startIcon={<CloseIcon />} onClick={() => navigate("/home", { replace: true })} color="error">
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" startIcon={<UpdateIcon />} color="success" onClick={onSubmit}>
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default EditApplyPage;
