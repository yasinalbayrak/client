import React, { useEffect, useRef, useState } from "react";
import AppBarHeader from "../AppBarHeader";
import Sidebar from "../Sidebar";
import {
    Typography,
    Box,
    Button,
    Grid,
    Divider,
  } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { postTranscript } from "../../apiCalls";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from '@mui/icons-material/Done';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import handleError, {handleInfo} from "../../errors/GlobalErrorHandler"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const TranscriptPage = (props) => {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const state = useSelector((state) => state);
  const name = useSelector((state) => state.user.name);
  const surname = useSelector((state) => state.user.surname);
  const userId = useSelector((state) => state.user.id)
  const [isTranscriptUploded, setIsTranscriptUploded] = useState(false);
  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [filename, setFilename] = useState(() => {
    const initialFileName = "No File Uploaded";
    return initialFileName;
  });
  
  const onCheckboxChange = (e) => {
    setConsentChecked(e.target.checked);
  };

  const onSubmit = () => {
    if (!transcript)
      handleInfo("You should upload your transcript to continue.")
    else if (!consentChecked) {
      // Display an error or prevent submission
      handleInfo("Please consent to the terms before submitting.");
      return;
    }
    else{
      const formData = new FormData();
      formData.append("file", transcript);
      formData.append("studentId", userId)
      console.log(filename);
      postTranscript(formData).then((res) => {
        navigate("/transcriptInfoPage/"+id, { replace: true });
          }
      ).catch((_) => {
        /* Error is already printed */
      });


      }
  };


    const onFileChange = (e) => {
      if (!e.target.files) {
        return;
      }

      const file = e.target.files[0];
      if (file?.type !== "application/pdf") {
        handleInfo("Please upload a valid PDF file.");
        return;
      }
      setTranscript(file);
      const { name } = file;
      setFilename(name);
    };
    const onFileSubmit = () => {
      
    }
  
    useEffect(() => {
      if (transcript) {
        console.log("Transcript is added correctly:" + transcript);
      } else {
        console.log("Transcript is not added correctly.");
      }
    }, [transcript]);

    console.log(id);
  
    return (
      <>
        {(
          <Box sx={{ display: "flex" }}>
            <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
            <Sidebar></Sidebar>
              <AppBarHeader />
              <Grid container direction="column" alignItems="center" justifyContent="center" paddingY={2}>
                <Grid item>
                  <Typography variant="h4">Welcome to LA Application Page</Typography>
                  <Divider></Divider>
                  <br />
                  <Typography variant="h4"></Typography>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="warning">
                        To proceed to applications, please upload your most current transcript in pdf format first!<br />
                        The information in the transcript you upload will be used in your LA applications.
                        </Alert>
                    </Stack>
                    <br />
                </Grid>
                <Grid item container direction="rows" alignItems="center" justifyContent="center" sx={{ m: 1, marginBottom: 3 }}>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={2}>
                    <Typography textAlign="center">Upload your transcript:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid item container direction="rows">
                      <Button variant="contained" component="label" onClick={onFileSubmit}  size="small"
                              sx={{
                                height: '45px',
                                fontSize: '0.750rem',
                              }}>
                        Upload File
                        <input type="file" hidden onChange={onFileChange} accept=".pdf" />
                      </Button>
                      <Typography alignItems="center" justifyContent="center" textAlign="center" m={2}>
                        {filename !== "No File Uploaded" ? (
                            <>
                              <FontAwesomeIcon icon={faFilePdf} style={{ color: 'red' }}/>
                              <span style={{ fontSize: 'smaller', marginLeft: '0.3em' }}>{filename}</span>
                            </>
                        ) : (
                            <span style={{ fontSize: 'smaller' }}>{filename}</span>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
                <Grid>  
                  <FormControlLabel
                   required
                   control={<Checkbox onChange={onCheckboxChange}/>} label="By uploading my transcript, I consent to the collection and use of this personal data for the purpose of LA application." />
                </Grid>
                <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                    
                  <Grid item>
                  <br></br>
                    <Button variant="contained" startIcon={<CloseIcon />} onClick={() => navigate("/home", { replace: true })} color="error">
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                  <br></br>
                    <Button variant="contained" startIcon={<DoneIcon />} color="success" onClick={onSubmit}>
                      DONE
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
  
export default TranscriptPage;
  