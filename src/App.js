import "./App.css";
import MockCAS from "./pages/MockCAS";
import { Routes, Route, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import EditAnnouncement from "./pages/EditAnnouncement";
import ApplyPage from "./pages/ApplyPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import { useDispatch, useSelector } from "react-redux";
import LoginCAS from "./pages/LoginCAS";
import { useEffect, useState } from "react";
import { startLoginProcess, successLogin, logout, failLogin } from "./redux/userSlice";
import { validateLogin } from "./apiCalls";
import CourseApplicantsPage from "./pages/CourseApplicantsPage";
import EditApplyPage from "./pages/EditApplyPage";
import SuccessPage from "./pages/SuccessPage";
import ProfilePage from "./pages/ProfilePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import handleError, { handleServerDownError } from "./errors/GlobalErrorHandler";

import TranscriptPage from "./components/transcriptPageComponents/transcriptUploadPage";
import TranscriptInfo from "./components/transcriptPageComponents/transcriptInfoPage";
import QuestionPage from "./components/transcriptPageComponents/transcriptExtraFile";
import EditQuestionPage from "./components/transcriptPageComponents/EditQuestionPage";
import EligibilityPage from "./pages/EligibilityPage";
function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isTranscriptUploded = useSelector((state) => state.user.isTranscriptUploded);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const dispatch = useDispatch();
  const url = window.location.href;
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      if (url.includes("?ticket=")) {
        dispatch(startLoginProcess());

        const ticket = urlParams.get("ticket");
        const baseUrl = url.split("?")[0];

        validateLogin(baseUrl, ticket)
          .then((result) => {
            dispatch(
              successLogin({
                id: result.user.id,
                jwtToken: result.token,
                username: result.user.email,
                name: result.user.name,
                surname: result.user.surname,
                isInstructor: result.user.role === "INSTRUCTOR",
              })
            );

            urlParams.delete("ticket");
            const newPath = location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
            navigate(newPath, { replace: true });
          })
          .catch(() => {
            dispatch(failLogin())
            navigate("/")
            handleServerDownError();
          });
      }
    }
  }, [isLoggedIn, isLoading, dispatch, navigate, location.pathname, urlParams]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-announcement" element={<CreateAnnouncement />} />
            <Route path="/edit-announcement/:id" element={<EditAnnouncement />} />
            <Route path="/apply/:id" element={<ApplyPage />} />
            <Route path="/edit-apply/:id" element={<EditApplyPage />} />
            <Route path="/applicants" element={<CourseApplicantsPage />} />
            <Route path="/application-of/:appId" element={<ApplicantsPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/edit-questionPage/:id" element={<EditQuestionPage/>}/>
            <Route path="*" element={<MockCAS />} />
              <Route path="/transcriptUploadPage/:id" element={<TranscriptPage></TranscriptPage>}></Route>
              <Route path="transcriptInfoPage/:id" element={<TranscriptInfo></TranscriptInfo>}></Route>
              <Route path="/questionPage/:id" element={<QuestionPage></QuestionPage>}></Route>
              <Route path="/eligibilityPage/:id" element={<EligibilityPage></EligibilityPage>}></Route>


          </>
        ) : (
          <>
            <Route exact path="/" element={<MockCAS></MockCAS>}></Route>
            <Route path="*" element={<LoginCAS></LoginCAS>}></Route>
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
