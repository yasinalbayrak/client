
import React, { useEffect, useRef, useState } from "react";
import AppBarHeader from "../../components/AppBarHeader";
import Sidebar from "../../components/Sidebar";
import {
  Typography,
  Box,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationRequestById,updateApplicationRequest } from "../../apiCalls";
import { useSelector } from "react-redux";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {toast} from "react-toastify";
import BackButton from "../buttons/BackButton";
import QuestionComponent from "./Questions";

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
    const [questions, setQuestions] = useState([]);
    const [appReqInfo, setAppReqInfo] = useState(null);

    const answerCallback = (value, idx) => {
      console.log('value :>> ', value);
      console.log('idx :>> ', idx);
      setAnswers((answers) => {
        let ans = [...answers]
        ans[idx] = value;
        return ans;
      });
    }


      const onSubmit = async () => {
        try {
          console.log('answers :>> ', answers);
          if (answers.length !== questions.length) {
            throw new Error("Not all questions have answers");
          }
          
          var validator = 0;
          const modifiedAnswers = answers.map((answer, idx) => {
            validator++
            const qType = questions[idx].type;
      
            if (!answer || (typeof answer === 'string' && answer.trim() === "")) {
              throw new Error(`Answer for question ${idx + 1} is missing`);
            }
      
            console.log('answer :>> ', answer);
      
            switch (qType) {
              case "MULTIPLE_CHOICE":
                if (answer.length <= 0) {
                  throw new Error(`Multiple choice answer for question ${idx + 1} is empty`);
                }
      
                return questions[idx].allowMultipleAnswers ? 
                       answer.reduce((accumulator, currentValue) => accumulator + currentValue.toString(), "") : 
                       answer.toString();
      
              case "NUMERIC":
                return answer.toString();
      
              default:
                return answer;
            }
    
            
          });
    
          if(validator !== questions.length){
            throw new Error("Not all questions have answers");
          }
      
          console.log('modifiedAnswers:>> ', modifiedAnswers);
          if(await updateApplicationRequest(id, appReqInfo.application.applicationId , state.user.id, modifiedAnswers)){
            navigate("/Home", { replace: true });
            toast.success("Your application has been edited successfully.")
          }
    
          
        } catch (error) {
          console.error("Submission error:", error.message);
          toast.info("Complete all the questions before completing the application.");
        }
      };
    
      useEffect(() => {
        console.log(appReqInfo)
        if (appReqInfo?.qandA !== undefined) {
          setQuestionsAndAnswers(appReqInfo.qandA);
        }
      }, [appReqInfo]);
    
      useEffect(() => {
        if (id) {
          const fetchAnnouncement = async () => {
            try {
              const results = await getApplicationRequestById(id);
              setAppReqInfo(results);
              setQuestions(results.application.questions)
              console.log(results);
            } catch (error) {
              console.error('Failed to fetch announcement:', error);
            }
          };
          fetchAnnouncement(); 
        } else {
          console.warn('Warning: missing ID.');
        }
      }, [id]); 

      useEffect(() => {
        let temp = [];

        for(let i = 0; i < appReqInfo?.qandA.length; i++){
          let qType = appReqInfo?.qandA[i].question.type;
          let ans = appReqInfo?.qandA[i].answer;
          let allowMultiple = appReqInfo?.qandA[i].question.allowMultipleAnswers;

          switch (qType) {
            case "MULTIPLE_CHOICE":
              ans = allowMultiple ? ans.split("").map(char => parseInt(char, 10)) : ans;
              break;
            case "NUMERIC":
              ans = parseInt(ans, 10);
              break;
            default:
              break;
          }

          console.log('ans :>> ', ans);
          temp.push(ans);
        }        

        setAnswers(temp);
      }, [appReqInfo]);
    

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
              <QuestionComponent
                questions={questions}
                answers={answers}
                answerCallback={answerCallback}
                />
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