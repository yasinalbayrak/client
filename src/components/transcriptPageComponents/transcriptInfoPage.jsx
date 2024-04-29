import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const {edit} = location.state || {};
  const navigate = useNavigate();
  const userID = useSelector((state) => state.user.id);
  const { id } = useParams();
  const [studentInfo, setstudentInfo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTranscript = await getCurrentTranscript(userID);
        setstudentInfo(currentTranscript);

      } catch (error) {
        // Centralized error handling or log the error
        console.error("Error fetching data:", error);
        setstudentInfo(null);
      }
    };

    fetchData();
  }, [userID]);


  const handleSubmit = () => {
    if(id){
      if(edit){
        navigate("/edit-apply/"+id, {replace: true})
      }
      else{
        navigate("/apply/"+id, {replace: true})
      }
      
    }
    else{
      navigate("/profile/"+userID, { replace: true })
    }
  }


  const rows = [
    { name: "Student ID:", val: studentInfo?.studentSuId },
    { name: "Name Surname:", val: studentInfo?.studentName },
    { name: "GPA:", val: studentInfo?.cumulativeGPA },
    { name: "Current term:", val: studentInfo?.term },
    { name: "Faculty:", val: studentInfo?.faculty },
    { name: "Major:", val: studentInfo?.program?.majors},
    { name: "Minor:", val: studentInfo?.program?.minors },
    { name: "Year:", val: studentInfo?.year },

  ];
  console.log(rows);
  return (
    <>
        {(
          <Box sx={{ display: "flex" }}>
            <Sidebar></Sidebar>
            <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
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
                              {Array.isArray(row.val) ? row.val.map((item, idx) => (
                                  <React.Fragment key={idx}>
                                    {item}{idx < row.val.length - 1 && <br/>}
                                  </React.Fragment>
                              )) : row.val}
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
                  <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => {if(id){navigate("/transcriptUploadPage/"+id, { replace: true })}
                else{
                  navigate("/transcriptUploadPage", { replace: true })
                
                }}} color="error">
                    Upload new transcript
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" startIcon={<ArrowForwardIcon />} onClick={handleSubmit} color="success" >
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