import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import BackButton from "../../components/buttons/BackButton";
import { Box, Grid, Tab, TableBody } from "@mui/material";
import { useActionData } from "react-router";
import { useParams } from "react-router";
import { getAnnouncement, getApplicationRequestsByApplicationId, updateAppEmail,finalizeStatus } from "../../apiCalls";
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






function MailingPage(props) {

    const { appId } = useParams();
    const [rows, setRows] = React.useState(null);
    const [title, setTitle] = React.useState("");
    const [application, setApplication] = React.useState(null);
    const [acc, setAcc] = React.useState(null);
    const [rej, setRej] = React.useState(null);
    const [accMail, setAccMail] = React.useState("");
    const [rejMail, setRejMail] = React.useState("");
    const [finalizePopoUpOpened, setFinalizePopoUpOpened] = React.useState(false);
    const [finalized, setFinalized] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
            
            getApplicationRequestsByApplicationId(appId).then((results) => {
                setRows(results.applicationRequests);
                setTitle(results.course.courseCode);
            });
    
            getAnnouncement(appId).then((result) => {
                setApplication(result);
                setAccMail(result.acceptEmail??"");
                setRejMail(result.rejectEmail??"");
            }
            );

    }, [finalized]);

    useEffect(() => {
        console.log("rows", rows);
        console.log("application", application);
        console.log("title", title);

        if(rows){
            const acceptedStudents = rows.filter((row) => row.statusIns === "Accepted" && row.status!= "Accepted");
            const rejectedStudents = rows.filter((row) => row.statusIns === "Rejected" && row.status!= "Rejected");
            setAcc(acceptedStudents);
            setRej(rejectedStudents);
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
        
        if(accMail === "" || rejMail === ""){
            handleInfo("Please fill the email content to finalize the status.");
            return;
        }
        else{
            setFinalizePopoUpOpened((prev) => !prev);
        }
        
      };



    const finalizeStatuss = (appId) => {
        try {
            finalizeStatus(appId).then((res) => {
            
            handleInfo("Changes are successfully finalized and announced to accepted and rejected students.")
            setFinalized(prev => !prev);
            
            });
        }
        catch (error) {
            console.log(error);
        }
    }


  return (
    rows &&<Box sx={{ display: "flex" }}>
  <Sidebar></Sidebar>
  <Box component="main" sx={{ flexGrow: 1, m:3 }}>
    <Grid item><BackButton to={"/application-of/" + appId}/></Grid>
    
    <Box sx={{ p: 5, mx:20 , maxHeight:300}}>

        <Grid container direction="row" alignItems="center" justifyContent="space-between">

            <Grid item>
                <Box>
                    <Typography align="center" variant="h5" sx={{}}>Accepted Students</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Previous Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {acc && acc.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{bgcolor: "#FAFAFA",  borderBottom: "none" }} align="right">
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
                                        <TableCell align="center">{row.status}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>
            </Grid>

            <Grid item>
                <Box>
                    <Typography align="center" variant="h5" sx={{}}>Rejected Students</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Previous Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rej && rej.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{bgcolor: "#FAFAFA",  borderBottom: "none" }} align="right">
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
                                        <TableCell align="center">{row.status}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>

            </Grid>
        </Grid>

        
    </Box>

    <Box sx={{ p: 5 }}>

<Grid container direction="row" alignItems="center" justifyContent="space-between">

    <Grid item>
        <Box sx={{ml:10}}>
            <Typography align="center" variant="h5" sx={{}}>Accepted Mail Edit</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                  <BorderColorOutlinedIcon />

                  <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />



                  <TextareaAutosize
                    minRows={3}
                    maxRows={6}
                    name="jobDetails"
                    value={accMail}
                    placeholder="Enter Accept Mail Content"
                    onChange={handleAccMailChange}
                    style={{
                      minWidth: '400px',
                      border: '1px solid #c1c4bc',
                      borderRadius: '5px',
                      padding: '12px',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '15px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  


            </Box>
        </Box>
    </Grid>

    <Grid item>
        <Box sx={{mr:10}}>
        <Typography align="center" variant="h5" sx={{ml:2}}>Rejected Mail Edit</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                  <BorderColorOutlinedIcon />

                  <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />



                  <TextareaAutosize
                    minRows={3}
                    maxRows={6}
                    name="jobDetails"
                    value={rejMail}
                    placeholder="Enter Accept Mail Content"
                    onChange={handleRejMailChange}
                    style={{
                      minWidth: '400px',
                      border: '1px solid #c1c4bc',
                      borderRadius: '5px',
                      padding: '12px',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '15px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  


                </Box>
            
        </Box>

    </Grid>
</Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={saveEmails}>Save Emails</Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Button
                variant="outlined"
                endIcon={<SaveIcon />}
                sx={{ bgcolor: "green", color: "white", ":hover": { bgcolor: "black" }, mt: 2}}
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
            posAction={() => { finalizeStatuss(application.applicationId); flipPopup(); navigate("/application-of/" + appId);}}
            negAction={flipPopup}
            posActionText={"Finalize"}
          />
          
</Box>
  );
}
export default MailingPage;