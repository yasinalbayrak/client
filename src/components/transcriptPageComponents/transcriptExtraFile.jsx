import React, { useEffect, useRef, useState } from "react";
import AppBarHeader from "../../components/AppBarHeader";
import Sidebar from "../../components/Sidebar";
import {
  Typography,
  Box,
  Button,
  Grid,
  Divider
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getAnnouncement, applyToPost } from "../../apiCalls";
import { useSelector } from "react-redux";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { toast } from "react-toastify";
import BackButton from "../buttons/BackButton";
import QuestionComponent from "./Questions";

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
  const [answers, setAnswers] = useState([])

  const data = useRef();
  const isLoading = useRef();
  const answerCallback = (value, idx) => {
  
    console.log('value :>> ', value);
    console.log('idx :>> ', idx);
    setAnswers((answers) => {
      let ans = [...answers]
      ans[idx] = value;
      return ans;
    });
  }
  function checkDisplay2(question) {
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
      if (answers.length !== questions.filter(e=> checkDisplay2(e)).length) {
        throw new Error("Not all questions have answers");
      }

      var validator = 0;
      console.log('"-----------------" :>> ', "-----------------");
      console.log('questions :>> ', questions);
      let updQuestions = Array.from(questions);
      console.log('updQuestions :>> ', updQuestions);
      

      updQuestions.map((eachQ, idx) => !checkDisplay2(eachQ) && answers.splice(idx, 1))
      updQuestions = updQuestions.filter(e=> checkDisplay2(e));
      console.log('updQuestions :>> ', updQuestions);
      console.log('answersss :>> ', answers);
    
      const modifiedAnswers = answers.map((answer, idx) => {
        validator++
        const qType = updQuestions[idx].type;
        console.log('log1', !answer)
        console.log('log2', (typeof answer === 'string' && answer.trim() === ""))

        if (answer == null || (typeof answer === 'string' && answer.trim() === "")) {
          throw new Error(`Answer for question ${idx + 1} is missing`);
        }

        console.log('answer :>> ', answer);

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

      if (validator !== updQuestions.length) {
        throw new Error("Not all questions have answers");
      }
      let answersToPost = updQuestions.map((question, idx) => ({
        questionId: question.questionId,
        answer: modifiedAnswers[idx]
      }))
      console.log('answersToPost:>> ', answersToPost);
      if (await applyToPost(id, state.user.id, answersToPost)) {
        navigate("/Home", { replace: true });
        toast.success("Your application has been received successfully.", {
          containerId: "1618",
          closeOnClick: true,
        });
      }


    } catch (error) {
      console.error("Submission error:", error.message);
      toast.info("Complete all the questions before completing the application.",{
        containerId: "1618",
        closeOnClick: true,
      });
    }
  };


  const onAnswerChange = (e, index) => {
    e.preventDefault();

  };

  useEffect(() => {
    if (announcementInfo?.questions !== undefined) {
      setQuestions(announcementInfo.questions);

    }
  }, [announcementInfo]);

  useEffect(() => {
    console.log('answers :>> ', answers);
  }, [answers]);

  useEffect(() => {
    if (id) {
      const fetchAnnouncement = async () => {
        try {
          const results = await getAnnouncement(id);
          setAnnouncementInfo(results);
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

  return (
    <>
      {(!announcementInfo) || (!questions) || !(questions.length > 0) ? (<div>Loading...</div>) :
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
                <QuestionComponent
                  questions={questions}
                  setQuestionsAndAnswers={setQuestionsAndAnswers}
                  answers={answers}
                  answerCallback={answerCallback}
                  edit={false}
                />

              </Grid>
              <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                <Grid item>
                  <button class="button" onClick={onSubmit}>
                    Apply Now
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
    </>
  );

};


export default QuestionPage;
