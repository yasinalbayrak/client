import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { startLoginProcess, successLogin } from "./../redux/userSlice";

function LoginCAS() {
    const url = window.location.href;
    const encodedURL = encodeURIComponent(url);
    const casLoginBaseURL = "https://login.sabanciuniv.edu/cas/login?service=";
    const casLoginURL = casLoginBaseURL + encodedURL;
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const isLoading = useSelector((state) => state.user.isLoading);
    var error_text = ""
    const dispatch = useDispatch();

    useEffect(() => {
      if (!isLoggedIn && !isLoading) {
        if (url.indexOf("?ticket=") != -1 || url.indexOf("&ticket=") != -1) {
          error_text = "error";
        } else {
          dispatch(startLoginProcess());
          window.location.replace(casLoginURL);
        }
      }
    }, [])
    

  return (
    <>
    <Typography>{error_text}</Typography>
    </>
  )
}

export default LoginCAS