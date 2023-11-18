import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBarHeader from "../AppBarHeader";
import Sidebar from "../Sidebar";
import {
    Typography,
    Box,
    Button,
    Grid,
    Divider,
  } from "@mui/material";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCurrentTranscript } from "../../apiCalls";

const TranscriptInfo=(props)=> {
  const navigate = useNavigate();
  const userID = useSelector((state) => state.user.id);
  const [studentInfo, setstudentInfo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        data=getCurrentTranscript(userID);
        console.log(data);
        setstudentInfo(data);
        
        const transcripInfo = data.map((studentInfo) => {
          
          const faculty= "istendi";
          const program= studentInfo.program.majors[0];//değişecek
          
          
          
          return {
            ...studentInfo, 
            modifiedprogram:program,
          };
        });
        setstudentInfo(transcripInfo);
      } catch (error) {
        console.error("Failed to fetch student info:", error);
      }
    }
    fetchData();
  }, []);


  const rows = [
    { name: "Student ID:", val: studentInfo.studentId },
    { name: "Name Surname:", val: studentInfo.studentName },
    { name: "GPA:", val: "" },
    { name: "Current term:", val: "-" },
    { name: "Faculty:", val: "-" },
    { name: "Program:", val: "-" },
    { name: "Year:", val: "-" },

  ];

  return (
    <>
        {(
          <Box sx={{ display: "flex" }}>
            <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
            <Sidebar></Sidebar>
              <AppBarHeader />
              <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
              <Grid item>
                <Typography variant="h4">Information that will used for your LA Application</Typography>
                <Divider></Divider>
              </Grid>
              <Grid>
                <br></br>
                <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="info">
                        
                        The following information is taken from your transcript and will be used in all your applications for this term. <br>
                        </br>In addition to this information, information requested specifically for the application can also be used, i.e. course grades.<br />
                        Make sure that the information below is up to date and if you think there is an error, upload your most current transcript.
                        </Alert>
                        <br></br>
                </Stack>
              </Grid>
              
              <Grid item sx={{ m: 2 }}>
                <TableContainer >
                  <Table sx={{ minWidth: 500, border: 1.5, borderColor: "#cccccc" }} aria-label="simple table">
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row" align="center" sx={index % 2 === 0 && { backgroundColor: "#f2f2f2" }}>
                            {row.name}
                          </TableCell>
                          <TableCell align="center" sx={index % 2 === 0 && { backgroundColor: "#f2f2f2" }}>
                            {row.val}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <br></br>
              <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                <Grid item>
                  <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate("/home", { replace: true })} color="error">
                    Upload new transcript
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" startIcon={<ArrowForwardIcon />} color="success" >
                  Continue with this information
                  </Button>
                </Grid>
              </Grid>
              
              
              
            </Grid>
            </Box>
          </Box>
        )}
    </>
  );
};

export default TranscriptInfo;