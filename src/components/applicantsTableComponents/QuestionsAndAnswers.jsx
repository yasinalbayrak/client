import React from 'react';
import { styled } from '@mui/system';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 10px;
  margin-top: 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px; /* Add border-radius for rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow for a 3D effect */
  background-color: #fff; /* Set a background color for a professional look */
`;

const Question = styled('div')`
  font-weight: bold;
  margin-bottom: 5px;
  width: 100%;
`;

const Answer = styled('div')`
  color: #333;
`;

const QuestionAnswer = ({ question, answer, qNo }) => {
  return (
    <Container>
      <Question>Q{qNo}: {question}</Question>
      <Answer> <span style={{fontWeight: "bold"}}>Answer:</span> {answer}</Answer>
    </Container>
  );
};

export default QuestionAnswer;
