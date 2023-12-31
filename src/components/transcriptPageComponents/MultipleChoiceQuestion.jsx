import React, { useState } from 'react';
import { FormControl, FormControlLabel, Checkbox, Radio, RadioGroup, FormLabel, Paper } from '@mui/material';

const MultipleChoiceQuestion = ({ question, options, allowMultiple, onAnswerChange, answer, idx, edit}) => {
    const handleOptionChange = (optIdx) => {
        if (allowMultiple) {

            var lst = Array.isArray(answer) ? [...answer] : [];

            if (lst.includes(optIdx)) {
              lst = lst.filter(opt => opt !== optIdx);
              onAnswerChange(lst, idx);
            } else {
              onAnswerChange([...lst, optIdx], idx);
            }

        } else {
            onAnswerChange(optIdx, idx)
        }
    };
    console.log('answerYasin :>> ', answer);
    if (edit && (answer == null || answer === undefined) ) {
        return ;
    }
    return (
        <Paper elevation={3} style={{display:"flex",justifyContent:"flex-start" ,padding: '20px', maxWidth: '400px'}}>
            <FormControl component="fieldset">
                <FormLabel component="legend">{question}</FormLabel>
                {allowMultiple ? (
                    options.map((option, idx) => (
                        <FormControlLabel
                            key={option}
                        
                            control={
                                <Checkbox
                                    checked={answer?.includes(idx)}
                                    onChange={() => {handleOptionChange(idx)}} 
                                    value={option}
                                />
                            }
                            label={option}
                        />
                    ))
                ) : (
                    <RadioGroup 
                    value={options[answer] || ''}
                    onChange={(event) => {
                        const selectedIdx = options.findIndex((option) => option === event.target.value);
                        handleOptionChange(selectedIdx);
                      }}
                    >
                        {options.map((option, idx) => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                )}
            </FormControl>
        </Paper>
    );
};

export default MultipleChoiceQuestion;
