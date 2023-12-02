import React from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';

const InstructorList = ({ instructor_names }) => {
 
  return (
    <Grid container spacing={1}>
      {instructor_names.map((instructor) => (
        <Grid item xs={6} key={instructor}>
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
