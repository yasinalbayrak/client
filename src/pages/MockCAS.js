import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import subg from "../assets/subg.jpg";
import sula from "../assets/sula.png";
import sulogo from "../assets/sulogo.png";
import {useMediaQuery} from 'react-responsive';

function MockCAS() {
  const [isLeaving, setIsLeaving] = useState(false);
  const navigate = useNavigate();

  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
  const isonBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isonTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isonPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isonRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  const containerGeneralStyle = {
    height: "100vh",
    background: `url(${subg}) center/cover no-repeat`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: "10vh",
    flexDirection: "column",
    position: "relative",
    transition: "opacity 1s ease-in-out, background-size 0.5s ease-in-out",
    opacity: isLeaving ? 0 : 1,
    backgroundSize: isLeaving ? "220%" : "100%"
  };

  

  const headingGeneralStyle = {
    fontSize: "3rem",
    fontWeight: "700",
    color: "#2E3A4F",
    letterSpacing: "0.1em",
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: "10px",
    position: "absolute",
    top: "2rem",
    userSelect: "none",
    textRendering: "optimizeLegibility",
    transition: "color 0.3s ease-in-out",
    lineHeight: "1.2",
  };

  const headingMobileStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#2E3A4F",
    letterSpacing: "0.1em",
    fontFamily: "'Montserrat', sans-serif",
    marginTop: "1rem",
    marginBottom: "10px",
    position: "absolute",
    top: "2rem",
    userSelect: "none",
    textRendering: "optimizeLegibility",
    transition: "color 0.3s ease-in-out",
    lineHeight: "1.2",
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
    padding: "10px 20px",
    borderRadius: "5px",
    position: "relative",
    bottom: "4.5rem",
    left: "0.5rem",
    userSelect: "none",
    zIndex: 1,
  };

  const logoStyleLeft = {
    width: "100px",
    height: "auto",
    zIndex: 2,
    position: "relative",
    bottom: "5rem",
    left: "0.5rem",
  };

  const logoStyleRight = {
    position: "absolute",
    top: "0rem",
    right: "0rem",
    width: "100px",
    height: "auto",
    zIndex: 2,
  };

  const titlePart1 = "Sabancı University";
  const titlePart2 = "Central Learning Assistantship System";

  const handleLoginClick = () => {
    setIsLeaving(true);
    setTimeout(() => {
      navigate("/home");
    }, 500); 
  };

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@500&display=swap"
        />
      </Helmet>
      <div style={containerGeneralStyle}>
        <Typography variant="h1" style={isDesktopOrLaptop? headingGeneralStyle:headingMobileStyle}>
          <div style={{ display: "block" }}>
            <div style={{ whiteSpace: "nowrap" }}>{titlePart1}</div>
            <div>{titlePart2}</div>
          </div>
        </Typography>
        <img src={sulogo} alt="Logo Right" style={logoStyleRight} />
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item>
            <img src={sula} alt="Logo Left" style={logoStyleLeft} />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleLoginClick} style={buttonStyle}>
              Login
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default MockCAS;
