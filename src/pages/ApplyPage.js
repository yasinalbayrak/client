import React, { useEffect, useState } from "react";
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
import { applyToPost, getAnnouncement } from "../apiCalls";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const ApplyPage = (props) => {
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
  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [filename, setFile] = useState(() => {
    const initialFileName = "No File Uploaded";
    return initialFileName;
  });

  const onSubmit = () => {
    console.log(questionsAndAnswers);
    var temp = [];
    for (var q in questionsAndAnswers) {
      if (!questionsAndAnswers.hasOwnProperty(q)) continue;

      var temp2 = {};
      temp2.question_id = parseInt(q);
      if (!questionsAndAnswers[q]) {
        for (let index = 0; index < questions.length; index++) {
          const element = questions[index];
          const tempList = JSON.parse(element.multiple_choices);
          if (element.id == q && element.type === "Multiple Choice") {
            temp2.answer = tempList[0];
          }
        }
      } else {
        temp2.answer = questionsAndAnswers[q];
      }
      temp.push(temp2);
    }
    console.log(temp);
    applyToPost(id, username, temp, transcript).then((res) => {
      console.log(res);
    });
    navigate("/success", { replace: true, state: { successText: "You have applied successfully." } });
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
  };

  useEffect(() => {
    getAnnouncement(id).then((results) => setAnnouncementInfo(results));
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
                        defaultValue={JSON.parse(question.multiple_choices)[0]}
                        name="radio-buttons-group"
                        onChange={(e) => {
                          onMultipleChoiceAnswerChange(e, question);
                        }}
                      >
                        {JSON.parse(question.multiple_choices).map((ans, index) => (
                          <FormControlLabel value={ans} control={<Radio />} label={ans}></FormControlLabel>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                  {question.type !== "Multiple Choice" && (
                    <TextField
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
            <Grid item xs={2}></Grid>
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
              <Button variant="contained" startIcon={<SendIcon />} color="success" onClick={onSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ApplyPage;
