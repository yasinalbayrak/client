import React, { useEffect, useState } from "react";
import CourseApplicantsTable from "../components/CourseApplicantsTable";
import AppBarHeader from "../components/AppBarHeader";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { getAllAnnouncements } from "../apiCalls";
import { useSelector } from "react-redux";

function CourseApplicantsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const userName = useSelector((state) => state.user.username);

  useEffect(() => {
    getAllAnnouncements().then((res) => {
      setAnnouncements(res);
    });
    console.log(announcements);
  }, []);

  useEffect(() => {
    const temp = announcements.filter((element) => element.instructor_username === userName);
    setCourses(temp);
  }, [announcements]);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <AppBarHeader />
          <CourseApplicantsTable rows={courses}></CourseApplicantsTable>
        </Box>
      </Box>
    </>
  );
}

export default CourseApplicantsPage;
