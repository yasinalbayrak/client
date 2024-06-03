import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import CampaignIcon from '@mui/icons-material/Campaign';
import HandshakeIcon from '@mui/icons-material/Handshake';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Tooltip from "@mui/material/Tooltip";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Popup({ opened, flipPopup, title, text, negAction, posAction, posActionText, isInstructor, isStudent, setIsInstructor, setIsStudent}) {

    


    const getIcon = (posActionText) => {

        if (posActionText === "Finalize") {
            return <CampaignIcon fontSize="large" sx={{
                width: "6rem",
                height: "6rem",
                color: "success.main"
            }} />
        } 

        if (posActionText === "Commit") {
            return <HandshakeIcon fontSize="large"  sx={{
                width: "6rem",
                height: "6rem",
                color: "success.main",
            }} />
        }

        if (posActionText === "Forgive Me") {
            return <DirectionsRunIcon fontSize="large" sx={{
                width: "6rem",
                height: "6rem",
                color: "error.main"
            }} />
        }

        if (posActionText === "Continue") {
            return <CampaignIcon fontSize="large" sx={{
                width: "6rem",
                height: "6rem",
                color: "success.main"
            }} />;
        }
        
        else {
            return <ErrorIcon fontSize="large" sx={{
                width: "6rem",
                height: "6rem",
                color: "error.main"
            }} />
        }
        
    }

   


    return (
        <Dialog
            open={opened}
            TransitionComponent={Transition}
            keepMounted
            onClose={flipPopup}
            aria-describedby="alert-dialog-slide-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: "1rem"
            }}
            maxWidth="xs"
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <ListItemIcon>
                    {getIcon(posActionText)}
                </ListItemIcon>
                <Typography variant="h5">  {title} </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <DialogContentText id="alert-dialog-slide-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
              
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                >
                  <FormControlLabel
                    value={isInstructor}
                    disabled={isStudent}
                    onChange={(_) => {
                        setIsInstructor((prev) => !prev)
                    }}


                    control={<Checkbox

                    />}
                    label="Decision is made by Instructor"
                  />
                  <Tooltip
                      title="Selecting this option does not affect the student for the next semesters"
                      placement="right"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: '#a4a2a2', // Change to your desired lighter color
                            color: 'rgba(255,255,255,0.87)', // Adjust text color if needed
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'

                          },
                        },
                      }}

                  >
                    <IconButton>
                      <HelpCenterIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </FormControl>


              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                >
                  <FormControlLabel
                    value={isStudent}
                    disabled={isInstructor}
                    onChange={(_) => {
                      setIsStudent((prev) => !prev)
                      
                    }}


                    control={<Checkbox

                    />}
                    label="Decision is made by Student"
                  />
                  <Tooltip
                      title="Selecting this option leads to the student is going to be red flagged for the next semesters. For only this course"
                      placement="right"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: '#a4a2a2', // Change to your desired lighter color
                            color: 'rgba(255,255,255,0.87)', // Adjust text color if needed
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'

                          },
                        },
                      }}

                  >
                    <IconButton>
                      <HelpCenterIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </FormControl>
            </DialogActions>
            <DialogActions
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: "1rem"
                }}
            >
                <Button variant='contained' onClick={negAction} sx={{
                    backgroundColor: "#B4B4B3",
                    '&:hover': {
                        backgroundColor: "#B4B4B3",
                      },
                }}>Cancel</Button>
                <Button variant='contained' disabled={!isInstructor && !isStudent} sx={{
                    backgroundColor: ["Commit", "Finalize", "Continue"].includes(posActionText)? "darkgreen": "rgb(210,56,86)",
                    '&:hover': {
                        backgroundColor: ["Commit", "Finalize", "Continue"].includes(posActionText)? "green" : "rgb(180,46,76)", // Hover color
                      },
                }}
                
                onClick={posAction}>{posActionText}</Button>
            </DialogActions>
        </Dialog>
    );
}
