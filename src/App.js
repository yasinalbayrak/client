import "./App.css";
import MockCAS from "./pages/MockCAS";
import { Routes, Route, useSearchParams } from "react-router-dom";
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

function App() {
  const [urlParams, setUrlParams] = useSearchParams();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const url = window.location.href;
  let path = window.location.href.split("?")[0];

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      if (url.indexOf("?ticket=") !== -1 || url.indexOf("&ticket=") !== -1) {
        dispatch(startLoginProcess());
        // parse and get the ticket
        const ticket = urlParams.get("ticket");
        console.log(ticket);
        console.log("serviceUrl: ", encodeURIComponent(path));
        // send it to backend
        validateLogin(encodeURIComponent(path), ticket).then((result) => {
          console.log(result);
          dispatch(
            successLogin({
              jwtToken: result.JWT_TOKEN,
              username: result.authenticationSuccess.attributes.cn,
              name: result.authenticationSuccess.attributes.givenName,
              surname: result.authenticationSuccess.attributes.sn,
              isInstructor: result.authenticationSuccess.attributes.ou[1] === "academic", //result.authenticationSuccess.attributes.ou[1] == "academic"
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
    <Routes>
      {isLoggedIn ? (
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
        </>
      ) : (
        <>
          <Route exact path="/" element={<MockCAS></MockCAS>}></Route>
          <Route path="*" element={<LoginCAS></LoginCAS>}></Route>
        </>
      )}
    </Routes>
  );
}

export default App;
