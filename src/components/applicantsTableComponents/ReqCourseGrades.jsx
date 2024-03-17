import React from 'react';
import { styled } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid
} from '@mui/material';
import StarRating from './StarRating';

const ReqTableContainer = styled(TableContainer)(() => ({
  margin: '10px',
}));

const ReqCourseGrades = ({ requiredCourses }) => {
  return (
    <ReqTableContainer component={Paper}>
        <Typography variant="h10" align="center" ml={2} style={{ ml:"2" }}>
             <strong>Required Course Grades</strong>
              </Typography>
        <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="h7"><strong>Course</strong></Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h7"><strong>Grade</strong></Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requiredCourses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Grid container direction="column" justifyContent="flex-start">
                        <Typography key={course.courseCode}>
                          {course.courseCode}
                        </Typography>
                      </Grid>
                    </TableCell>

                    <TableCell>
                      <Grid container direction="column" justifyContent="flex-start">
                        <Typography>
                          {course.grade}
                        </Typography>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
            
      
    </ReqTableContainer>
  );
};

export default ReqCourseGrades;
