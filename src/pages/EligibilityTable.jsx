import React from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import "../pages/font-file.css"

export const useStyles = makeStyles({
    
    table: {
        minWidth: 650,
        userSelect: "none",
        
    },
    header: {
        backgroundColor: 'rgba(57, 66, 99,0.95)',
        color: 'white',
        fontWeight: 'bold'
    },
    row: {
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        

    },
    eligibleBox: {
        border: "2px solid rgba(194,233,153,1)",
        padding: "2px 4px",
        backgroundColor: "rgba(248,255,238,1)",
        color: "rgba(86,156,48,1)"
    },
    notEligibleBox: {
        border: "2px solid rgba(245,190,156,1)",
        padding: "2px 4px",
        backgroundColor: "rgba(253,242,233,1)",
        color: "rgba(195,69,36,1)"
    },
    deadlinePassed: {
        border: "2px solid rgb(157, 158, 157)",
        padding: "2px 4px",
        backgroundColor: "rgb(245, 245, 245)",
        color: "rgb(135, 136, 135)"
    },
    tableCell: {
        padding: "20px",
        fontFamily: 'Open Sans, sans-serif'
    },
    headerCell: {
        padding: "20px",
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: "bold",
        color: "white"

    },
    pendingBox: {
        // a box for pending applications, it has a yellow border and a dark yellow background
        border: "2px solid rgba(255,174,0, 0.8)",
        padding: "2px 4px",
        backgroundColor: "rgba(250,195,1,0.13)",
        color: "rgb(255,174,0)",
        minWidth: "90px"
    },
    acceptedBox: {
        border: "2px solid rgba(194,233,153,1)",
        padding: "2px 4px",
        backgroundColor: "rgba(248,255,238,1)",
        color: "rgba(86,156,48,1)",
        minWidth: "90px"
    },
    rejectedBox: {
        border: "2px solid rgba(245,190,156,1)",
        padding: "2px 4px",
        backgroundColor: "rgba(253,242,233,1)",
        color: "rgba(195,69,36,1)",
        minWidth: "90px"
    },
    withdrawnBox: {
        border: "2px solid rgba(137, 137, 137, 1)",
        padding: "2px 4px",
        backgroundColor: "rgba(214, 214, 212, 1)",
        color: "rgba(137, 137, 137, 1)",
        minWidth: "90px"
    },
    waitlistedBox: {
        border: "2px solid  rgba(157, 158, 157, 1)",
        padding: "2px 4px",
        backgroundColor: " rgba(245, 245, 245, 1)",
        color: " rgba(135, 136, 135, 1)",
        flexWrap: "wrap",
        maxWidth: "90px"
    }

});

export default function EligibilityTable({eligibility}) {
    const classes = useStyles();

    console.log('eligibility :>> ', eligibility);
    return (
        <>
            
            <Grid container justifyContent="center" alignItems="flex-start" style={{ marginTop: "1rem", padding: "0 5%" }}>
                {eligibility !== null && (
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow className={classes.header}>
                                    <TableCell className={classes.headerCell}>Course Code</TableCell>
                                    <TableCell className={classes.headerCell}>Minimum Required Grade</TableCell>
                                    <TableCell className={classes.headerCell}>In Progress Applicants</TableCell>
                                    <TableCell className={classes.headerCell}>Your grade</TableCell>
                                    <TableCell className={classes.headerCell}>Eligibility</TableCell>
                                    <TableCell className={classes.headerCell}>Eligibility info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {eligibility.map((row, index) => (
                                    <TableRow key={index} className={classes.row}>
                                        <TableCell className={classes.tableCell} component="th" scope="row">
                                            <span style={{fontWeight: "bold"}}> {row.courseCode} </span>
                                        </TableCell>
                                        <TableCell className={classes.tableCell}>{row.requiredLetterGrade ?? "-"}</TableCell>
                                        <TableCell className={classes.tableCell}>{row.isInProgressAllowed ? "Allowed" : "Not Allowed"}</TableCell>
                                        <TableCell className={classes.tableCell}>{row.studentGrade ?? "-"}</TableCell>
                                        <TableCell className={classes.tableCell}>
                                            <Box align="center" className={row.isEligible ? classes.eligibleBox : classes.notEligibleBox}>
                                                {row.isEligible ? "Eligible" : "Not Eligible"}
                                            </Box>
                                        </TableCell>
                                        <TableCell className={classes.tableCell}>{row.eligibilityInfo}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Grid>
        </>
    );
}