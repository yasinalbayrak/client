import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Box, Button, Grid, Divider, Icon, InputAdornment, FormControl, Select } from "@mui/material";
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
import { addAnnouncement } from "../apiCalls";
import { useSelector } from "react-redux";
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect } from "react";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Tooltip from "@mui/material/Tooltip";
import { ClearIcon } from "@mui/x-date-pickers";
import { RadioButtonUnchecked } from "@mui/icons-material";
import WarningIcon from '@mui/icons-material/Warning';
import MenuListComposition from "./popper/Popper";

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
    isConditionalQuestion: false
  },
  {
    type: "TEXT",
    question: "Explain in detail why you are qualified for the position.",
    choices: [],
    sBgColor: "#2196F3",
    isConditionalQuestion: false
  },
  {
    type: "TEXT",
    question: "Previous teaching experiences:",
    choices: [],
    sBgColor: "#5FB3F6",
    isConditionalQuestion: false
  },
  {
    type: "TEXT",
    question: "What was your favorite topic while taking this course? What was the most challenging topic for you?",
    choices: [],
    sBgColor: "#2196F3",
    isConditionalQuestion: false
  },
  {
    type: "NUMERIC",
    question: "How many CS courses did you take in previous terms?",
    choices: [],
    sBgColor: "#5FB3F6",
    isConditionalQuestion: false
  },
  {
    type: "MULTIPLE_CHOICE",
    question: "Soru saatine hazırlık için hangi günü/günleri özellikle kullanmayı düşünüyorsunuz?",
    choices: [{ choice: "Monday", conditionallyOpen: "" }, { choice: "Tuesday", conditionallyOpen: "" }, { choice: "Wednesday", conditionallyOpen: "" }, { choice: "Thursday", conditionallyOpen: "" }, { choice: "Friday", conditionallyOpen: "" }],
    sBgColor: "#2196F3",
    allowMultipleAnswers: true,
    isConditionalQuestion: false
  },
];

function AddQuestion({ questions, setQuestions }) {
  const inputRefs = useRef([]);
  const [recentlyAddedIndex, setRecentlyAddedIndex] = useState(null);


  const handleClick = (qidx, idx) => {
    if (inputRefs.current[qidx] && inputRefs.current[qidx][idx]) {
      inputRefs.current[qidx][idx].select();
    }
  };
  useEffect(() => {
    console.log('inputRefs :>> ', inputRefs);
  }, [inputRefs])
  useEffect(() => {
    if (recentlyAddedIndex !== null) {
      inputRefs.current[recentlyAddedIndex.qidx][recentlyAddedIndex.chidx].click();
      setRecentlyAddedIndex(null);
    }
  }, [recentlyAddedIndex]);
  function addNewQuestion() {
    const nextQuestion = { question: "", type: "TEXT", choices: [{ "choice": "Option 1", "conditionallyOpen": "" }, { "choice": "Option 2", "conditionallyOpen": "" }], allowMultipleAnswers: false, isConditionalQuestion: false };
    setQuestions([...questions, nextQuestion]);
  }

  function handleDeleteQuestion(indexToDelete) {
    setQuestions((prev) => {
      const updatedQuestions = prev.filter((_, idx) => idx !== indexToDelete);


      return updatedQuestions.map((question) => {
        const updatedChoices = question.choices.map((choice) => {
          if (choice.conditionallyOpen === indexToDelete.toString()) {
            return {
              ...choice,
              conditionallyOpen: "",
            };
          }
          else if (choice.conditionallyOpen > indexToDelete.toString()) {
            return {
              ...choice,
              conditionallyOpen: choice.conditionallyOpen - 1
            }
          }
          return choice;
        });
        return {
          ...question,
          choices: updatedChoices,
        };
      });
    });
  }


  function handleInput(event, index) {
    const { name, value } = event.target;
    if (name === "type" && !["TEXT", "NUMERIC", "MULTIPLE_CHOICE"].includes(value)) {
      return;
    }
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question, i) => {
        if (i === index) {
          const mMultiple = name === "type" && value !== "MULTIPLE_CHOICE" ? [{ "choice": "Option 1", "conditionallyOpen": "" }, { "choice": "Option 2", "conditionallyOpen": "" }] : question.choices;
          return { ...question, [name]: value, choices: mMultiple, allowMultipleAnswers: question?.allowMultipleAnswers ?? null };
        }
        return question;
      });
    });
  }


  function handleButtonClick(index) {
    const suggestedQuestion = suggestedQuestions[index].question;
    const suggestedQuestionType = suggestedQuestions[index].type;
    const suggestedMultiple = suggestedQuestions[index].choices;
    const suggestedAllowMultiple = suggestedQuestions[index].allowMultipleAnswers;

    if (suggestedMultiple.length === 0) {
      const nextQuestion = { question: suggestedQuestion, type: suggestedQuestionType, choices: ["", ""], allowMultipleAnswers: suggestedAllowMultiple };
      setQuestions([...questions, nextQuestion]);
    } else {
      const nextQuestion = {
        question: suggestedQuestion,
        type: suggestedQuestionType,
        choices: suggestedMultiple,
        allowMultipleAnswers: suggestedAllowMultiple
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
      updatedChoices.push({ "choice": `Option ${updatedChoices.length + 1}`, "conditionallyOpen": "" }); // add the new choice to the end of the array

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
    setRecentlyAddedIndex({
      qidx: questionNumber,
      chidx: updatedQuestions[questionNumber].choices.length - 1
    });
  }


  function deleteChoice(questionNumber, choiceIndex) {
    setQuestions((prevQuestions) => {
      // Find the question by its number
      const question = prevQuestions.find((q, idx) => idx === questionNumber);

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
    const newQuestions = questions.map((question, index) => {
      if (index === questionNumber) {
        const newMultiple = question.choices.map((c, index) => {
          if (index === choiceIndex) {
            return { ...c, choice: newValue };
          }
          return c;
        });
        return { ...question, choices: newMultiple };
      }
      return question;
    });

    setQuestions(newQuestions);
  }
  useEffect(() => {
    const updatedQuestions = questions.map(question => {
      if (question.type === "MULTIPLE_CHOICE") {
        return {
          ...question,
          duplicateIndexes: findDuplicateIndexes(question.choices.map(qc => qc.choice))
        };
      } else {
        return {
          ...question,
          duplicateIndexes: []
        };
      }
    });

    setQuestions(updatedQuestions);
    console.log('updatedQuestions :>> ', updatedQuestions);
  }, [JSON.stringify(questions.map(question => question.choices.map(qc => qc.choice)))]);

  const findDuplicateIndexes = (choices) => {
    const duplicates = [];
    const choiceMap = new Map();

    choices.forEach((choice, index) => {
      if (choiceMap.has(choice)) {
        duplicates.push(index);
      } else {
        choiceMap.set(choice, index);
      }
    });

    return duplicates;
  };

  function handleOnDragEnd(result) {
    if (!result.destination) {
      return;
    }

    setQuestions((prevQuestions) => {
      // Step 1: Reorder the questions
      const updatedQuestions = Array.from(prevQuestions);
      const [removed] = updatedQuestions.splice(result.source.index, 1);
      updatedQuestions.splice(result.destination.index, 0, removed);

      // Step 2: Create a mapping from old indexes to new indexes
      const indexMapping = {};
      prevQuestions.forEach((question, oldIndex) => {
        const newIndex = updatedQuestions.findIndex((q) => q === question);
        indexMapping[oldIndex] = newIndex;
      });

      // Step 3: Update conditionallyOpen values based on the new indexes
      const updatedQuestionsWithCorrectIndexes = updatedQuestions.map((question) => {
        const updatedChoices = question.choices.map((choice) => {
          if (choice.conditionallyOpen !== "" && !isNaN(choice.conditionallyOpen)) {
            const oldIndex = parseInt(choice.conditionallyOpen, 10);
            const newIndex = indexMapping[oldIndex];
            return {
              ...choice,
              conditionallyOpen: newIndex.toString(),
            };
          }
          return choice;
        });

        return {
          ...question,
          choices: updatedChoices,
        };
      });

      return updatedQuestionsWithCorrectIndexes;
    });
  }


  return (
    <>
      <div>
        <Grid container spacing={2} justifyContent="center">
          <DragDropContext onDragEnd={handleOnDragEnd} >
            <Droppable droppableId="questions" >
              {(provided) => (
                <Grid item xs={6} {...provided.droppableProps} ref={provided.innerRef} sx={{ borderRight: "2px solid grey", p: 2, pr: 5 }}>

                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Additional Questions for Students:
                  </Typography>
                  <Divider sx={{ marginBottom: '10px', }} />
                  <Alert variant="outlined" severity="info" style={{ padding: '10px', marginBottom: 20, width: "fit-content" }}>
                    <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                      The following information will be provided automatically, please do not ask them as questions:
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: '5px' }}>
                      SU Username, Name, ID, Major, Minor, All Grades, Class, GPA
                    </Typography>
                  </Alert>


                  {questions.map((question, index) => {
                    return (
                      <Draggable key={index} draggableId={index.toString()} index={index}>
                        {(provided, snapshot) => (
                          <Grid
                            container
                            direction="column"
                            justifyContent="start"
                            alignItems="start"
                            sx={{ px: 1, backgroundColor: snapshot.isDragging && "#4D5571", color: snapshot.isDragging && "white" }}
                            key={index.toString()}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', mb: 2, width: "100%", position: 'relative' }}>
                              <Tooltip
                                title="Delete the Question"
                                placement="bottom"
                              >
                                <IconButton
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteQuestion(index)}
                                  sx={{
                                    position: 'absolute',
                                    top: 2,
                                    left: 0,
                                    transform: 'translate(-50%, -50%)',
                                    width: 25,
                                    height: 25,
                                    bgcolor: 'error.main',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    '&:hover': {
                                      backgroundColor: 'red',
                                    }
                                  }}
                                >
                                  <CloseIcon

                                  />
                                </IconButton>
                              </Tooltip>
                              <Grid container direction="row" alignItems="center" justifyContent="space-between" p={1}>
                                <Grid item>
                                  <Typography variant="h6">Question {index + 1}:</Typography>
                                </Grid>

                                <Grid item>

                                  <TextField
                                    id="outlined-select-type"
                                    name="type"
                                    select
                                    value={question.type}
                                    size="small"
                                    sx={{
                                      width: 200,
                                      "& .MuiSelect-select": { color: snapshot.isDragging ? 'white' : 'initial' },
                                      "& fieldset": { borderColor: snapshot.isDragging ? 'white' : 'initial' },
                                    }}
                                    onChange={(event) => handleInput(event, index)}
                                  >
                                    {questionType.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>

                              </Grid>

                              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <TextField
                                  id="outlined-required"
                                  name="question"
                                  multiline
                                  maxRows={10}
                                  value={question.question}
                                  variant="outlined"
                                  size="small"
                                  placeholder="Your question here..."
                                  sx={{
                                    flexGrow: 1,
                                    m: 1,
                                    "& .MuiOutlinedInput-input": { color: snapshot.isDragging ? 'white' : 'initial' },
                                    "& fieldset": { borderColor: snapshot.isDragging ? 'white' : 'initial' },
                                  }}
                                  onChange={(event) => handleInput(event, index)}
                                />

                              </Box>

                              {question.type === "MULTIPLE_CHOICE" && (
                                <Box sx={{ mt: 2 }}>
                                  <Grid container direction="row" justifyContent="space-around">
                                    <FormControlLabel
                                      value={question.allowMultipleAnswers}
                                      onChange={() => {
                                        setQuestions((prev) =>
                                          prev.map((each, idx) =>
                                            idx === index
                                              ? { ...each, allowMultipleAnswers: !each.allowMultipleAnswers }
                                              : each
                                          )
                                        );
                                      }}
                                      control={<Switch color="success" checked={question.allowMultipleAnswers} />}
                                      label="Allow Multiple Answers"
                                      sx={{
                                        color: `${question.allowMultipleAnswers ? 'green' : 'black'}`,
                                        border: `0.5px solid ${question.allowMultipleAnswers ? 'green' : 'grey'}`,
                                        p: 0.5,
                                        borderRadius: '5px',
                                        ml: 1,
                                        mb: 1
                                      }}
                                    />
                                    <FormControlLabel
                                      value={question.isConditionalQuestion}
                                      onChange={() => {
                                        setQuestions((prev) =>
                                          prev.map((each, idx) =>
                                            idx === index
                                              ? { ...each, isConditionalQuestion: !each.isConditionalQuestion, choices: each.choices.map(ec => ({ ...ec, conditionallyOpen: "" })) }
                                              : each
                                          )
                                        );
                                      }}
                                      control={<Switch color="secondary" checked={question.isConditionalQuestion} />}
                                      label="Conditional questions"
                                      sx={{
                                        color: `${question.isConditionalQuestion ? 'purple' : 'black'}`,
                                        border: `0.5px solid ${question.isConditionalQuestion ? 'purple' : 'grey'}`,
                                        p: 0.5,
                                        borderRadius: '5px',
                                        ml: 1,
                                        mb: 1
                                      }}
                                    />
                                  </Grid>

                                  <Divider sx={{ borderBottomWidth: 2, mt: 1, mb: 1 }} > Choices </Divider>

                                  {question.choices.map((multiple, idx) => (
                                    <Grid container direction="row" alignItems="center" spacing={1} key={idx} pl={2} mb={1} height={55}>
                                      <Grid item>
                                        <RadioButtonUnchecked sx={{ color: "grey" }} />
                                      </Grid>

                                      <Grid item xs>
                                        <TextField
                                          id="outlined-required"
                                          name="mMultiple"
                                          multiline
                                          maxRows={10}
                                          value={multiple.choice}
                                          variant="outlined"
                                          size="small"
                                          fullWidth
                                          inputRef={(el) => {

                                            if (!inputRefs.current[index]) {
                                              inputRefs.current[index] = [];
                                            }
                                            inputRefs.current[index][idx] = el;
                                            console.log('inputRefs :>> ', inputRefs);
                                          }}
                                          onClick={() => handleClick(index, idx)}
                                          onBlur={() => multiple.choice.trim() === "" && handleInputChoice(index, idx, `Choice ${idx + 1}`)}
                                          InputProps={{
                                            endAdornment: question?.duplicateIndexes?.includes(idx) ? (
                                              <InputAdornment position="end">


                                                <Tooltip title="Duplicated options are not supported">
                                                  <WarningIcon sx={{ color: "#DC5F00", cursor: "default" }} />
                                                </Tooltip>

                                              </InputAdornment>
                                            ) : null,
                                          }}
                                          sx={{
                                            ml: 0,
                                            "& .MuiOutlinedInput-input": {
                                              color: snapshot.isDragging ? 'white' : 'initial',
                                            },
                                            "& .MuiOutlinedInput-root": {
                                              "& fieldset": {
                                                border: 'none',
                                                borderBottom: snapshot.isDragging ? '2px solid white' : '2px solid initial',
                                                borderRadius: '0'
                                              },
                                              "&:hover fieldset": {
                                                borderBottom: '2px solid gray',
                                              },
                                              "&.Mui-focused fieldset": {
                                                borderBottom: question?.duplicateIndexes?.includes(idx) ? '2px solid #DC5F00' : '2px solid purple',
                                              },
                                            },
                                          }}
                                          onChange={(event) => handleInputChoice(index, idx, event.target.value)}
                                        />
                                      </Grid>
                                      <Grid item ml={1}>

                                        <IconButton
                                          onClick={() => deleteChoice(index, idx)}>
                                          <Tooltip title="Remove">
                                            <ClearIcon />
                                          </Tooltip>

                                        </IconButton>
                                      </Grid>
                                      {question.isConditionalQuestion && <Grid item>
                                        <FormControl
                                          sx={{
                                            m: 1,
                                            minWidth: 120,
                                            '& .MuiInputBase-root': { height: 30, fontSize: '0.875rem' },
                                            '& .MuiSelect-select': { padding: '5px 5px' }
                                          }}
                                        >
                                          <Select
                                            value={multiple.conditionallyOpen || ""}
                                            onChange={(e) => {
                                              setQuestions(prev =>
                                                prev.map((q, currIdx) => {
                                                  if (currIdx === index) {

                                                    const updatedChoices = q.choices.map((c, chidx) => {
                                                      if (chidx === idx) {
                                                        return {
                                                          ...c,
                                                          conditionallyOpen: e.target.value.toString()
                                                        };
                                                      }
                                                      return c;
                                                    });

                                                    return { ...q, choices: updatedChoices };
                                                  }
                                                  return q;
                                                })
                                              );
                                            }}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                          >
                                            <MenuItem value="">
                                              <em>None</em>
                                            </MenuItem>

                                            {questions.map((q, i) => (
                                              (i !== index && !questions.find((eachQ, eachI) => (eachI !== index) && eachQ.choices.map(qc => qc.conditionallyOpen).includes(i.toString()) || eachQ.choices.map(qc => qc.conditionallyOpen).includes(index.toString()))) && <MenuItem key={i} value={i.toString()}>
                                                Question {i + 1}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </FormControl>

                                      </Grid>}

                                    </Grid>
                                  ))}

                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      startIcon={<ControlPointDuplicateIcon />}
                                      onClick={() => handleAddChoice(index)}
                                      disabled={question.choices.length >= 15}
                                    >
                                      Add Choice
                                    </Button>

                                  </Box>




                                </Box>
                              )}
                            </Box>

                          </Grid>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <Grid container direction="row" justifyContent="start" alignItems="center">
                    {questions.length < 10 ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddCircleIcon />}
                        sx={{ bgcolor: "#394263", my: 2 }}
                        onClick={addNewQuestion}
                      >
                        Add Question
                      </Button>
                    ) :
                      (
                        <Stack sx={{ width: '100%' }} spacing={2}>
                          <br></br>
                          <Alert severity="info">You can add maximum of 10 questions!</Alert>
                        </Stack>
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
                    onClick={() => handleButtonClick(idx)}
                    disabled={questions.length >= 10}
                  >
                    {e.question}
                  </Button>
                );
              })}
            </Box>
          </Grid>
        </Grid>




      </div>
    </>);
}

export default AddQuestion;
