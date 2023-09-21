import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";

function CourseApplicantsTable(props) {
  const navigate = useNavigate();
  const term = useSelector((state) => state.user.term);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#eeeeee" }}>
              <TableCell align="center">Course Code</TableCell>
              <TableCell align="center">Term</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows &&
              props.rows.filter((row) => (row.term == term)).map((row, index) => (
                <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="center">
                    {row.course_code}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="center">
                    {row.term}
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#FAFAFA", borderBottom: "none" }} align="center">
                    {row.deadline}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} align="center">
                    <Button
                      variant="contained"
                      onClick={() => navigate("/application-of/" + row.id, { replace: true })}
                      endIcon={<ChevronRightIcon />}
                    >
                      Check Applicants
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CourseApplicantsTable;
