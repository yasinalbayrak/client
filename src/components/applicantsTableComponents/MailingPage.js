import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import BackButton from "../../components/buttons/BackButton";
import { Alert, Box, Grid, Tab, TableBody } from "@mui/material";
import { useActionData } from "react-router";
import { useParams } from "react-router";
import { getAnnouncement, getApplicationRequestsByApplicationId, updateAppEmail, finalizeStatus } from "../../apiCalls";
import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { TextField } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import { Divider } from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import SaveIcon from '@mui/icons-material/Save';
import Popup from "../../components/popup/Popup";
import { handleInfo } from "../../errors/GlobalErrorHandler";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router";
import Chip from '@mui/material/Chip';
import { renderStatusIcon } from "../../components/excelView/DataGridView";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextEditor from "../textEditor/TextEditory";

import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const dummyRows = [
    { student: { user: { universityId: 'U001', name: 'John', surname: 'Doe', photoUrl: 'https://via.placeholder.com/50' } }, status: 'Rejected', statusIns: 'Accepted' },
    { student: { user: { universityId: 'U002', name: 'Jane', surname: 'Smith', photoUrl: 'https://via.placeholder.com/50' } }, status: 'Rejected', statusIns: 'Accepted' },
    { student: { user: { universityId: 'U003', name: 'Jim', surname: 'Beam', photoUrl: 'https://via.placeholder.com/50' } }, status: 'In Progress', statusIns: 'Rejected' },
    { student: { user: { universityId: 'U004', name: 'Jack', surname: 'Daniels', photoUrl: 'https://via.placeholder.com/50' } }, status: 'In Progress', statusIns: 'Rejected' },
    { student: { user: { universityId: 'U001', name: 'John', surname: 'Doe', photoUrl: 'https://via.placeholder.com/50' } }, status: 'Rejected', statusIns: 'Accepted' },
    { student: { user: { universityId: 'U002', name: 'Jane', surname: 'Smith', photoUrl: 'https://via.placeholder.com/50' } }, status: 'Rejected', statusIns: 'Accepted' },
    { student: { user: { universityId: 'U003', name: 'Jim', surname: 'Beam', photoUrl: 'https://via.placeholder.com/50' } }, status: 'In Progress', statusIns: 'Rejected' },
    { student: { user: { universityId: 'U004', name: 'Jack', surname: 'Daniels', photoUrl: 'https://via.placeholder.com/50' } }, status: 'In Progress', statusIns: 'Rejected' }
];
function MailingPage(props) {

    const { appId } = useParams();
    const [rows, setRows] = React.useState(null);
    const [title, setTitle] = React.useState("");
    const [application, setApplication] = React.useState(null);
    const [acc, setAcc] = React.useState(null);
    const [rej, setRej] = React.useState(null);
    const [changes, setChanges] = React.useState(dummyRows);
    const [accMail, setAccMail] = React.useState("");
    const [rejMail, setRejMail] = React.useState("");
    const [finalizePopoUpOpened, setFinalizePopoUpOpened] = React.useState(false);
    const [finalized, setFinalized] = React.useState(false);
    const navigate = useNavigate();
    const [value, setValue] = React.useState('');

    useEffect(() => {

        getApplicationRequestsByApplicationId(appId).then((results) => {
            setRows(results.applicationRequests);
            setTitle(results.course.courseCode);
        });

        getAnnouncement(appId).then((result) => {
            setApplication(result);
            setAccMail(result.acceptEmail ?? "");
            setRejMail(result.rejectEmail ?? "");
        }
        );

    }, [finalized]);

    useEffect(() => {
        console.log("rows", rows);
        console.log("application", application);
        console.log("title", title);

        if (rows) {
            const acceptedStudents = rows.filter((row) => row.statusIns === "Accepted" && row.status != "Accepted");
            const rejectedStudents = rows.filter((row) => row.statusIns === "Rejected" && row.status != "Rejected");
            setAcc(acceptedStudents);
            setRej(rejectedStudents);
            setChanges(acceptedStudents.concat(rejectedStudents));
            console.log("acceptedStudents", acceptedStudents);
            console.log("rejectedStudents", rejectedStudents);
        }




    }, [rows]);

    console.log("accMail", accMail);

    const handleAccMailChange = (e) => {
        setAccMail(e.target.value);
    }

    const handleRejMailChange = (e) => {
        setRejMail(e.target.value);
    }

    const saveEmails = () => {
        const data = {
            acceptEmail: accMail,
            rejectEmail: rejMail
        }

        updateAppEmail(appId, data).then((result) => {
            handleInfo("Emails are successfully saved. Saved emails can be used later.");
            console.log("result", result);
        });
    }

    const flipPopup = () => {

        if (accMail === "" || rejMail === "") {
            handleInfo("Please fill the email content to finalize the status.");
            return;
        }
        else {
            setFinalizePopoUpOpened((prev) => !prev);
        }

    };



    const finalizeStatuss = (appId) => {
        try {
            finalizeStatus(appId, accMail, rejMail).then((res) => {

                handleInfo("Changes are successfully finalized and announced to accepted and rejected students.")
                setFinalized(prev => !prev);
                flipPopup();
                navigate("/application-of/" + appId);
                saveEmails();


            });
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        rows && <Box sx={{ display: "flex" }}>
            <Sidebar></Sidebar>
            <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
                <Grid item><BackButton to={"/application-of/" + appId} /></Grid>

                <Box >

                    <Grid container direction="row" alignItems="flex-start" justifyContent="stretch" spacing={5}>
                        <Grid item xs={6}>
                            <Box>
                                <Typography align="center" variant="h5" sx={{ mb: 2 }}>Accepted & Rejected Students</Typography>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status Change</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {changes && changes.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="right">
                                                        <Avatar
                                                            src={row.student.user.photoUrl}
                                                            alt="Student Photo"
                                                            sx={{ width: 50, height: 50 }}
                                                            slotProps={{
                                                                img: {
                                                                    style: {
                                                                        padding: "0px",
                                                                        height: '100%',
                                                                        width: '100%',
                                                                        objectFit: 'fill',
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.student.user.universityId}
                                                    </TableCell>
                                                    <TableCell>{row.student.user.name + " " + row.student.user.surname}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            variant="outlined"
                                                            size="small"
                                                            icon={renderStatusIcon(row.status).icon}
                                                            label={row.status}
                                                            sx={{
                                                                borderColor: renderStatusIcon(row.status).color,
                                                                color: renderStatusIcon(row.status).color
                                                            }}
                                                        />
                                                        <TrendingFlatIcon sx={{ mx: 2 }} />
                                                        <Chip
                                                            variant="outlined"
                                                            size="small"
                                                            icon={renderStatusIcon(row.statusIns).icon}
                                                            label={row.statusIns}
                                                            sx={{
                                                                borderColor: renderStatusIcon(row.statusIns).color,
                                                                color: renderStatusIcon(row.statusIns).color
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>

                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>

                        <Grid item xs={6}>

                            <Grid item>
                                <Grid
                                    container
                                    justifyContent="start"
                                    alignItems="center"
                                    sx={{ width: "100%"}}
                                    mb={2} 
                                    ml={5}
                                >
                                    <Grid item xs={12} md={7}>
                                        <Alert variant="outlined" severity="info">
                                            <span style={{fontStyle: "italic"}}> Supported user data fields:</span> [:course:], [:fullname:], [:firstname:], [:lastname:]
                                        </Alert>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                                    <BorderColorOutlinedIcon sx={{ color: "green" }} />

                                    <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2, color: "green", borderColor: "green" }} />
                                    <Box>


                                        <Typography align="start" color="green" variant="h6" sx={{}}>Mail for Accepted Students</Typography>
                                        <TextEditor theme="snow" value={accMail} setValue={setAccMail} bg={"white"} bc={"green"} id={1} />
                                    </Box>


                                </Box>

                            </Grid>

                            <Grid item sx={{ mt: 2 }}>
                                <Box>


                                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                                        <BorderColorOutlinedIcon sx={{ color: "red" }} />

                                        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2, borderColor: "red" }} />
                                        <Box>
                                            <Typography align="start" color="error" variant="h6">Mail for Rejected Students</Typography>
                                            <TextEditor theme="snow" value={rejMail} setValue={setRejMail} bg={"white"} bc={"red"} id={2} />
                                        </Box>




                                    </Box>

                                </Box>

                            </Grid>
                        </Grid>

                    </Grid>


                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button
                            variant="outlined"
                            endIcon={<SaveIcon />}
                            sx={{ bgcolor: "green", color: "white", ":hover": { bgcolor: "black" }, mt: 2 }}
                            onClick={flipPopup}
                        >
                            Announce Final Results
                        </Button>
                    </Box>



                </Box>

            </Box>

            <Popup
                opened={finalizePopoUpOpened}
                flipPopup={flipPopup}
                title={"Confirm Announcing Final Status?"}
                text={"If you confirm, the final status will be announced to accepted and rejected students with these email bodies.\n\n Do you want to continue?"}
                posAction={() => { finalizeStatuss(application.applicationId); }}
                negAction={flipPopup}
                posActionText={"Finalize"}
            />

        </Box>
    );
}
export default MailingPage;