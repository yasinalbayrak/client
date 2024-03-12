import React, { useState, useEffect, useRef } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tooltip from "@mui/material/Tooltip";
import MailIcon from '@mui/icons-material/Mail';
import { useTheme } from '@mui/material/styles';

const InstructorList = ({ instructor_names, authorizedInstructors }) => {
    const theme = useTheme();

    const chipRefs = useRef((instructor_names ?? []).map(() => React.createRef()));
    const [chipHeights, setChipHeights] = useState((instructor_names ?? []).map(() => '2rem'));
    const updateChipHeights = () => {
        const updatedHeights = chipRefs.current.map(ref => {
            return ref.current && ref.current.offsetWidth > 13 * 16 ? '3rem' : '2rem'; // 13rem in pixels
        });
        setChipHeights(updatedHeights);
    };

    useEffect(() => {
        updateChipHeights(); // Initial check
        window.addEventListener('resize', updateChipHeights);

        return () => {
            window.removeEventListener('resize', updateChipHeights);
        };
    }, []);

    const iconStyle = {
        borderRadius: '50%',
        backgroundColor: '#e8e9ed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px',
        marginRight: '-4px',
    };

    return (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
            {instructor_names.map((instructor, index) => (

                <Grid item xs={'auto'} key={instructor}>
                    <Chip
                        ref={chipRefs.current[index]}
                        icon={
                            <Tooltip title={authorizedInstructors?.[index]?.user?.email || ''} placement="top">
                                <div style={{ ...iconStyle, marginLeft: 4,marginRight: -4, padding: 1.5, lineHeight: 'normal' }}>
                                    <a href={`mailto:${authorizedInstructors?.[index]?.user?.email || ''}`}
                                       style={{ display: 'inline-block' }}>
                                        <MailIcon fontSize="small" style={{ color: '#2c457a', padding: 1.1,marginBottom:-1 }}/>
                                    </a>
                                </div>
                            </Tooltip>
                        }
                        label={instructor}
                        variant="elevated"
                        title={instructor}
                        color="primary"
                        clickable={false}
                        style={{
                            fontWeight: 'normal',
                            color: 'whitesmoke',
                            backgroundColor: theme.palette.primary.main,
                            minWidth: '3rem',
                            maxWidth: '13.5rem',
                            height: chipHeights[index],
                        }}
                        sx={{
                            minHeight: chipHeights[index],
                            borderRadius: '25px',
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