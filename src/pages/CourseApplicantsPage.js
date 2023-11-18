import React, { useEffect, useState } from "react";
import CourseApplicantsTable from "../components/CourseApplicantsTable";
import AppBarHeader from "../components/AppBarHeader";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { getAllAnnouncementsOfInstructor } from "../apiCalls";
import { useSelector } from "react-redux";

function CourseApplicantsPage() {
  const [announcements, setAnnouncements] = useState([]);
  
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    console.log("User id = " + userId);
    getAllAnnouncementsOfInstructor(userId).then((res) => {
      setAnnouncements(res);
    }).catch(_=>{
      // Already catched.
    });
    console.log(announcements);
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <AppBarHeader />
          <CourseApplicantsTable rows={announcements}></CourseApplicantsTable>
        </Box>
      </Box>
    </>
  );
}

export default CourseApplicantsPage;
