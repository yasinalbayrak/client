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
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Question = styled('div')`
  font-weight: bold;
  margin-bottom: 5px;
  width: 100%;
`;

const Answer = styled('div')`
  color: #333;
`;

const ChoicesList = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const ChoiceItem = styled('li')`
  margin-bottom: 5px;
`;


const charCodeStart = 'A'.charCodeAt(0);


const QuestionAnswer = ({ question, answer, qNo }) => {
  return (
    <Container>
      <Question>Q{qNo}: {question.question}</Question>
      {question.type === 'MULTIPLE_CHOICE' ? (
        <ChoicesList>
          {question.choices.map((choice, index) => (
             <ChoiceItem key={index}>{String.fromCharCode(charCodeStart + index)}) {choice}</ChoiceItem>
          ))}
        </ChoicesList>
      ) : (
        <Answer>
          <span style={{ fontWeight: 'bold' }}>Answer:</span> {answer}
        </Answer>
      )}
    </Container>
  );
};

export default QuestionAnswer;
