

import React, { useEffect } from "react";
import {getApplicationRequestsByStudentId } from "../../apiCalls";
import AppBarHeader from "../AppBarHeader";
import Sidebar from "../Sidebar";
import { useSelector } from "react-redux";
import BackButton from "../buttons/BackButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import CommitRow from "./CommitRow";


function CommitPage() {
    const user = useSelector((state) => state.user);
    const term = useSelector((state) => state.user.term);
    const {id: userID, isInstructor} = user;
    const [rows, setRows] = React.useState(null);
    const [refresh, setRefresh] = React.useState(false);

    useEffect(() => {
        try{getApplicationRequestsByStudentId(userID).then((results) =>{
            const rowss = results.content;
            console.log(rowss);
            const acceptedRows = rowss.filter((row) => {
              return row.status === "Accepted" && row.application.term === term.term_desc});
            setRows(acceptedRows);
            console.log(acceptedRows);
        });}catch(e){
            console.log(e);
        }
    }, [userID,term,refresh]);

    console.log("APPLICATION REQUESTS",rows);


  return (
    rows &&<>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <BackButton to={"/home"}/>
          <AppBarHeader />
          { rows.length === 0 ?(<>
            <Box direction="columns" sx={{ mt:20, textAlign: 'center' }}>
              <Typography variant="h4" marginBottom={2} marginRight={1}>
                No Accepted Applications
              </Typography>

            </Box>
          </>):(
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="h4" marginBottom={2} marginRight={1}>
                Decision on Your Accepted Applications
              </Typography>
            </Grid>
            <Grid item>
              <Table sx={{minWidth:1000}}>
                <TableHead sx={{bgcolor:'#FAFAFA'}}>
                  <TableRow>
                    <TableCell  align="center">
                      <Typography variant="h7"><strong>Course</strong></Typography>
                    </TableCell>
                    <TableCell  align="center">
                      <Typography variant="h7"><strong>Term</strong></Typography>
                    </TableCell>
                    <TableCell  align="center">
                      <Typography variant="h7"><strong>Status</strong></Typography>
                    </TableCell>
                    <TableCell  align="center" >
                      <Typography variant="h7"><strong>Instructor Name</strong></Typography>
                    </TableCell>
                    <TableCell  align="center" sx={{minWidth:100}}>
                      <Typography variant="h7"><strong>Action</strong></Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {rows.map((row) => (
                    <CommitRow key={row.applicationRequestId} row={row} setRefresh={setRefresh}></CommitRow>
                  ))}
                </TableBody>

              </Table>
              
            </Grid>
          </Grid>
          )
          }

        </Box>
      </Box>
    </>
  );
}
export default CommitPage;