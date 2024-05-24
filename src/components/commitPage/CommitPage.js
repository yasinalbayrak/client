

import React, { useEffect, useState } from "react";
import { commitAppReq, forgivenAppReq, getApplicationRequestsByStudentId } from "../../apiCalls";
import AppBarHeader from "../AppBarHeader";
import Sidebar from "../Sidebar";
import { useSelector } from "react-redux";
import BackButton from "../buttons/BackButton";
import CheckIcon from '@mui/icons-material/Check';



import CommitRow from "./CommitRow";
import { Alert, Box, Grid, Typography } from "@mui/material";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Decision from "../../assets/decision.png";
import Approve from "../../assets/approve.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Popup from "../popup/Popup";

function OutlinedCard({ appReq,
  setTypePopup,
  flipPopup,
  setDecisionAppReqId }) {
  console.log('appReq :>> ', appReq);

  const statusList = ["COMMITTED", "DECLINED", "NOT_DECIDED"];
  var randomNumber = Math.floor(Math.random() * 3);


  const [commitStatus, setCommitStatus] = useState(statusList[!(appReq.committed || appReq.forgiven) ? 2 : appReq.committed ? 0 : 1])

  useEffect(() => {
    setCommitStatus(statusList[!(appReq.committed || appReq.forgiven) ? 2 : appReq.committed ? 0 : 1])
  }, [
    appReq
  ])

  const renderIcon = (status) => {
    switch (status) {
      case statusList[0]:

        return <CheckCircleIcon sx={{
          position: 'absolute',
          top: -10,
          left: -10,
          zIndex: 1000,
          color: 'green',
          fontSize: '30px',
          backgroundColor: 'white',
          borderRadius: '50%'
        }} />

      case statusList[1]:
        return <CancelIcon sx={{
          position: 'absolute',
          top: -10,
          left: -10,
          zIndex: 1000,
          color: 'red',
          fontSize: '30px',
          backgroundColor: 'white',
          borderRadius: '50%'
        }} />

      default:
        return;
    }
  }
  const getStatusColor = (status) => {
    switch (
    status
    ) {
      case statusList[0]:
        return "green";
      case statusList[1]:
        return "red";
      default:
        return "gray";
    }
  }
  return (
    <Box sx={{ minWidth: 275, position: 'relative' }}>
      <Card variant="outlined" sx={{
        backgroundColor: "white",
        padding: "0.5rem",
        borderRadius: "10px",
       

        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: `0.8px solid ${getStatusColor(commitStatus)}`,
          borderRadius: '10px',
          pointerEvents: 'none',
          boxSizing: 'border-box',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }
      }}>

        {renderIcon(commitStatus)}

        <React.Fragment>
          <CardContent>
            <Grid container alignItems="center" mb={2}>
              {commitStatus === statusList[2] && <img src={Decision} alt="Decision" style={{
                width: 30,
                height: 30,
                marginRight: 5
              }} />}
              <Typography sx={{ fontSize: 18, fontWeight: "bold", mt: 0.5 }} color="text.primary">
                {appReq.application.course.courseCode}
              </Typography>
            </Grid>
            {appReq.application.authorizedInstructors.map((ins) => (
              <Typography color="text.secondary">
                {ins.user.name + " " + ins.user.surname}
              </Typography>
            ))}

            <Typography variant="body2" mt={3}>
              {appReq.weeklyWorkHours.slice(2, -1)} Hours / Week
            </Typography>
          </CardContent>
          <CardActions sx={{ width: "100%", display: "flex" }}>
            {commitStatus === statusList[2] ? <>
              <Button
                size="small"
                variant="outlined"
                color="success"
                sx={{ margin: 0, flexGrow: 1, borderRadius: "2px", borderRight: "none" }}
                onClick={() => { setTypePopup(1); flipPopup(); setDecisionAppReqId(appReq.applicationRequestId) }}
              >
                Commit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                sx={{ flexGrow: 1, margin: '0 !important', borderRadius: "2px" }}
                onClick={() => { setTypePopup(2); flipPopup(); setDecisionAppReqId(appReq.applicationRequestId) }}
              >
                Decline
              </Button>
            </>
              :
              <Button
                variant="contained"
                color={commitStatus === statusList[0] ? "success" : "error"}
                sx={{
                  flexGrow: 1,
                  cursor: "default",
                  ':hover': {
                    bgcolor: (theme) => commitStatus === statusList[0] ? theme.palette.success.main : theme.palette.error.main,
                    '@media (hover: none)': {
                      bgcolor: (theme) => commitStatus === statusList[0] ? theme.palette.success.main : theme.palette.error.main,
                    }
                  }
                }}
                disableRipple
                disableElevation
                disableFocusRipple
              >
                {commitStatus}
              </Button>

            }
          </CardActions>
        </React.Fragment>
      </Card>
    </Box>
  );
}

function CommitPage() {
  const user = useSelector((state) => state.user);
  const term = useSelector((state) => state.user.term);
  const { id: userID, isInstructor } = user;
  const [rows, setRows] = React.useState(null);
  const [popUpOpened, setPopoUpOpened] = useState(false);
  const [typePopup, setTypePopup] = useState(0);
  const [decisionAppReqId, setDecisionAppReqId] = useState(null);
  const [committmentCount, setCommitmentCount] = useState(0);
  const commitText = "Are you sure you want to commit to this application? Commitment action is irreversible, and if you commit, instructor(s) of the course will be notified, and you will be LA candidate of the course.";
  const forgiveText = "Are you sure you want to ask for forgiveness for this application? If you ask for forgiveness, you will not be the LA of this course.";

  const flipPopup = () => {
    setPopoUpOpened((prev) => !prev);
  };

  const handleCommit = (appReqId) => {
    commitAppReq(appReqId).then((res) => {
      console.log('res Yasoo:>> ', res);
      setRows((prev) => (prev.map((appReq) => (appReq.applicationRequestId === appReqId ? { ...appReq, committed: true } : { ...appReq }))))
      setCommitmentCount(p=>(p+ parseInt(res.weeklyWorkHours.slice(2,-1),10)))
    }).catch(_ => {
      console.error("Error");
    }).finally(()=>{
      setDecisionAppReqId(null);
    })
    
  }

  const handleForgive = (appReqId) => {
    forgivenAppReq(appReqId).then((res) => {
      console.log(res);
      setRows(prev => prev.map(appReq => appReq.applicationRequestId === appReqId ? { ...appReq, forgiven: true } : appReq))

    }).catch(_ => {
      console.error("Error");
    }).finally(()=>{
      setDecisionAppReqId(null);
    })
  }
  useEffect(() => {
    try {
      getApplicationRequestsByStudentId(userID).then((results) => {
        const rowss = results.content;
        let cc = 0;
        const acceptedRows = rowss.filter((row) => {
          if(row.committed) {
            cc += +row.weeklyWorkHours.slice(2,-1);
          }
          return row.status === "Accepted" && row.application.term === term.term_desc
        });
        setRows(acceptedRows);
        setCommitmentCount(cc);
      });
    } catch (e) {
      console.log(e);
    }
  }, [userID, term]);

  console.log("APPLICATION REQUESTS", rows);


  return (
    rows && <>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <BackButton to={"/home"} />
          <AppBarHeader />
          {rows.length === 0 ? (<>
            <Box direction="columns" sx={{ mt: 20, textAlign: 'center' }}>
              <Typography variant="h4" marginBottom={2} marginRight={1}>
                No Accepted Applications
              </Typography>

            </Box>
          </>) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

              <Grid container item direction="column" justifyContent="flex-start" alignItems="flex-start" width="50%">
                <Grid item marginBottom={5}>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }} marginRight={1} mb={2}>
                    Learning Assistantship Offers
                  </Typography>

                  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    Congratulations! You've been accepted for Learning Assistantships in the following courses:
                  </Alert>
                  <Typography variant="body1" my={2}>
                    Total Work Hours Committed in <strong> {term.term_desc} </strong>   so far: {committmentCount} / 10
                  </Typography>
                </Grid>
                <Grid item container sx={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "flex-start"
                }}>

                  {rows.map((appReq) => <OutlinedCard
                    appReq={appReq}
                    setTypePopup={setTypePopup}
                    flipPopup={flipPopup}
                    setDecisionAppReqId={setDecisionAppReqId}
                  />)}

                </Grid>
              </Grid>
            </Box>
          )
          }
          <Popup
            opened={popUpOpened}
            flipPopup={flipPopup}
            title={"LAship Decision"}
            text={typePopup === 1 ? commitText : forgiveText}
            posAction={() => {
              if (typePopup === 1) {
                handleCommit(decisionAppReqId);
              }
              else {
                handleForgive(decisionAppReqId);
              }
              flipPopup();
            }}
            negAction={flipPopup}
            posActionText={typePopup === 1 ? "Commit" : "Forgive Me"}
          />
        </Box>
      </Box>
    </>
  );
}
export default CommitPage;