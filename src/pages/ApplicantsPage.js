import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { getAnnouncement, getApplicationRequestsByApplicationId } from "../apiCalls";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import ApplicantsTable from "../components/ApplicantsTable";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

function ApplicantsPage() {
  const term = useSelector((state) => state.user.term);
  const [rows, setRows] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const { appId } = useParams();

  useEffect(() => {
    
    getApplicationRequestsByApplicationId(appId).then((results) =>{ 
      setRows(results.applicationRequests);
      setTitle(results.course.courseCode);
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
                {title} Applicants for term {term.term_desc}
              </Typography>
            </Grid>
            <Grid item>
              <ApplicantsTable rows={rows} courseCode={title}></ApplicantsTable>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ApplicantsPage;
