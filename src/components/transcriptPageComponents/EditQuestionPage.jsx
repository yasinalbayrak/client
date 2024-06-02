
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
    function checkDisplay3(question) {
      console.log('checking question :>> ', question);
      if ((question.depends.length === 0)) {
          return true;
      }
  
      // Conditional Question
      if (answers.length <= 0) {
          return false;
      }
  
      let index = questions.findIndex((q) => q.questionId === question.depends[0].dependsOnQuestion);
      console.log('index :>> ', index);
      if (index === -1) {
          return false; 
      }
  
      const allowsMultipleAnswers = questions[index].allowMultipleAnswers;
      console.log('allowsMultipleAnswers :>> ', allowsMultipleAnswers);
      if (allowsMultipleAnswers) {
          return question.depends.map(c => c.dependsOnChoice).some(element => {
              return answers[index].includes(element)
          });
      } else {
          console.log('answers[index] :>> ', answers[index]);
          return question.depends.map(c => c.dependsOnChoice).some(element => {
              return  answers[index] === element;
          })
      }
  }

      const onSubmit = async () => {
        try {
          console.log('answers :>> ', answers);
          if (answers.length !== questions.filter(e=> checkDisplay3(e)).length) {
            throw new Error("Not all questions have answers");
          }
          
          var validator = 0;

          let updQuestions = Array.from(questions);
          console.log('updQuestions :>> ', updQuestions);
          
    
          updQuestions.map((eachQ, idx) => !checkDisplay3(eachQ) && answers.splice(idx, 1))
          updQuestions = updQuestions.filter(e=> checkDisplay3(e));
          console.log('updQuestions :>> ', updQuestions);
          console.log('answersss :>> ', answers);
          const modifiedAnswers = answers.map((answer, idx) => {
            validator++
            const qType = updQuestions[idx].type;
            console.log('answer DEBUGG :>> ', answer);
            if ((answer == null)|| (typeof answer === 'string' && answer.trim() === "")) {
              throw new Error(`Answer for question ${idx + 1} is missing`);
            }
      
            
      
            switch (qType) {
              case "MULTIPLE_CHOICE":
                if (answer.length <= 0) {
                  throw new Error(`Multiple choice answer for question ${idx + 1} is empty`);
                }
      
                return updQuestions[idx].allowMultipleAnswers ? 
                       answer.reduce((accumulator, currentValue) => accumulator + currentValue.toString(), "") : 
                       answer.toString();
      
              case "NUMERIC":
                return answer.toString();
      
              default:
                return answer;
            }
    
            
          });
    
          if(validator !== updQuestions.length){
            throw new Error("Not all questions have answers");
          }
      
          console.log('modifiedAnswers:>> ', modifiedAnswers);
          if(await updateApplicationRequest(id, appReqInfo.application.applicationId , state.user.id, modifiedAnswers)){
            navigate("/Home", { replace: true });
            toast.success("Your application has been edited successfully.", {
              containerId: "1618",
              closeOnClick: true,
            })
          }
    
          
        } catch (error) {
          console.error("Submission error:", error.message);
          toast.info("Complete all the questions before completing the application.", {
            containerId: "1618",
            closeOnClick: true,
          });
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
              ans = allowMultiple ? ans.split("").map(char => parseInt(char, 10)) : parseInt(ans, 10);
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
                edit={true}
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