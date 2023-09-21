import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { getAnnouncement, getApplicationsByPost } from "../apiCalls";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import ApplicantsTable from "../components/ApplicantsTable";
import { useParams } from "react-router";

function ApplicantsPage() {
  const [rows, setRows] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const { postId } = useParams();

  useEffect(() => {
    getApplicationsByPost(postId).then((results) => setRows(results));
    getAnnouncement(postId).then((res) => {
      setTitle(res.course_code);
    });
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <AppBarHeader />
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="h4" marginBottom={2} marginRight={1}>
                {title} Applicants
              </Typography>
            </Grid>
            <Grid item>
              <ApplicantsTable rows={rows}></ApplicantsTable>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ApplicantsPage;
