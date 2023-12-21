import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Box, Button, Grid } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { addAnnouncement, updateAnnouncement } from "../apiCalls";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import UpdateIcon from '@mui/icons-material/Update';
import { useDispatch } from "react-redux";
import { setTerm } from "../redux/userSlice";
const questionType = [
  { value: "TEXT", label: "Text Answer" },
  { value: "NUMERIC", label: "Numeric Answer" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
];

const suggestedQuestions = [
  {
    type: "TEXT",
    question: "Explain in detail why you want to be an LA for this course.",
    choices: [],
    sBgColor: "#5FB3F6",
  },
  {
    type: "TEXT",
    question: "Explain in detail why you are qualified for the position.",
    choices: [],
    sBgColor: "#2196F3",
  },
  {
    type: "TEXT",
    question: "Previous teaching experiences:",
    choices: [],
    sBgColor: "#5FB3F6",
  },
  {
    type: "TEXT",
    question: "What was your favorite topic while taking this course? What was the most challenging topic for you?",
    choices: [],
    sBgColor: "#2196F3",
  },
  {
    type: "NUMERIC",
    question: "How many CS courses did you take in previous terms?",
    choices: [],
    sBgColor: "#5FB3F6",
  },
  {
    type: "MULTIPLE_CHOICE",
    question: "Soru saatine hazırlık için hangi günü/günleri özellikle kullanmayı düşünüyorsunuz?",
    choices: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    sBgColor: "#2196F3",
  },
];

function EditQuestion(props) {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    console.log('props.AnnouncementDetails.questions :>> ', props.AnnouncementDetails.questions);
    setQuestions(props.AnnouncementDetails.questions);
  }, [props.AnnouncementDetails.questions]);

  const dispatch = useDispatch();
  const term = useSelector((state) => state.user.term);
  const navigate = useNavigate();

  

  function addNewQuestion() {
    const nextQuestion = { question: "", type: "TEXT", choices: ["", ""] };
    setQuestions([...questions, nextQuestion]);
  }

  function handleDeleteQuestion(indexToDelete) {
    setQuestions((prev)=>(
      prev.filter((_, idx)=>(idx !== indexToDelete))
    ))
  }

  function handleInput(event, index) {
    const { name, value } = event.target;
    if (name === "type" && !["TEXT", "NUMERIC", "MULTIPLE_CHOICE"].includes(value)) {
      return;
    }
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question, i) => {
        if (i === index) {
          const mMultiple = name === "type" && value !== "MULTIPLE_CHOICE" ? ["", ""] : question.choices;
          return { ...question, [name]: value, choices: mMultiple };
        }
        return question;
      });
    });
  }

  function handleButtonClick(index) {
    const suggestedQuestion = suggestedQuestions[index].question;
    const suggestedQuestionType = suggestedQuestions[index].type;
    const suggestedMultiple = suggestedQuestions[index].choices;

    if (suggestedMultiple.length === 0) {
      const nextQuestion = { question: suggestedQuestion, type: suggestedQuestionType, choices: ["", ""] };
      setQuestions([...questions, nextQuestion]);
    } else {
      const nextQuestion = {
        question: suggestedQuestion,
        type: suggestedQuestionType,
        choices: suggestedMultiple,
      };
      setQuestions([...questions, nextQuestion]);
    }
    // console.log("its index " + emptyQuestionIndex) //for debugging button click
  }

  function addChoiceToQuestion(questions, questionIndex) {
    const updatedQuestions = [...questions]; // create a copy of the original array

    

    if (questionIndex !== -1) {
      // if the question exists
      const updatedChoices = [...updatedQuestions[questionIndex].choices]; // create a copy of the original choices array
      updatedChoices.push(""); // add the new choice to the end of the array

      // update the question's choices array with the new choices array
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        choices: updatedChoices,
      };
    }

    return updatedQuestions; // return the updated array
  }

  function handleAddChoice(questionNumber) {
    const updatedQuestions = addChoiceToQuestion(questions, questionNumber);
    setQuestions(updatedQuestions);
  }

  function deleteChoice(questionNumber, choiceIndex) {
    setQuestions((prevQuestions) => {
      // Find the question by its number
      const question = prevQuestions.find((q,idx) => idx === questionNumber);

      // Make a copy of the question object and its choices array
      const updatedQuestion = { ...question };
      const updatedChoices = [...updatedQuestion.choices];

      // Remove the choice at the given index
      updatedChoices.splice(choiceIndex, 1);

      // Update the question object with the new choices array
      updatedQuestion.choices = updatedChoices;

      // Find the index of the question in the previous questions array
      const questionIndex = prevQuestions.indexOf(question);

      // Make a copy of the previous questions array
      const updatedQuestions = [...prevQuestions];

      // Update the question at the correct index with the new question object
      updatedQuestions[questionIndex] = updatedQuestion;

      // Return the updated questions array
      return updatedQuestions;
    });
  }

  function handleInputChoice(questionNumber, choiceIndex, newValue) {
    const newQuestions = questions.map((question,index) => {
      if (index === questionNumber) {
        const newMultiple = question.choices.map((choice, index) => {
          if (index === choiceIndex) {
            return newValue;
          }
          return choice;
        });
        return { ...question, choices: newMultiple };
      }
      return question;
    });
    setQuestions(newQuestions);
  }

  function handleOnDragEnd(result) {
    if (!result.destination) {
      return;
    }

    setQuestions((prevQuestions) => {
      const updatedQuestions = Array.from(prevQuestions);
      const [removed] = updatedQuestions.splice(result.source.index, 1);
      updatedQuestions.splice(result.destination.index, 0, removed);

      const updatedQuestionsWithNumbers = updatedQuestions.map((question, index) => {
        return {
          ...question,
        };
      });

      return updatedQuestionsWithNumbers;
    });
  }

  //console.log(questions); //for debugging questions
  // const combinedDateTime = props.AnnouncementDetails.lastApplicationDate + " " + props.AnnouncementDetails.lastApplicationTime + ":00";
  // const combinedDate = new Date(combinedDateTime);
  // console.log(combinedDate)
  // console.log(combinedDateTime)
  //console.log(typeof props.AnnouncementDetails.lastApplicationDate)
  
  return (
    <div>
      <Grid container spacing={2}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <Grid item xs={8} {...provided.droppableProps} ref={provided.innerRef}>
                <Typography variant="h5" sx={{ textDecoration: "underline", mt: 8, mb: 2, fontWeight: "bold" }}>
                  Additional Questions for Students:
                </Typography>
                {questions && questions.map((question, index) => {
                  return (
                    <Draggable key={index} draggableId={index} index={index}>
                      {(provided, snapshot) => (
                        <Grid
                          container
                          direction="row"
                          justifyContent="start"
                          alignItems="center"
                          sx={{ px: 1, backgroundColor: snapshot.isDragging && "#4D5571", color: snapshot.isDragging && "white" }}
                          key={index}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <Typography>Question {index + 1}:</Typography>
                          <TextField
                            id="outlined-required"
                            name="question"
                            multiline
                            maxRows={20}
                            value={question.question}
                            label=""
                            variant="outlined"
                            size="small"
                            sx={{
                              m: 2,
                              width: 450,
                              "& .MuiOutlinedInput-input": { color: snapshot.isDragging && "white" },
                              "& fieldset": { borderColor: snapshot.isDragging && "white" },
                            }}
                            onChange={(event) => handleInput(event, index)}
                          />
                          <TextField
                            id="outlined-select-currency"
                            name="type"
                            select
                            value={question.type}
                            size="small"
                            sx={{
                              m: 2,
                              width: 225,
                              "& .MuiSelect-select": { color: snapshot.isDragging && "white" },
                              "& fieldset": { borderColor: snapshot.isDragging && "white" },
                            }}
                            onChange={(event) => handleInput(event, index)}
                          >
                            {questionType.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <Button
                            variant="contained"
                            size="large"
                            color="error"
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </Button>
                          {question.type === "MULTIPLE_CHOICE" && (
                            <Grid item xs={10} sx={{ backgroundColor: snapshot.isDragging ? "#6A759C" : "#F5F5F5", px: 2 }}>
                              {question.choices.map((multiple, idx) => {
                                return (
                                  <Grid container direction="row" justifyContent="start" alignItems="center">
                                    <Typography>Choice {idx + 1}:</Typography>
                                    <TextField
                                      id="outlined-required"
                                      name="mMultiple"
                                      multiline
                                      maxRows={20}
                                      value={multiple}
                                      label=""
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        m: 2,
                                        width: 300,
                                        "& .MuiOutlinedInput-input": { color: snapshot.isDragging && "white" },
                                        "& fieldset": { borderColor: snapshot.isDragging && "white" },
                                      }}
                                      onChange={(event) => handleInputChoice(index, idx, event.target.value)}
                                    />
                                    <Button
                                      variant="contained"
                                      size="large"
                                      sx={{
                                        bgcolor: "#b50b0b",
                                        "&:hover": {
                                          backgroundColor: "#e60e0e",
                                        },
                                      }}
                                      onClick={() => deleteChoice(index, idx)}
                                    >
                                      <CancelIcon fontSize="inherit" />
                                    </Button>
                                  </Grid>
                                );
                              })}
                              <Grid container direction="row" justifyContent="start" alignItems="center">
                                <Button
                                  variant="contained"
                                  size="large"
                                  startIcon={<ControlPointDuplicateIcon />}
                                  sx={{
                                    bgcolor: "#2196F3",
                                    my: 2,
                                    "&:hover": {
                                      backgroundColor: "#84BFF7",
                                    },
                                  }}
                                  onClick={() => handleAddChoice(index)}
                                  disabled={question.choices.length >= 15}
                                >
                                  Add Choice
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                <Grid container direction="row" justifyContent="start" alignItems="center">
                  {questions && questions.length < 10 && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddCircleIcon />}
                      sx={{ bgcolor: "#394263", my: 2 }}
                      onClick={addNewQuestion}
                    >
                      Add Question
                    </Button>
                  )}
                </Grid>
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
        <Grid item xs={4}>
          <Box
            sx={{
              backgroundColor: "#F2F2F2",
              px: 2,
              border: 1, 
              borderRadius: 3,
              borderColor: "#cccccc",
            }}
          >
            <Typography variant="h5" sx={{ textDecoration: "underline", mt: 2, mb: 1, fontWeight: "bold", py: 2 }}>
              Suggested Questions:
            </Typography>
            {suggestedQuestions.map((e, idx) => {
              return (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<AddIcon />}
                  sx={{
                    bgcolor: e.sBgColor,
                    my: 2,
                    textTransform: "none",
                    textAlign: "left",
                    "&:hover": {
                      backgroundColor: "#84BFF7",
                    },
                    width: "100%",
                    justifyContent: "space-between", 
                  }}
                  onClick={() => handleButtonClick(idx  )}
                  disabled = {questions && questions.length >= 10}
                >
                  {e.question}
                </Button>
              );
            })}
          </Box>
        </Grid>
      </Grid>

      
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ p: 4 }}>
        <Button
          variant="contained"
          startIcon={<UpdateIcon />}
          color="success"
          sx={{ m: 2, textDecoration: "none" }}
          onClick={() => {
            if (
              props.AnnouncementDetails.course_code &&
              props.AnnouncementDetails.lastApplicationDate &&
              props.AnnouncementDetails.lastApplicationTime &&
              props.AnnouncementDetails.letterGrade &&
              props.AnnouncementDetails.workHours &&
              props.AnnouncementDetails.term 
            
            ) {
              updateAnnouncement(
                props.postID,
                props.AnnouncementDetails.course_code,
                props.username,
                props.AnnouncementDetails.lastApplicationDate,
                props.AnnouncementDetails.lastApplicationTime,
                props.AnnouncementDetails.letterGrade,
                props.AnnouncementDetails.workHours,
                props.AnnouncementDetails.jobDetails,
                props.AnnouncementDetails.authInstructor,
                props.AnnouncementDetails.desiredCourses,
                questions,
                props.AnnouncementDetails.term,
                props.AnnouncementDetails.isInprogressAllowed
              ).then((data) => {
                dispatch(setTerm({ term: props.AnnouncementDetails.term }));
                navigate("/Home", {
                  replace: true
                });
                toast.success("Your announcement has been successfully updated.")
              }).catch((_) => {
                /* Error is already printed */
              });
                
            } else {
                alert("Please fill out all necessary fields before creating the annoucement.");
            }

        }}
        >
          Update
        </Button>

        <Button
          variant="contained"
          startIcon={<CloseIcon />}
          color="error"
          sx={{ mx: 2 }}
          onClick={() => navigate("/home", { replace: true })}
        >
          Cancel
        </Button>
      </Grid>


        </div>

    );
}

export default EditQuestion;