import "./App.css";
import MockCAS from "./pages/MockCAS";
import { Routes, Route, useSearchParams, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import EditAnnouncement from "./pages/EditAnnouncement";
import ApplyPage from "./pages/ApplyPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import { useDispatch, useSelector } from "react-redux";
import LoginCAS from "./pages/LoginCAS";
import { useEffect } from "react";
import { startLoginProcess, successLogin } from "./redux/userSlice";
import { validateLogin } from "./apiCalls";
import CourseApplicantsPage from "./pages/CourseApplicantsPage";
import EditApplyPage from "./pages/EditApplyPage";
import SuccessPage from "./pages/SuccessPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TranscriptPage from "./components/transcriptPageComponents/transcriptPage";
function App() {
  const [urlParams, setUrlParams] = useSearchParams();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isTranscriptUploded = useSelector((state) => state.user.isTranscriptUploded);
  const isInstructor = useSelector((state) => state.user.isInstructor);
  const dispatch = useDispatch();
  const url = window.location.href;
  let path = window.location.href.split("?")[0];

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      if (url.indexOf("?ticket=") !== -1 || url.indexOf("&ticket=") !== -1) {
        dispatch(startLoginProcess());
        // parse and get the ticket
        const ticket = urlParams.get("ticket");
        console.log("ticket: " + ticket);

        // Extract the base URL without query parameters
        const baseUrl = url.split("?")[0];
        console.log("serviceUrl: ", baseUrl);

        // send it to backend
        validateLogin(baseUrl, ticket).then((result) => {
          console.log(result);
          dispatch(
            successLogin({
              id: result.user.id,
              jwtToken: result.token,
              username: result.user.email,
              name: result.user.name,
              surname: result.user.surname,
              isInstructor: result.user.role == "INSTRUCTOR",
              //isInstructor: result.user.role == "INSTRUCTOR",
              //isInstructor: true, // TODO development purposes... 
              //isInstructor: false // TODO development purposes...

              //result.user.graduationType === "academic",
            })
          );
        });

        // dispatch(successLogin({username: "aa", name: "bb", surname: "cc"}));
        // check the response
        // if result is positive, dispatch loginSuccess and refresh, otherwise dispatch loginFail or logout
        urlParams.delete("ticket");
        setUrlParams(urlParams);

        // window.location.reload();
      }
    }
  }, []);


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {isLoggedIn ? (
          isTranscriptUploded||isInstructor?
          
          <>
            <Route exact path="/" element={<MockCAS></MockCAS>}></Route>
            <Route path="/home" element={<HomePage></HomePage>}></Route>
            <Route path="/create-announcement" element={<CreateAnnouncement></CreateAnnouncement>}></Route>
            <Route path="/edit-announcement/:id" element={<EditAnnouncement></EditAnnouncement>}></Route>
            <Route path="/apply/:id" element={<ApplyPage></ApplyPage>}></Route>
            <Route path="/edit-apply/:id" element={<EditApplyPage></EditApplyPage>}></Route>
            <Route path="/applicants" element={<CourseApplicantsPage></CourseApplicantsPage>}></Route>
            <Route path="/application-of/:postId" element={<ApplicantsPage></ApplicantsPage>}></Route>
            <Route path="/success" element={<SuccessPage></SuccessPage>}></Route>
            <Route path="/transcriptpage" element={<TranscriptPage></TranscriptPage>}></Route>

          </>
          :
          <>
            <Route exact path="/transcriptpage" element={<TranscriptPage></TranscriptPage>}></Route>
            <Route path="*" element={<Navigate to="/transcriptpage" />}></Route>
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
