import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllAnnouncementsOfInstructor, getApplicationByUsername, getApplicationRequestsByStudentId } from "../apiCalls";
import { Tooltip } from "@mui/material";

function AnnouncementTable(props) {
  const [rows, setRows] = useState([]);
  const [studentApplications, setStudentApplications] = useState([]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(props.tabValue);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const term = useSelector((state) => state.user.term);
  //const userDisplayName = useSelector((state) => state.user.name);
  //const userDisplayName = "Instructor One" //mock data
  const userName = useSelector((state) => state.user.username);
  const userID = useSelector((state) => state.user.id);
  const [instructorApplications, setInstructorApplications] = useState([]);

  useEffect(() => {
    const modifiedRows = props.rows.map((row) => {
      //Split the instructor_name string by comma
      console.log(row);
      const [lastName, firstName] = [
        row.authorizedInstructors[0]==null ?"" : row.authorizedInstructors[0].user.surname,
        row.authorizedInstructors[0]==null ?"" :row.authorizedInstructors[0].user.name,
      ];
      console.log(" **********************lastName is " + lastName);
      console.log("***********************Name is " + firstName);
      // Rearrange the name format
      const modifiedInstructorName = firstName.trim() + " " + lastName.trim();

      // Return the modified row object
      return {
        ...row,
        instructor_name: modifiedInstructorName,
      };
    });
    console.log(modifiedRows);
    setRows(modifiedRows);
    //console.log(rows);
  }, [props.rows]);

  useEffect(() => {
    if (!isInstructor) {
      getApplicationRequestsByStudentId(userID)
        .then((data) => {
          // Update the state with the retrieved user applications
          setStudentApplications(data);
        })
        .catch((error) => {
          // Handle any errors that occur during the API call
          console.error("Failed to fetch user applications:", error);
        });
    }
    else{
        getAllAnnouncementsOfInstructor(userID)
        .then((data) => {
          // Update the state with the retrieved user applications
          setInstructorApplications(data);
        })
        .catch((error) => {
          // Handle any errors that occur during the API call
          console.error("Failed to fetch user applications:", error);
        });
    }
  }, [isInstructor, userName, term, userID]);

  useEffect(() => {
    setTabValue(props.tabValue);
  }, [props.tabValue]);

  //console.log(studentApplications[0].post_id);

  const [open, setOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#eeeeee" }}>
            {/* <TableCell align="left">Title</TableCell> */}
            <TableCell>Course Code</TableCell>
            <TableCell align="left">Primary Instructor</TableCell>
            <TableCell align="left">Last Application Date/Time </TableCell>
            <TableCell align="left">Desired Letter Grade</TableCell>
            <TableCell align="left">Work Hours</TableCell>
            <TableCell align="left">Details</TableCell>
            <TableCell align="center">
              {tabValue === 1 && !isInstructor && "Application Status"}
            </TableCell>
          </TableRow>
        </TableHead>
        {isInstructor ? (
          <TableBody>
            {tabValue === 0 &&rows ? ( rows // *************for instructor when tabValue is 0 **********************
              /*.filter((row) =>
                tabValue === 1
                  ? 
                  row.instructor_username === userName 
                  //&& term === row.term 
                  //gelen term ve kontrol edilne term formları farklı olabilir değiştir
                  : term === row.term
              )*/
              .map((row, index) => (
                <TableRow
                  key={index + 1}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.title}
                  </TableCell> */}
                  <TableCell
                    sx={{ borderBottom: "none" }}
                    component="th"
                    scope="row"
                  >
                    {row.course.courseCode}
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                    align="left"
                  >
                    {row.instructor_name}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.lastApplicationDate ? (
                      <>
                        {new Date(row.lastApplicationDate).toLocaleDateString("en-CA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        /{" "}
                        {new Date(row.lastApplicationDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                    align="left"
                  >
                    {row.minimumRequiredGrade}
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                    align="left"
                  >
                    {row.weeklyWorkHours}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.jobDetails}
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                    align="center"
                  >
                    {row.instructor_username === userName && (
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate("/edit-announcement/" + row.applicationId, {
                            replace: true,
                          })
                        }
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))) :
              
              // *************for instructor when tabValue is 1 **********************
              (instructorApplications &&
                instructorApplications.map((instructorApplication, index) => (
                  <TableRow
                    key={index + 1}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
          {row.title}

        </TableCell> */}

                    <TableCell
                      sx={{ borderBottom: "none" }}
                      component="th"
                      scope="row"
                    >
                      {instructorApplication.course.courseCode}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="left"
                    >
                      {instructorApplication.instructor_name}
                    </TableCell>

                    <TableCell sx={{ borderBottom: "none" }} align="left">
                      {instructorApplication.lastApplicationDate ? (
                        <>
                          {new Date(instructorApplication.lastApplicationDate).toLocaleDateString("en-CA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          /{" "}
                          {new Date(instructorApplication.lastApplicationDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="left"
                    >
                      {instructorApplication.minimumRequiredGrade}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="left"
                    >
                      {instructorApplication.weeklyWorkHours}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} align="left">
                      {instructorApplication.jobDetails}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="center"
                    >
                      
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate("/edit-announcement/" + instructorApplication.applicationId, {
                              replace: true,
                            })
                          }
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      
                    </TableCell>
                  </TableRow>
                )))
            }
          </TableBody>
        ) :
        //************************* */
        (
          <TableBody>
            {tabValue === 0 && rows ? ( rows
            // *************for student when tabValue is 0 **********************

              /*.filter((row) =>
                tabValue === 1
                  ? studentApplications.some(
                      (studentApplication) =>
                        row.id === studentApplication.post_id
                    ) && term == row.term
                  : term == row.term
              ) *///to be continued, student'in hangi posta kayıt oldugu lazim (belki vardır)
              .map((row, index) => (
                <TableRow
                  key={index + 1}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.title}
                  </TableCell> */}
                  <TableCell
                    sx={{ borderBottom: "none" }}
                    component="th"
                    scope="row"
                  >
                    {row.course.courseCode}
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                    align="left"
                  >
                    {row.instructor_name}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.lastApplicationDate ? (
                      <>
                        {new Date(row.lastApplicationDate).toLocaleDateString("en-CA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        /{" "}
                        {new Date(row.lastApplicationDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                    align="left"
                  >
                    {row.minimumRequiredGrade}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.weeklyWorkHours}
                  </TableCell>
                  {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", maxLines: 1}} align="left">
                    {row.description}
                  </TableCell> */}
                  <TableCell
                    sx={{
                      bgcolor: "#FAFAFA",
                      borderBottom: "none",
                      maxWidth: "300px",
                    }}
                    align="left"
                  >
                    {row.jobDetails.length > 100 ? (
                      <>
                        {selectedDescription === row.id ? (
                          <Dialog
                            open={open}
                            onClose={() => {
                              setOpen(false);
                              setSelectedDescription("");
                            }}
                            BackdropProps={{
                              onClick: (event) => event.stopPropagation(), // Prevent closing when clicking on backdrop
                            }}
                          >
                            <DialogTitle>Details</DialogTitle>
                            <DialogContent>
                              {row.jobDetails}
                              <IconButton
                                aria-label="close"
                                onClick={() => {
                                  setOpen(false);
                                  setSelectedDescription("");
                                }}
                                sx={{ position: "absolute", top: 8, right: 8 }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <>
                            {row.jobDetails.substr(0, 100)}...
                            <Button
                              onClick={() => {
                                setOpen(true);
                                setSelectedDescription(row.id);
                              }}
                            >
                              Show More
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      row.jobDetails
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="center">
                    {tabValue === 0
                      ? //!studentApplications.find((o) => o.post_id === row.id)
                         new Date(row.lastApplicationDate) > new Date() && (
                            <Button
                              variant="contained"
                              onClick={() =>
                                navigate("/apply/" + row.applicationId, { replace: true })
                              }
                            >
                              Apply
                            </Button>
                          )
                        : new Date(row.lastApplicationDate) > new Date() && (
                            <Tooltip
                              title="Edit your existing application."
                              enterDelay={500}
                              leaveDelay={200}
                            >
                              <Button
                                variant="contained"
                                onClick={() =>
                                  navigate("/edit-apply/" + row.applicationId, {
                                    replace: true,
                                  })
                                }
                                endIcon={<EditIcon />}
                              >
                                Edit
                              </Button>
                            </Tooltip>
                          )
                              }
                              
                              
                  </TableCell>
                </TableRow>
              ))):
              // *************for student when tabValue is 1**************
              (
                studentApplications &&
        
                  studentApplications
                .map((studentApplication, index) => (
                  <TableRow
                    key={index + 1}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
          {row.title}

        </TableCell> */}

                    <TableCell
                      sx={{ borderBottom: "none" }}
                      component="th"
                      scope="row"
                    >
                      {studentApplication.application.course.courseCode}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="left"
                    >
                      {studentApplication.application.instructor_name}
                    </TableCell>

                    <TableCell sx={{ borderBottom: "none" }} align="left">
                      {studentApplication.application.lastApplicationDate ? (
                        <>
                          {new Date(studentApplication.application.lastApplicationDate).toLocaleDateString("en-CA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          /{" "}
                          {new Date(studentApplication.application.lastApplicationDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="left"
                    >
                      {studentApplication.application.minimumRequiredGrade}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} align="left">
                      {studentApplication.application.weeklyWorkHours}
                    </TableCell>
                    {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", maxLines: 1}} align="left">
          {row.description}

        </TableCell> */}

                    <TableCell
                      sx={{
                        bgcolor: "#FAFAFA",
                        borderBottom: "none",
                        maxWidth: "300px",
                      }}
                      align="left"
                    >

                      {studentApplication.application.jobDetails.length > 100 ? (
                        <>

                          {selectedDescription === studentApplication.application.id ? (
                            <Dialog
                              open={open}
                              onClose={() => {
                                setOpen(false);
                                setSelectedDescription("");
                              }}
                              BackdropProps={{
                                onClick: (event) => event.stopPropagation(), // Prevent closing when clicking on backdrop
                              }}
                            >
                              <DialogTitle>Details</DialogTitle>
                              <DialogContent>
                                {studentApplication.application.jobDetails}
                                <IconButton
                                  aria-label="close"
                                  onClick={() => {
                                    setOpen(false);
                                    setSelectedDescription("");
                                  }}
                                  sx={{ position: "absolute", top: 8, right: 8 }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <>
                              {studentApplication.application.jobDetails.substr(0, 100)}...
                              <Button
                                onClick={() => {
                                  setOpen(true);
                                  setSelectedDescription(studentApplication.application.id);
                                }}
                              >
                                Show More
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        studentApplication.application.jobDetails
                      )}
                    </TableCell>

                   

                      

                  <Button
                    variant="contained"
                    key={studentApplication.applicationRequestId}
                    style={{
                      textDecoration: "none",
                      backgroundColor:
                        studentApplication.status === "ACCEPTED"
                          ? "green"
                          : studentApplication.status === "REJECTED"
                          ? "red"
                          : "orange",
                      color: "white",
                      pointerEvents: "none",
                      cursor: "default",
                    }}
                  >
                    {studentApplication.status.toLowerCase() ===
                      "in_progress"
                      ? "In Progress"
                      : studentApplication.status}
                  </Button>
                  </TableRow>
                
              )))}
          </TableBody>
        )}

        

      </Table>
    </TableContainer>
  );
}

export default AnnouncementTable;


