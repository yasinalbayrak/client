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
import {
  getAllAnnouncementsOfInstructor,
  getApplicationByUsername,
  getApplicationRequestsByStudentId,
} from "../apiCalls";
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
  const userName = useSelector(
    (state) => state.user.name + " " + state.user.surname
  );
  const userID = useSelector((state) => state.user.id);
  const [instructorApplications, setInstructorApplications] = useState([]);
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    const modifiedRows = props.rows.map((row) => {
      //Split the instructor_name string by comma
      console.log(row);
      const [lastName, firstName] = [
        row.authorizedInstructors[0] == null
          ? ""
          : row.authorizedInstructors[0].user.surname,
        row.authorizedInstructors[0] == null
          ? "no instructor assigned yet"
          : row.authorizedInstructors[0].user.name,
      ];
      const formattedFirstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const formattedLastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1);
      // Rearrange the name format
      const modifiedInstructorName =
        formattedFirstName.trim() + " " + formattedLastName.trim();

      const workTime = row.weeklyWorkHours;
      const slicedHour = workTime.slice(2);
      const modifiedWorkHour = slicedHour.slice(0, -1);

      const notSpacedCourse= row.course.courseCode;
      const spacedCourse= notSpacedCourse.replace(/([A-Z]+)(\d+)/g, '$1 $2');


      // Return the modified row object
      return {
        ...row,
        weeklyWorkingTime: modifiedWorkHour,
        instructor_name: modifiedInstructorName,
        modifiedCourseCode:spacedCourse,
      };
    });
    console.log(modifiedRows);
    setRows(modifiedRows);
    //console.log(rows);
  }, [props.rows]);

  useEffect(() => {
    console.log("\n\n\n\nENTERED\n\n\n\n");

    async function fetchData() {
      var userApps = null;
      try {
        if (!isInstructor) {
          const data = await getApplicationRequestsByStudentId(userID);
          setStudentApplications(data);
          userApps = data;
        } else {
          const data = await getAllAnnouncementsOfInstructor(userID);
          console.log("DEBU4444\n\n\n\n:");
          console.log(data);
          setInstructorApplications(data);
          userApps = data;
        }
        console.log("DEBU222222\n\n\n\n:");
        console.log(userApps);
      } catch (error) {
        console.error("Failed to fetch user applications:", error);
      }
      const userAppModify = userApps?.map((userApplication) => {
        const workTime = userApplication.weeklyWorkHours;
        const slicedHour = workTime.slice(2);
        const modifiedWorkHour = slicedHour.slice(0, -1);
        console.log(modifiedWorkHour); //buraya doğru döndü
        const [lastName, firstName] = [
          userApplication.authorizedInstructors[0] == null
            ? ""
            : userApplication.authorizedInstructors[0].user.surname,
            userApplication.authorizedInstructors[0] == null
            ? "no instructor assigned yet"
            : userApplication.authorizedInstructors[0].user.name,
        ];
        const formattedFirstName =
          firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const formattedLastName =
          lastName.charAt(0).toUpperCase() + lastName.slice(1);
        // Rearrange the name format
        const modifiedInstructorName =
          formattedFirstName.trim() + " " + formattedLastName.trim();

        const notSpacedCourse= userApplication.course.courseCode;
        const spacedCourse= notSpacedCourse.replace(/([A-Z]+)(\d+)/g, '$1 $2');


        if (isInstructor) {
          return {
            ...userApplication,
            weeklyWorkingTime: modifiedWorkHour,
            instructor_name: modifiedInstructorName,
            modifiedCourseCode:spacedCourse,
          };
        } else {
          return {
            ...userApplication,
            weeklyWorkingTime: modifiedWorkHour,
            instructor_name: modifiedInstructorName,
            modifiedCourseCode:spacedCourse,
          };
        }
      });
      console.log("DEBUGGGG\n\n\n\n:");
      console.log(userAppModify);
      setUserApplications(userAppModify);
    }

    fetchData();
  }, [isInstructor, userName, term, userID, tabValue]);

  useEffect(() => {
    setTabValue(props.tabValue);
  }, [props.tabValue]);

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
            <TableCell align="left">Minimum Desired Letter Grade</TableCell>
            <TableCell align="left">Work Hours</TableCell>
            <TableCell align="left">Details</TableCell>
            <TableCell align="center">
              {tabValue === 1 && !isInstructor && "Application Status"}
            </TableCell>
          </TableRow>
        </TableHead>
        {isInstructor ? (
          <TableBody>
            {
              // *************for instructor when tabValue is 0 **********************
              tabValue === 0 && rows
                ? rows.map((row, index) => (
                    <TableRow
                      key={index + 1}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* { <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.title}
                  </TableCell>} */}
                      <TableCell
                        sx={{ borderBottom: "none" }}
                        component="th"
                        scope="row"
                      >
                        {row.modifiedCourseCode}
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
                            {new Date(
                              row.lastApplicationDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}{" "}
                            /{" "}
                            {new Date(
                              row.lastApplicationDate
                            ).toLocaleTimeString([], {
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
                        {row.weeklyWorkingTime}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }} align="left">
                        {row.jobDetails}
                      </TableCell>
                      <TableCell
                        sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                        align="center"
                      >
                        {row.instructor_name !==
                          "no instructor assigned yet " &&
                          row.instructor_name.toLowerCase() ===
                            userName.toLowerCase() && (
                            <Button
                              variant="contained"
                              onClick={() =>
                                navigate(
                                  "/edit-announcement/" + row.applicationId,
                                  {
                                    replace: true,
                                  }
                                )
                              }
                              startIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  ))
                : // *************for instructor when tabValue is 1 **********************
                  userApplications &&
                  userApplications.map((userApplication, index) => (
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
                        {userApplication.modifiedCourseCode}
                      </TableCell>
                      <TableCell
                        sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                        align="left"
                      >
                        {userApplication?.instructor_name}
                      </TableCell>

                      <TableCell sx={{ borderBottom: "none" }} align="left">
                        {userApplication?.lastApplicationDate ? (
                          <>
                            {new Date(
                              userApplication.lastApplicationDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}{" "}
                            /{" "}
                            {new Date(
                              userApplication.lastApplicationDate
                            ).toLocaleTimeString([], {
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
                        {userApplication.minimumRequiredGrade}
                      </TableCell>
                      <TableCell
                        sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                        align="left"
                      >
                        {userApplication.weeklyWorkingTime}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }} align="left">
                        {userApplication.jobDetails}
                      </TableCell>
                      <TableCell
                        sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                        align="center"
                      >
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(
                              "/edit-announcement/" +
                                userApplication.applicationId,
                              {
                                replace: true,
                              }
                            )
                          }
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
            }
          </TableBody>
        ) : (
          //************************* */
          <TableBody>
            {tabValue === 0 && rows
              ? rows
                  // *************for student when tabValue is 0 **********************

                  /*.filter((row) =>
                tabValue === 1
                  ? studentApplications.some(
                      (studentApplication) =>
                        row.id === studentApplication.post_id
                    ) && term == row.term
                  : term == row.term
              ) */ //to be continued, student'in hangi posta kayıt oldugu lazim (belki vardır)
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
                        {row.modifiedCourseCode}
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
                            {new Date(
                              row.lastApplicationDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}{" "}
                            /{" "}
                            {new Date(
                              row.lastApplicationDate
                            ).toLocaleTimeString([], {
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
                        {row.weeklyWorkingTime}
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
                                    sx={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                    }}
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
                                  navigate("/apply/" + row.applicationId, {
                                    replace: true,
                                  })
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
                                    navigate(
                                      "/edit-apply/" + row.applicationId,
                                      {
                                        replace: true,
                                      }
                                    )
                                  }
                                  endIcon={<EditIcon />}
                                >
                                  Edit
                                </Button>
                              </Tooltip>
                            )}
                      </TableCell>
                    </TableRow>
                  ))
              : // *************for student when tabValue is 1**************
                studentApplications &&
                userApplications.map((userApplication, index) => (
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
                      {userApplication?.application.modifiedCourseCode}
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }}
                      align="left"
                    >
                      {userApplication?.application.instructor_name}
                    </TableCell>

                    <TableCell sx={{ borderBottom: "none" }} align="left">
                      {userApplication?.application.lastApplicationDate ? (
                        <>
                          {new Date(
                            userApplication?.application.lastApplicationDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          /{" "}
                          {new Date(
                            userApplication?.application.lastApplicationDate
                          ).toLocaleTimeString([], {
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
                      {userApplication?.application.minimumRequiredGrade}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} align="left">
                      {userApplication?.application.weeklyWorkingTime}
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
                      {userApplication?.application.jobDetails.length > 100 ? (
                        <>
                          {selectedDescription ===
                          userApplication?.application.id ? (
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
                                {userApplication?.application.jobDetails}
                                <IconButton
                                  aria-label="close"
                                  onClick={() => {
                                    setOpen(false);
                                    setSelectedDescription("");
                                  }}
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <>
                              {userApplication?.application.jobDetails.substr(
                                0,
                                100
                              )}
                              ...
                              <Button
                                onClick={() => {
                                  setOpen(true);
                                  setSelectedDescription(
                                    userApplication?.application.id
                                  );
                                }}
                              >
                                Show More
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        userApplication?.application.jobDetails
                      )}
                    </TableCell>

                    <Button
                      variant="contained"
                      key={userApplication?.applicationRequestId}
                      style={{
                        textDecoration: "none",
                        backgroundColor:
                          userApplication?.status === "ACCEPTED"
                            ? "green"
                            : userApplication?.status === "REJECTED"
                            ? "red"
                            : "orange",
                        color: "white",
                        pointerEvents: "none",
                        cursor: "default",
                      }}
                    >
                      {userApplication?.status.toLowerCase() === "in_progress"
                        ? "In Progress"
                        : userApplication?.status}
                    </Button>
                  </TableRow>
                ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

export default AnnouncementTable;
