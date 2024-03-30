import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import HandshakeIcon from '@mui/icons-material/Handshake';
import {
    TableCell,
    TableRow,
    Grid,
    Typography,
  } from '@mui/material';
  import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
  import {commitAppReq, forgivenAppReq } from "../../apiCalls";
  import { useStyles } from '../../pages/EligibilityTable';



export default function CommitRow(props) {

    const classes = useStyles();
    const {row, setRefresh} = props;

    const [application, setApplication] = useState(row.application);
    const instructor = application?.authorizedInstructors[0].user;
    const appReqId = row.applicationRequestId;
    const decided = row.committed || row.forgiven

    const getClassCommit = (commit) => {
        if(commit) 
            return classes.acceptedBox;
        else
            return classes.rejectedBox;
        
    }

    useEffect(() => {
        const [firstName, lastName] = [(instructor?.name), instructor?.surname];
        const formattedFirstName = (firstName).charAt(0).toUpperCase() + (firstName).slice(1);
        const formattedLastName = (lastName).charAt(0).toUpperCase() + (lastName).slice(1);
        const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
        setApplication(prev => ({...prev, instructorName: modifiedInstructorName}));
    }, [instructor]);

    const handleCommit = () => {
        commitAppReq(appReqId).then((res) => {
            console.log(res);
            setRefresh(prev => !prev);
        }).catch(_ => {
          console.error("Error");
        })
      }

    const handleForgive = () => {
        forgivenAppReq(appReqId).then((res) => {
            console.log(res);
            setRefresh(prev => !prev);
        }).catch(_ => {
          console.error("Error");
        })
    }

        
    

    return(
        <TableRow sx={{borderBottom:1.25,borderRight:1, borderLeft:1, borderColor:"grey.500"}}>
            <TableCell align="center">
                {application.course.courseCode}
            </TableCell>
            <TableCell align="center">
                {application.term}
            </TableCell>
            <TableCell align="center">
                {row.status}
            </TableCell>
            <TableCell align="center" sx={{wordWrap:"break-word", maxWidth:100, minWidth:100}}>
                {application.instructorName}
            </TableCell>
            <TableCell align="center">
                {!decided ? 
                <Grid item container direction="column" justifyContent="center" alignItems="center" maxWidth={10} >
                    <Grid item mb={2}>
                    <Button 
                    variant="contained" 
                    color="success" 
                    size='small' 
                    startIcon={<HandshakeIcon />}
                    onClick={handleCommit}>
                        Commitment
                    </Button>
                    </Grid>

                    <Grid item >
                    <Button 
                    variant="outlined" 
                    color="info" 
                    size='small' 
                    endIcon={<DirectionsRunIcon />}
                    onClick={handleForgive}>
                        Ask for Forgiveness
                    </Button>
                    </Grid>
                </Grid> 
                : 
                <Grid item >
                    <Typography variant="h7" className={getClassCommit(row.committed)}>{row.committed? "Committed":"Forgiven"}</Typography>
                </Grid>
                }
                
            </TableCell>
            
        </TableRow>
    )

}