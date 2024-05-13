import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { getAnnouncement, getApplicationRequestsByApplicationId } from "../apiCalls";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import ApplicantsTable from "../components/applicantsTableComponents/ApplicantsTable";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import BackButton from "../components/buttons/BackButton";
import ViewSwitch from "../components/applicantsTableComponents/ViewSwitch";
import DataGridView from "../components/excelView/DataGridView";

function ApplicantsPage() {
  const term = useSelector((state) => state.user.term);
  const [rows, setRows] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const { appId } = useParams();
  const [application, setApplication] = React.useState({});
  const [finalize, setFinalize] = React.useState(false);
  const [viewMode, setViewMode] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  }
  useEffect(() => {

    console.log("REREENDERING APPLICANTS PAGE");
    getApplicationRequestsByApplicationId(appId).then((results) => {
      setRows(results.applicationRequests);
      setTitle(results.course.courseCode);
    });

    getAnnouncement(appId).then((result) => {
      setApplication(result);
    }
    );


  }, [finalize, appId, refreshKey]);

  return (
    rows &&<>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <Grid container>
          <BackButton to={"/applicants"} />,
          <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
          </Grid>

          <AppBarHeader />
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item mb={12}>
              <Typography variant="h4" marginBottom={2} marginRight={1}>
                {title} Applicants
              </Typography>
              
            </Grid>
            {
              viewMode === true ?
                <DataGridView 
                applicationRequests={rows}
                setApplicationRequests={setRows}
                courseCode={title}
                appId={appId}
                announcement={application}
                />
                :
                <Grid item>
                  <ApplicantsTable setRows={setRows} rows={rows} courseCode={title} appId={appId} announcement={application} setFinalize={setFinalize} refresh= {() => refresh()}></ApplicantsTable>
                </Grid>
            }


          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ApplicantsPage;
