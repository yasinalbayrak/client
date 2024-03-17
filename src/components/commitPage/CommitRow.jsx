import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import HandshakeIcon from '@mui/icons-material/Handshake';
import {
    TableCell,
    TableRow,
    Grid,
  } from '@mui/material';
  import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';



export default function CommitRow(props) {

    const {row} = props;

    const [application, setApplication] = useState(row.application);
    const instructor = application?.authorizedInstructors[0].user;

    useEffect(() => {
        const [firstName, lastName] = [(instructor?.name), instructor?.surname];
        const formattedFirstName = (firstName).charAt(0).toUpperCase() + (firstName).slice(1);
        const formattedLastName = (lastName).charAt(0).toUpperCase() + (lastName).slice(1);
        const modifiedInstructorName = formattedFirstName.trim() + " " + formattedLastName.trim();
        setApplication(prev => ({...prev, instructorName: modifiedInstructorName}));
    }, [instructor]);

        
    

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
                <Grid item container direction="column" justifyContent="center" alignItems="center" maxWidth={10} >
                    <Grid item mb={2}>
                    <Button variant="contained" color="success" size='small' startIcon={<HandshakeIcon />}>
                        Commitment
                    </Button>
                    </Grid>
                    <Grid item >
                    <Button variant="outlined" color="info" size='small' endIcon={<DirectionsRunIcon />}>
                        Ask for Forgiveness
                    </Button>
                    </Grid>
                </Grid>
            </TableCell>
            
        </TableRow>
    )

}