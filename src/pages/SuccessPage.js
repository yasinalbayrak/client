import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar';
import AppBarHeader from '../components/AppBarHeader';

function SuccessPage() {
    const location = useLocation();
    const { successText } = location.state ? location.state : { successText: "Your action is successful."};
    const navigate = useNavigate();

    useEffect(() => {
      const timer = setTimeout(() => {
        navigate("/home", { replace: true });
      }, 5000);

      return () => {
        clearTimeout(timer);
      }
    }, [])
    

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box textAlign="center" component="main" sx={{ flexGrow: 1, p: 5 }}>
        <AppBarHeader />
        <Box width={500} sx={{ backgroundColor: "#45b81f", justifyContent: "center", p: "15px", textAlign: "center", marginBottom: "30px" }} marginX="auto">
            <Typography p="15px" variant='h5'>{successText}</Typography>
        </Box>
            <Typography>You will be redirected to Home Page in 5 seconds ...</Typography>
            <Button variant='outlined' sx={{ m: "10px" }} onClick={() => {
                navigate("/home", { replace: true });
            }}>Return Now</Button>
      </Box>
    </Box>
  )
}

export default SuccessPage