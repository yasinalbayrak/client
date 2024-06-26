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

const HistoryTableContainer = styled(TableContainer)(() => ({
  margin: '10px',
}));

const LaHistoryTable = ({ LaHistory, courseCode }) => {
  return (
    <HistoryTableContainer component={Paper}>
      <Typography variant="h5" align="center" style={{ margin: '10px 0' }}>
        <strong>LA History</strong>
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography variant="h7"><strong>Course</strong></Typography>
            </TableCell>
            <TableCell colSpan={2} align="center">
              <Typography variant="h7"><strong>Term</strong></Typography>
            </TableCell>
            <TableCell colSpan={2} align="center">
              <Typography variant="h7"><strong>Status</strong></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {LaHistory.content && LaHistory.content.map((appRequest) => (
            <TableRow key={appRequest.applicationRequestId}>
              <TableCell colSpan={2}>
                <Grid container direction="column" justifyContent="flex-start">
                  <Typography key={appRequest.application.course.courseCode}>
                    {appRequest.application.course.courseCode}
                  </Typography>
                </Grid>
              </TableCell>

              <TableCell colSpan={2}>
                <Grid container direction="column" justifyContent="flex-start">
                  <Typography>
                    {appRequest.application.term}
                  </Typography>
                </Grid>
              </TableCell>

              <TableCell colSpan={2}>
                <Grid container direction="column" justifyContent="flex-start">
                  <Typography style={{color:appRequest.redFlagged && (appRequest.application.course.courseCode === courseCode) ? "red" :""}}>
                    {appRequest.redFlagged && (appRequest.application.course.courseCode === courseCode) 
                    ? 
                    "Red Flagged" 
                    :
                    appRequest.status}
                  </Typography>
                </Grid>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </HistoryTableContainer>
  );
};

export default LaHistoryTable;
