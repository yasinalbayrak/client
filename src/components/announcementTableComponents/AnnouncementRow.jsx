import React, { useEffect, useState } from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Popup from '../popup/Popup';
import { deleteApplicationById, getTranscriptInfo, addFollowerToApplication, removeFollowerFromApplication } from "../../apiCalls"
import InstructorList from './InstructorList';
import DesiredCourseGradesPopup from './DesiredCourseGradesPopup';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';
import { useStyles } from '../../pages/EligibilityTable';
import { Box } from '@mui/material';


export default function AnnouncementRow({ key, data, tabValue, userName, navigate, isInstructor, isApplied,isApplied2, deleteCallBack, filterEligibilityCallback, followedApplications, handleFollowedApplications }) {

  const { instructor_names, weeklyWorkingTime, term, section, status: applicationStatus, isTimedOut, authorizedInstructors } = data;
  const [isTranscriptUploaded, setIsTranscriptUploaded] = useState(null); // Or false, depending on your data

  const classes = useStyles();

  useEffect(() => {
    if (isInstructor == false) {
      getTranscriptInfo().then((res) => {
        if (res.isUploadedAnyTranscript !== undefined) {
          setIsTranscriptUploaded(res.isUploadedAnyTranscript);
        } else {
          console.log('isUploadedAnyTranscript not found in the response');
        }
      }).catch(_ => {
        // Error handling
      });
    }
  }, []);

  useEffect(() => {
    console.log(isTranscriptUploaded);
  }, [isTranscriptUploaded]);




  const { lastApplicationDate,
    minimumRequiredGrade,
    jobDetails,
    applicationId,
    previousCourseGrades,
    isInprogressAllowed,
    course,
    isStudentEligible
  } = data.application ?? data;

  const appliedAppReqId = isApplied2(applicationId)[0]?.applicationRequestId;
  const applicationRequestId = data.applicationRequestId ?? "";

  const [deletePopupOpened, setDeletePopupOpened] = useState(false);

  const flipPopup = () => {
    setDeletePopupOpened((prev) => !prev);
  };

  const deleteApplication = () => {
    flipPopup()
    deleteApplicationById(applicationId).then((_) => {
      deleteCallBack(applicationId)
    }).catch((_) => (null))
  }

  const inFollowedApplications = (applicationId) => {
    return followedApplications.some((app) => app.applicationId === applicationId);
  }


  // useEffect(() => {
  //   inFollowedApplications(applicationId);
  // }, [followedApplications, changedFollowed]);


  console.log('appReqId :>> ', applicationRequestId);

  const renderButtons = () => {
    // Condition for instructor
    if (isInstructor) {
      if (instructor_names.some((instructor) => (userName.toLowerCase() === instructor.toLowerCase()))) {
        return (<>
          <IconButton
            onClick={() => navigate(`/edit-announcement/${applicationId}`, { replace: true })}
            sx={{ color: "blue" }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={flipPopup}
            color='error'
            sx={{
              marginLeft: '0rem',
              color: "red"
            }}
          >
            <DeleteForeverIcon />
          </IconButton>

          <Popup
            opened={deletePopupOpened}
            flipPopup={flipPopup}
            title={"Confirm Deletion?"}
            text={"This action is irreversible, and the selected application will be permanently deleted."}
            posAction={deleteApplication}
            negAction={flipPopup}
            posActionText={"Delete"}
          />

        </>

        );
      }
      return null;
    }

    // Conditions for non-instructor
    if (tabValue === 0) {
      // console.log(data)
      console.log("isApplied", isApplied(data.applicationId));
      // console.log("key", key);
      // console.log("indxx", indxx);
      //const applicationId = data.applicationId;
      if (isApplied(applicationId)) {
        return (
          <IconButton
          sx={{ color: "blue" }}
          onClick={() => navigate("/edit-apply/" + appliedAppReqId, { replace: true })}
           >

            <EditIcon />
        </IconButton>
        );
      }
      else {
        if (isTimedOut) {
          return (
            <span style={{ color: 'red' }}>
              Timed Out
            </span>
          );
        } else {
          return (
            <Button
              variant="contained"
              onClick={() => {
                if (isTranscriptUploaded) {
                  // Navigate to the apply page if the transcript is uploaded
                  navigate("/apply/" + applicationId, { replace: true });
                } else {
                  // Navigate to a different page (e.g., transcript upload page) if the transcript is not uploaded
                  navigate("/transcriptUploadPage/" + applicationId, { replace: true });
                }
              }}
            >
              Apply
            </Button>
          );
        }
      }
    }




    let statusColor;
    switch (applicationStatus) {
      case 'ACCEPTED':
        statusColor = 'green';
        break;
      case 'REJECTED':
        statusColor = 'red';
        break;
      default:
        statusColor = 'black';
        break;
    }

    return (
      <span style={{ color: statusColor }}>
        {applicationStatus}
      </span>
    );
  };

  const getClassByElibility = (elibility) => {
    switch (elibility) {
      case "Eligible":

        return classes.eligibleBox;
      case "Not Eligible":

        return classes.notEligibleBox;

      case "Deadline Passed":
        return classes.deadlinePassed;
      default:
        return ;
    }
  }

  const addFollower = (applicationId) => {
    addFollowerToApplication(applicationId).then((res) => {
      filterEligibilityCallback(applicationId);
    }).catch((_) => (null))
  }

  const removeFollower = (applicationId) => {
    removeFollowerFromApplication(applicationId).then((res) => {
      filterEligibilityCallback(applicationId);
    }).catch((_) => (null))
  }


  return (course.courseCode &&
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 }, borderBottom: 1 }}>
      <TableCell sx={{ bgcolor: "#FAFAFA",width: "6rem", minWidth: "6rem", maxWidth: "6rem" }} component="th" scope="row">
        {course.courseCode}
       { !inFollowedApplications(applicationId)? <IconButton
            onClick={() => {addFollower(applicationId); handleFollowedApplications()}}
            sx={{ color: "blue" }}
          >
            <BookmarkBorderIcon />
          </IconButton>:
          <IconButton
            onClick={() => {removeFollower(applicationId); handleFollowedApplications()}}
            sx={{ color: "red" }}
          >
            <BookmarkIcon />
          </IconButton>}
      </TableCell>
      <TableCell sx={{  width: "4rem", minWidth: "4rem", maxWidth: "4rem" }} align="left" component="th" scope="row">
        {(!isInstructor && tabValue === 1 ? data.application?.section : section) || "Not Specified"}
      </TableCell>
      <TableCell sx={{bgcolor: "#FAFAFA", minWidth: "14rem", maxWidth: "14rem", width: "14rem" }} align="left" component="th" scope="row">
        <InstructorList
          instructor_names={instructor_names}
          authorizedInstructors={(!isInstructor && tabValue === 1) ? data.application.authorizedInstructors : authorizedInstructors}
        />
      </TableCell>
      <TableCell sx={{  width: "4rem", minWidth: "4rem", maxWidth: "4rem" }} align="left" component="th" scope="row">
        {lastApplicationDate ? (
          <>
            {new Date(lastApplicationDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            /{" "}
            {new Date(lastApplicationDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </>
        ) : (
          "N/A"
        )}
      </TableCell>


      <TableCell sx={{bgcolor: "#FAFAFA", width: "7rem", maxWidth: "7rem", minWidth: "7rem" }} align="center" component="th" scope="row">
        {weeklyWorkingTime + " Hours"}
      </TableCell>

      {/*
      <TableCell sx={{ width: "7rem" }} align="center" component="th" scope="row">
        <DesiredCourseGradesPopup isInprogressAllowed={isInprogressAllowed} courseCode={course.courseCode} grade ={minimumRequiredGrade} previousCourseGrades={previousCourseGrades}/>
      </TableCell>
      */}
      <TableCell sx={{   maxWidth: "10rem", width: "10rem", whiteSpace: "normal", wordWrap: "break-word" }} align="left" component="th" scope="row">
        {jobDetails}
      </TableCell>

      <TableCell sx={{bgcolor: "#FAFAFA", width: "4rem", minWidth: "4rem" }} align="center" component="th" scope="row">
        {renderButtons()}
      </TableCell>

      {!isInstructor && tabValue === 1 && <TableCell sx={{ width: "4rem" }} align="center" component="th" scope="row">
      <IconButton
        sx={{ color: "blue" }}
        onClick={() => navigate("/edit-apply/" + applicationRequestId, { replace: true })}>
        
          <EditIcon />
      </IconButton>
      </TableCell>}

      {(!isInstructor && tabValue === 0) && <TableCell sx={{ width: "4rem", minWidth: "4rem" }} align="center" component="th" scope="row">
      <Box sx={{ width: "70%", marginLeft: "auto", marginRight: "auto" }} className={getClassByElibility(isStudentEligible)}>
          {isStudentEligible}
        </Box>
      </TableCell>}
    </TableRow>
  );
}