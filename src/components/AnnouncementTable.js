import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getApplicationByUsername } from "../apiCalls";
import { Tooltip } from "@mui/material";

function AnnouncementTable(props) {
  // const rows = [
  //     { id: 1, course_code: 'CS201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B+', wHour: "5", details: "lorem ipsum"},
  //     { id: 2, course_code: 'CS210', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "5", details: "lorem ipsum"},
  //     { id: 3, course_code: 'MATH201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A-', wHour: "5", details: "lorem ipsum"},
  //     { id: 4, course_code: 'CS300', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "5", details: "lorem ipsum"},
  //     { id: 5, course_code: 'MATH204', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "10", details: "lorem ipsum" },
  //     { id: 6, course_code: 'ENS206', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B+', wHour: "10", details: "lorem ipsum"},
  //     { id: 7, course_code: 'ECON201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B', wHour: "5", details: "lorem ipsum"},
  //     { id: 8, course_code: 'CS301', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'A', wHour: "10", details: "lorem ipsum"},
  //     { id: 9, course_code: 'HUM201', instructors: 'John Doe', lDate: 'dd/mm/yyyy', grade: 'B+', wHour: "5", details: "lorem ipsum"},
  //   ];
  const [rows, setRows] = useState([]);
  const [studentApplications, setStudentApplications] = useState([]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(props.tabValue);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const term = useSelector((state) => state.user.term);
  //const userDisplayName = useSelector((state) => state.user.name);
  //const userDisplayName = "Instructor One" //mock data
  const userName = useSelector((state) => state.user.username);
  //const userName = "instructor1"; //mock data for instructor
  // const userName = "muratk"; //mock data for student

  useEffect(() => {
    const modifiedRows = props.rows.map((row) => {
      // Split the instructor_name string by comma
      const [lastName, firstName] = row.instructor_name.split(",");

      // Rearrange the name format
      const modifiedInstructorName = firstName.trim() + " " + lastName.trim();
      var newTerm = row.term;
      if (row.term == "Fall 2022") {
        newTerm = "Fall 2022/23";
      }

      // Return the modified row object
      return {
        ...row,
        instructor_name: modifiedInstructorName,
        term: newTerm,
      };
    });
    console.log(modifiedRows);
    setRows(modifiedRows);
    //console.log(rows);
  }, [props.rows, term]);

  useEffect(() => {
    if (!isInstructor) {
      getApplicationByUsername(userName)
        .then((data) => {
          // Update the state with the retrieved user applications
          setStudentApplications(data);
        })
        .catch((error) => {
          // Handle any errors that occur during the API call
          console.error("Failed to fetch user applications:", error);
        });
    }
  }, [isInstructor, userName, term]);

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
            <TableCell align="center">{tabValue === 1 && !isInstructor && "Application Status"}</TableCell>
          </TableRow>
        </TableHead>
        {isInstructor ? (
          <TableBody>
            {rows
              .filter((row) => (tabValue === 1 ? (row.instructor_username === userName && term == row.term) : term == row.term))
              .map((row, index) => (
                <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.title}
                  </TableCell> */}
                  <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
                    {row.course_code}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.instructor_name}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.deadline ? (
                      <>
                        {new Date(row.deadline).toLocaleDateString("en-CA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        /{" "}
                        {new Date(row.deadline).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.mingrade}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.working_hour}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.description}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="center">
                    {row.instructor_username === userName && (
                      <Button
                        variant="contained"
                        onClick={() => navigate("/edit-announcement/" + row.id, { replace: true })}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        ) : (
          <TableBody>
            {rows
              .filter((row) =>
                (tabValue === 1)
                  ? (studentApplications.some((studentApplication) => row.id === studentApplication.post_id) && term == row.term)
                  : term == row.term
              ) //to be continued, student'in hangi posta kayıt oldugu lazim (belki vardır)
              .map((row, index) => (
                <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.title}
                  </TableCell> */}
                  <TableCell sx={{ borderBottom: "none" }} component="th" scope="row">
                    {row.course_code}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.instructor_name}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.deadline ? (
                      <>
                        {new Date(row.deadline).toLocaleDateString("en-CA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        /{" "}
                        {new Date(row.deadline).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="left">
                    {row.mingrade}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="left">
                    {row.working_hour}
                  </TableCell>
                  {/* <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", maxLines: 1}} align="left">
                    {row.description}
                  </TableCell> */}
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none", maxWidth: "300px" }} align="left">
                    {row.description.length > 100 ? (
                      <>
                        {selectedDescription === row.id ? (
                          <Dialog
                            open={open}
                            onClose={() => {
                              setOpen(false);
                              setSelectedDescription("");
                            }}
                            BackdropProps={{
                              onClick: (event) => event.stopPropagation() // Prevent closing when clicking on backdrop
                            }}
                          >
                            <DialogTitle>Details</DialogTitle>
                            <DialogContent>
                              {row.description}
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
                            {row.description.substr(0, 100)}...
                            <Button onClick={() => {
                              setOpen(true);
                              setSelectedDescription(row.id);
                            }}>Show More</Button>
                          </>
                        )}
                      </>
                    ) : (
                      row.description
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="center">
                    {tabValue === 0 ? (
                      !studentApplications.find((o) => o.post_id === row.id) ? new Date(row.deadline) > new Date() && (
                        <Button variant="contained" onClick={() => navigate("/apply/" + row.id, { replace: true })}>
                          Apply
                        </Button>
                      ) : (
                        new Date(row.deadline) > new Date() && (
                          <Tooltip title="Edit your existing application." enterDelay={500} leaveDelay={200}>
                            <Button
                              variant="contained"
                              onClick={() => navigate("/edit-apply/" + row.id, { replace: true })}
                              endIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                        )
                      )
                    ) : (
                      studentApplications
                        .filter((studentApplication) => row.id === studentApplication.post_id)
                        .map((studentApplication) => (
                          <Button
                            variant="contained"
                            key={studentApplication.id}
                            style={{
                              textDecoration: "none",
                              backgroundColor:
                                studentApplication.status === "Accepted"
                                  ? "green"
                                  : studentApplication.status === "Rejected"
                                    ? "red"
                                    : "orange",
                              color: "white",
                              pointerEvents: "none",
                              cursor: "default",
                            }}
                          >
                            {studentApplication.status.toLowerCase() === "applied" ||
                              studentApplication.status.toLowerCase() === "interested"
                              ? "In Progress"
                              : studentApplication.status}
                          </Button>
                        ))
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

export default AnnouncementTable;
