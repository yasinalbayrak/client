import React, { useEffect, useRef, useState } from "react";
import AppBarHeader from "../../components/AppBarHeader";
import Sidebar from "../../components/Sidebar";
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
import {  getAnnouncement,applyToPost } from "../../apiCalls";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {toast} from "react-toastify";
import BackButton from "../buttons/BackButton";

const QuestionPage = (props) => {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const state = useSelector((state) => state);
  const name = useSelector((state) => state.user.name);
  const surname = useSelector((state) => state.user.surname);
  const userId = useSelector((state) => state.user.id)
  const { id } = useParams();
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [announcementInfo, setAnnouncementInfo] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const data = useRef();
  const isLoading = useRef();
  const MAX_WORD_COUNT = 512;

 /* const onSubmit = () => {
    var temp = [];
    for (var q in questionsAndAnswers) {
      if (!questionsAndAnswers.hasOwnProperty(q)) continue;

      var temp2 = {};
      temp2.question_id = parseInt(q);
      if (!questionsAndAnswers[q]) {
        for (let index = 0; index < questions.length; index++) {
          const element = questions[index];
          //const tempList = JSON.parse(element.multiple_choices);
          //if (element.id == q && element.type === "Multiple Choice") {temp2.answer = tempList[0];}
        }
      } 
      else {
        temp2.answer = questionsAndAnswers[q];
      }
      temp.push(temp2);
    }
    console.log(temp);

    navigate("/success", { replace: true, state: { successText: "You have applied successfully." } });

  };*/
  const onSubmit = async () => {
    try {
      var temp = [];
  
      for (const questionId in questionsAndAnswers) {
        if (questionsAndAnswers.hasOwnProperty(questionId)) {
          const answer = questionsAndAnswers[questionId];
          const trimmedAnswer = answer.trim();
  
          if (trimmedAnswer !== "") {
            temp.push(trimmedAnswer);
          }
        }
      }
  
      console.log('Constructed temp array:', temp);
  
      // Log other relevant information
      console.log('questionsAndAnswers:', questionsAndAnswers);
  
      // Call applyToPost to post the apply request
      await applyToPost(id, state.user.id, temp);
  
      // Navigate to the success page only if the application submission is successful
      navigate("/Home", { replace: true });
      toast.success("Your application has been received successfully.")
    } catch (error) {
      // Handle any errors during the applyToPost
      console.error('Error during application submission:', error);
      // Optionally, you can show an error message to the user
    }
  };

  const onAnswerChange = (e, index) => {
    e.preventDefault();
    setQuestionsAndAnswers((prev) => ({
      ...prev,
      [index]: e.target.value,
    }));
  };

  /*const onMultipleChoiceAnswerChange = (e, question) => {
    e.preventDefault();
    let temp = questionsAndAnswers;
    for (const [q, a] of Object.entries(temp)) {
      if (q == question.id) {
        temp[q] = e.target.value;
      }
    }
    setQuestionsAndAnswers(temp);
    console.log(questionsAndAnswers);
  };*/

 /*useEffect(() => {
    var temp = {};
    if (questions !== undefined) {
      for (let index = 0; index < questions.length; index++) {
        const element = questions[index].id;
        temp[element] = "";
      }
      setQuestionsAndAnswers(temp);
    }
  }, [questions]);*/

  useEffect(() => {
    if (announcementInfo?.questions !== undefined) {
      setQuestions(announcementInfo.questions);
    }
  }, [announcementInfo]);

  useEffect(() => {
    // Ensure 'id' is available and not undefined or null
    if (id) {
      const fetchAnnouncement = async () => {
        try {
          // Now we're sure 'id' is passed to 'getAnnouncement'
          const results = await getAnnouncement(id);
          setAnnouncementInfo(results);
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

  

  useEffect(() => {
     setQuestions(announcementInfo?.questions);
     if (announcementInfo?.questions !== undefined) {
       let temp = questionsAndAnswers;
       announcementInfo.questions.map((q) => {
         temp[q.id] = "";
       });
       setQuestionsAndAnswers(temp);
     }
   }, [announcementInfo]);

   console.log(announcementInfo?.questions)
   console.log("questions")
   console.log(questions)
  return (
    <>
      {(!announcementInfo) ? (<div>Loading...</div>) : 
      (
        <Box sx={{ display: "flex" }}>
          <Sidebar></Sidebar>
          <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
            <BackButton to={`/apply/${id}`} />
            <AppBarHeader />
            <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
              <Grid item>
                <Typography variant="h4">{announcementInfo.course.courseCode} LA Application</Typography>
                <Divider></Divider>
              </Grid>
              
              <Grid item>
                <Typography variant="h5">Questions:</Typography>
              </Grid>
              {questions &&
                questions.map((question, index) => (
                  <Grid item container direction="column" sx={{ border: 1, borderRadius: 3, borderColor: "#cccccc", backgroundColor: "#f5f5f5", marginY: 2, p: 2 }}>
                    <Grid item sx={{ m: 1 }}>
                      <Typography>Question {index + 1} - {question.question}</Typography>
                    </Grid>
                    <Grid item sx={{ m: 1 }}>
                      {/*question.type === "Multiple Choice" && (
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
                            )*/}
                      {question.type !== "Multiple Choice" && (
                        <>
                          <TextField
                        value={questionsAndAnswers[index] || ""}
                        onChange={(e) => onAnswerChange(e, index)}
                        multiline
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                        inputProps={{ maxLength: 512 }}
                      ></TextField>
                        <Typography variant="body2" style={{marginTop: '7px', marginLeft: '3px', width: '100%', fontSize: '11px' }}>
                      Remaining Characters: {MAX_WORD_COUNT - (questionsAndAnswers[index]?.length || 0)}
                    </Typography></>
                      )}
                    </Grid>
                  </Grid>
                  
                  
                  
                ))}
            </Grid>
            <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                <Grid item>
                  <Button variant="contained" startIcon={<ArrowForwardIcon />} color="success" onClick={onSubmit}>
                  Complete the application
                  </Button>
                </Grid>
              </Grid>
          </Box>
        </Box>
      )}
    </>
  );

};


export default QuestionPage;
