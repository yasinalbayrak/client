import React from 'react';
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

const QuestionComponent = ({ questions, answers, answerCallback, edit}) => {
    const greenCheckBox = {
        color: '#4CAF50',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    };

    const defaultCheckBox = {
        color: '#001B79',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    };

    const renderQuestion = (question, index) => {
        console.log('question :>> ', question);

        switch (question.type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceQuestion
                    options={question.choices}
                    allowMultiple={question.allowMultipleAnswers}
                    onAnswerChange={answerCallback} 
                    answer={answers[index]}
                    idx ={index}
                    edit ={edit}
                    />;

            case 'NUMERIC':
                return <QuantityInput answer={answers[index]} edit ={edit} key={index} idx={index} onAnswerChange={answerCallback} />;

            default:
                return (
                    <>
                        <TextField
                            value={answers[index] || ''}
                            onChange={(e) =>{ 
                                e.preventDefault();
                                answerCallback(e.target.value, index)}}
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

    return (
        <>
            {questions &&
                questions.map((question, index) => (
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
                                Question {index + 1} - {question.question}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ m: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {renderQuestion(question, index)}
                        </Grid>

                    </Grid>
                ))}
        </>
    );
};

export default QuestionComponent;
