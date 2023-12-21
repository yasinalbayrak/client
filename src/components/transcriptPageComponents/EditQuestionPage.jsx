
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
import {  applyToPost,getApplicationRequestById,updateApplicationRequest } from "../../apiCalls";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {toast} from "react-toastify";
import BackButton from "../buttons/BackButton";

const EditQuestionPage = (props) => {

    const navigate = useNavigate();
    const username = useSelector((state) => state.user.username);
    const state = useSelector((state) => state);
    const name = useSelector((state) => state.user.name);
    const surname = useSelector((state) => state.user.surname);
    const userId = useSelector((state) => state.user.id)
    const { id } = useParams();
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [appReqInfo, setAppReqInfo] = useState(null);
    const data = useRef();
    const isLoading = useRef();
    const MAX_WORD_COUNT = 512;


    const onSubmit = async () => {
        try {
      
          // Call applyToPost to post the apply request
          await updateApplicationRequest(id, appReqInfo.application.applicationId , state.user.id, answers);
      
          // Navigate to the success page only if the application submission is successful
          navigate("/Home", { replace: true });
          toast.success("Your application has been edited successfully.")
        } catch (error) {
          // Handle any errors during the applyToPost
          console.error('Error during application submission:', error);
          // Optionally, you can show an error message to the user
        }
      };
    
      const onAnswerChange = (e, index) => {
        e.preventDefault();
        setAnswers((prev) => ([...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)]));
      };

      // useEffect(() => {
      //   setAppReqInfo((prev)=>({
      //       ...prev,
      //       qandA:questionsAndAnswers,
      //       }));
      //   }, [questionsAndAnswers]);
    
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
        console.log(appReqInfo)
        if (appReqInfo?.qandA !== undefined) {
          setQuestionsAndAnswers(appReqInfo.qandA);
        }
      }, [appReqInfo]);
    
      useEffect(() => {
        // Ensure 'id' is available and not undefined or null
        if (id) {
          const fetchAnnouncement = async () => {
            try {
              // Now we're sure 'id' is passed to 'getAnnouncement'
              const results = await getApplicationRequestById(id);
              setAppReqInfo(results);
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
        let temp = [];

        for(let i = 0; i < appReqInfo?.qandA.length; i++){
          console.log(appReqInfo?.qandA[i].answer)
          temp.push(appReqInfo?.qandA[i].answer);
        }        

        setAnswers(temp);
      }, [appReqInfo]);
    
      // console.log("appReqInfo")
      // console.log(appReqInfo)
      //  console.log(appReqInfo?.qandA)
      //  console.log("questionsAndAnswers")
      //  console.log(questionsAndAnswers)
      //   console.log("answers")
      //   console.log(answers)

       return(
        <>
        {(!appReqInfo) ? (<div>Loading...</div>) : 
      (
        
        <Box sx={{ display: "flex" }}>
          <Sidebar></Sidebar>
          <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
              <BackButton to={`/edit-apply/${id}`} />
              <AppBarHeader />
            <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
              <Grid item>
                <Typography variant="h4">{appReqInfo.application.course?.courseCode} LA Application Edit</Typography>
                <Divider></Divider>
              </Grid>
              
              <Grid item>
                <Typography variant="h5">Questions:</Typography>
              </Grid>
              {questionsAndAnswers &&
                questionsAndAnswers.map((qAnda, index) => (
                  <Grid item container direction="column" sx={{ border: 1, borderRadius: 3, borderColor: "#cccccc", backgroundColor: "#f5f5f5", marginY: 2, p: 2 }}>
                    <Grid item sx={{ m: 1 }}>
                      <Typography>Question {index + 1} - {qAnda.question.question}</Typography>
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
                      {/* {question.type !== "Multiple Choice" && (
                        <TextField
                        value={questionsAndAnswers[index] || ""}
                        onChange={(e) => onAnswerChange(e, index)}
                        multiline
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                      ></TextField>
                      )} */}
                        <>
                        <TextField
                            value={answers[index] || ""}
                            onChange={(e) => onAnswerChange(e, index)}
                            multiline
                            fullWidth
                            sx={{ backgroundColor: "white" }}
                            inputProps={{ maxLength: 512 }}
                        ></TextField>
                        <Typography variant="body2" style={{marginTop: '7px', marginLeft: '3px', width: '100%', fontSize: '11px' }}>
                            Remaining Characters: {MAX_WORD_COUNT - (answers[index]?.length || 0)}
                        </Typography></>
                    </Grid>
                  </Grid>
                  
                  
                  
                ))}
            </Grid>
            <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                <Grid item>
                  <Button variant="contained" startIcon={<ArrowForwardIcon />} color="success" onClick={onSubmit}>
                  Complete the application Edit
                  </Button>
                </Grid>
              </Grid>
          </Box>
        </Box>
      )}
        
        </>
       );


};
export default EditQuestionPage;