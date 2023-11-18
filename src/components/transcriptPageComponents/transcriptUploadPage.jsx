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
  import { useNavigate, useParams } from "react-router-dom";
import { postTranscript } from "../../apiCalls";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const TranscriptPage = (props) => {
    const navigate = useNavigate();
    const username = useSelector((state) => state.user.username);
    const state = useSelector((state) => state);
    const name = useSelector((state) => state.user.name);
    const surname = useSelector((state) => state.user.surname);
    const userId = useSelector((state) => state.user.id)

    const { id } = useParams();
    const [transcript, setTranscript] = useState(null);
    const [filename, setFile] = useState(() => {
      const initialFileName = "No File Uploaded";
      return initialFileName;
    });
  
  
    const onSubmit = () => {
      var temp = [];
      console.log(temp);
      postTranscript(id, state.user.id, []).then((res) => {
        console.log(res);
        navigate("/success", { replace: true, state: { successText: "You have applied successfully." } });
      }).catch((_) => {
        /* Already handled */
      });
  
    };
  
    const onFileChange = (e) => {
      if (!e.target.files) {
        return;
      }
  
      const file = e.target.files[0];
      setTranscript(file);
      const { name } = file;
      setFile(name);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentId", userId)
      console.log(formData);
  
      postTranscript(formData).then((res) => {
        console.log(res);
      }
      );
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
                      <Button variant="contained" component="label" onClick={onFileSubmit}>
                        Upload File
                        <input type="file" hidden onChange={onFileChange} />
                      </Button>
                      <Typography alignItems="center" justifyContent="center" textAlign="center" m={2}>
                        {filename}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
                <Grid>  
                  <FormControlLabel required control={<Checkbox />} label="By uploading my transcript, I consent to the collection and use of this personal data for the purpose of LA application." />
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
                    <Button variant="contained" startIcon={<FileUploadIcon />} color="success" onClick={onSubmit}>
                      Upload
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
  