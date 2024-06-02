import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
} from '@mui/material';
import QuantityInput from './QuantityInput';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

const MAX_WORD_COUNT = 512;

const QuestionComponent = ({ questions, setQuestionsAndAnswers, answers, answerCallback, edit }) => {

    const renderQuestion = (question, index) => {
        console.log('question :>> ', question);

        switch (question.type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceQuestion
                    options={question.choices.map(qc => qc.choice)}
                    allowMultiple={question.allowMultipleAnswers}
                    onAnswerChange={answerCallback}
                    answer={answers[index]}
                    idx={index}
                    edit={edit}
                />;

            case 'NUMERIC':
                return <QuantityInput answer={answers[index]} edit={edit} key={index} idx={index} onAnswerChange={answerCallback} />;

            default:
                return (
                    <>
                        <TextField
                            value={answers[index] || ''}
                            onChange={(e) => {
                                e.preventDefault();
                                answerCallback(e.target.value, index)
                            }}
                            multiline
                            fullWidth
                            sx={{ backgroundColor: 'white' }}
                            inputProps={{
                                maxLength: MAX_WORD_COUNT,
                                type: 'text'
                            }}
                        />
                        <Typography variant="body2" style={{ marginTop: '7px', marginLeft: '3px', width: '100%', fontSize: '11px' }}>
                            Remaining Characters: {MAX_WORD_COUNT - (answers[index]?.length || 0)}
                        </Typography>
                    </>
                );
        }
    };
    let displayedCount = 0;
    function checkDisplay(question) {
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
    return (
        <>


            {questions && questions.map((question, index) => {
                if (!checkDisplay(question)) {
                    return null;
                }

                displayedCount += 1;

                return (
                    <Grid
                        key={index}
                        container
                        direction="column"
                        sx={{
                            border: 1,
                            borderRadius: 3,
                            borderColor: '#cccccc',
                            backgroundColor: '#f5f5f5',
                            marginY: 2,
                            p: 2,
                        }}
                    >
                        <Grid item alignContent="flex-start" justifyContent="flex-start" sx={{ m: 1 }}>
                            <Typography>
                                Question {displayedCount} - {question.question}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ m: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {renderQuestion(question, index)}
                        </Grid>
                    </Grid>
                );
            })}
        </>
    );
};

export default QuestionComponent;
