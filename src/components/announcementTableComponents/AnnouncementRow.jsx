import React, { useState } from 'react';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Popup from '../popup/Popup';
import { deleteApplicationById } from "../../apiCalls"
import InstructorList from './InstructorList';
import DesiredCourseGradesPopup from './DesiredCourseGradesPopup';

export default function AnnouncementRow({ key, data, tabValue, userName, navigate, isInstructor, isApplied, deleteCallBack }) {

  const { instructor_names, weeklyWorkingTime, term, status: applicationStatus, isTimedOut } = data;

  const isTranscriptUploaded = useSelector((state) => state.user.isTranscriptUploded);

  const { lastApplicationDate,
    minimumRequiredGrade,
    jobDetails,
    applicationId,
    previousCourseGrades,
    isInprogressAllowed,
    course
  } = data.application ?? data;

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

  console.log('appReqId :>> ', applicationRequestId);

  const renderButtons = () => {
    // Condition for instructor
    if (isInstructor) {
      if (instructor_names.some((instructor) => (userName.toLowerCase() === instructor.toLowerCase()))) {
        return (<>
          <Button
            variant="contained"
            onClick={() => navigate(`/edit-announcement/${applicationId}`, { replace: true })}
            sx={{
              justifyContent: 'center',
              paddingRight: 0,
              paddingLeft: 0,

            }}

          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            onClick={flipPopup}
            color='error'
            sx={{
              justifyContent: 'center',
              paddingRight: 0,
              paddingLeft: 0,
              marginLeft: '0rem'
            }}

          >
            <DeleteForeverIcon />
          </Button>

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
          <span style={{ color: 'green' }}>
            Applied
          </span>
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
                      navigate("/transcriptUploadPage/"+applicationId, { replace: true });
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
  const example_ins_list = [
    "Atil Utku Ay",
    "Inanc Arin",
    "Duygu Karaoglan Altop",
    "Yasin Albayrak",
    "Sila Ozinan",
    "Murat Demiraslan",
    "Erkay Savas"
  ]
  console.log('previousCourseGrades :>> ', previousCourseGrades);
  return (course.courseCode &&
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell sx={{ borderBottom: "none", width:"6rem", minWidth:"6rem", maxWidth:"6rem"  }} component="th" scope="row">
        {course.courseCode}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", minWidth: "14rem", maxWidth: "14rem", width:"14rem" }} align="left">
        <InstructorList instructor_names={instructor_names} />

      </TableCell>
      <TableCell sx={{ borderBottom: "none",width:"4rem", minWidth:"4rem", maxWidth:"4rem"  }} align="left">
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
      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", width:"4rem", minWidth:"4rem", maxWidth:"4rem" }} align="left">
        {term}
      </TableCell>

      <TableCell sx={{ borderBottom: "none", width: "7rem", maxWidth:"7rem", minWidth:"7rem" }} align="center">
        {weeklyWorkingTime + " Hours"}
      </TableCell>
      <TableCell sx={{ bgcolor: "#FAFAFA",borderBottom: "none", width: "7rem" }} align="center">
        <DesiredCourseGradesPopup isInprogressAllowed={isInprogressAllowed} courseCode={course.courseCode} grade ={minimumRequiredGrade} previousCourseGrades={previousCourseGrades}/>
      </TableCell>
      <TableCell sx={{ borderBottom: "none", maxWidth: "10rem", width: "10rem", whiteSpace: "normal", wordWrap: "break-word" }} align="left">
        {jobDetails}
      </TableCell>

      <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", width: "6rem", minWidth:"6rem" }} align="center">
        {renderButtons()}
      </TableCell>

      {!isInstructor && tabValue === 1 && <TableCell sx={{ borderBottom: "none", width:"4rem" }} align="right">
        <Button
          variant='contained'
          onClick={() => navigate("/edit-apply/" + applicationRequestId, { replace: true })}
          startIcon={<EditIcon />} >
        </Button>
      </TableCell>}
    </TableRow>
  );
}