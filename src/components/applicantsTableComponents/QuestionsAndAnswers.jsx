import React from 'react';
import { Helmet } from 'react-helmet';
import { styled } from '@mui/system';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Paper, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const Container = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 10px;
  margin-top: 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  user-select: none;
`;

const Question = styled('div')`
  font-weight: bold;
  margin-bottom: 5px;
  width: 100%;
`;

const Answer = styled('div')`
  color: black;
`;



const charCodeStart = 'A'.charCodeAt(0);


const QuestionAnswer = ({ question, answer, qNo }) => {
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
  }
  const answerChecked = (index) => answer.toString().includes(index.toString());

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
        />
      </Helmet>
      <Container>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Question>Q{qNo}: {question.question} </Question>
          </AccordionSummary>
          <AccordionDetails style={{ padding: '8px', width: "100%" }}>


            {question.type === 'MULTIPLE_CHOICE' ? (
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormGroup>
                  {question.choices.map((choice, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          style={answerChecked(index) ? greenCheckBox : defaultCheckBox}
                          checked={answerChecked(index)}
                          disableRipple
                          size="small"
                        />
                      }
                      label={
                        <Typography
                          component="span"
                          variant="body2"
                          fontWeight='700'
                          color={answerChecked(index) ? "rgba(68,115,75,1)" : "rgba(55, 64, 115, 1)"}
                          fontFamily="Roboto, sans-serif"
                        >
                          {choice}
                        </Typography>
                      }
                      sx={{
                        border: 'none',
                        borderRadius: '5px',
                        margin: '10px 0 0px 1px',
                        backgroundColor: `${!answerChecked(index) ? 'rgba(243,244,248,1)' : 'rgba(162, 212, 167, 1)'}`,
                      }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            ) : (
              <Answer>
                <span style={{ fontWeight: 'bold' }}>Answer:</span> {answer}
              </Answer>
            )}

          </AccordionDetails>
        </Accordion>





      </Container>
    </>
  );
};

export default QuestionAnswer;
