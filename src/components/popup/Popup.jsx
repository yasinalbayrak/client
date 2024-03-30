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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Popup({ opened, flipPopup, title, text, negAction, posAction, posActionText }) {

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
                        backgroundColor: "#B4B4B3", // Hover color
                      },
                }}>Cancel</Button>
                <Button variant='contained' sx={{
                    backgroundColor: posActionText==="Finalize" || posActionText==="Commit" ? "darkgreen": "rgb(210,56,86)",
                    '&:hover': {
                        backgroundColor: posActionText==="Finalize" || posActionText==="Commit" ? "green" : "rgb(180,46,76)", // Hover color
                      },
                }}
                
                onClick={posAction}>{posActionText}</Button>
            </DialogActions>
        </Dialog>
    );
}
