import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const useStyles = makeStyles((_) => ({
  backButton: {
    position: 'relative',
    top: '3rem',
  },
}));

function BackButton({ to }) {
  const classes = useStyles();

  return (
    <>
      <Link to={to}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          color="primary"
          className={classes.backButton}
        >
          Back
        </Button>
      </Link>
    </>
  );
}

export default BackButton;
