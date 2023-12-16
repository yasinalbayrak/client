import React from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";

const InstructorList = ({ instructor_names }) => {
 
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 0, md: 1 }}>
      {instructor_names.map((instructor) => (
        <Grid item xs={instructor_names.length==1? 12: 6} sm={6} key={instructor}>
            <Chip
                label={instructor}
                variant="outlined"
                title={instructor}
                color="primary"
                clickable={true}
                style={{ backgroundColor: '#F4CE14',fontWeight: 'normal', color: 'black'
             }}
                sx={{
                    minHeight: '3rem',
                    width:'6rem',
                    minWidth: '6rem',
                    height: 'auto',
                    '& .MuiChip-label': {
                      display: 'block',
                      whiteSpace: 'normal',
                    },
                  }}
            />
        </Grid>
      ))}
    </Grid>
  );
};

export default InstructorList;
