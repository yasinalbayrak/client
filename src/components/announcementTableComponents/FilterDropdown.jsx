import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Fade from '@mui/material/Fade';
import { Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

export default function FilterDropdown({ labels, setLabels, searchCallback, checkLabelCallback, clearCallback }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const [local, setLocal] = useState(null)
    const open = Boolean(anchorEl);


    useEffect(() => {

        setLocal(labels)
    }, [labels])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClear = () => {
        clearCallback()
        searchCallback(local.map(label=>label.name));
        handleClose()
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCheckboxChange = (input_label) => {

        setLocal(prevLabels =>
            prevLabels.map(label =>
                label.name === input_label.name ? { ...label, checked: !label.checked } : label
            )
        );

        //checkLabelCallback(label.name)
    };

    const handleSearchClick = () => {
        const selectedLabels = local.filter(label => label.checked).map(label => label.name)
        console.log('selectedLabels :>> ', selectedLabels);
        searchCallback(selectedLabels);
        setLabels(local)
        handleClose();
    };

    if (!local) {
        return
    }
    console.log('local :>> ', local);
    return (
        <>
            <IconButton
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                
            >
                <FilterAltIcon 
                sx={{
                    fontSize: "18px"
                }}/>
            </IconButton>
            {labels && (
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                        sx: {
                            userSelect: "none",
                            padding: "0.8rem",
                            '& .MuiFormControlLabel-root': {
                                m: 0,
                                height: "fit-content",

                            },
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.3rem',
                            },
                            '& .MuiCheckbox-root': {
                                height: "15px",

                                color: 'grey',
                                '&.Mui-checked': {
                                    color: 'blue',
                                },
                            }
                        }
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    sx={{
                        '& .MuiMenu-paper': {
                            borderRadius: "10px",

                        },

                    }}
                >
                    <FormGroup>
                        {local.map((label) => (
                            <FormControlLabel
                                key={label.id}
                                control={
                                    <Checkbox
                                        checked={label.checked}
                                        onChange={() => handleCheckboxChange(label)}
                                        disableRipple
                                    />
                                }
                                label={label.name}
                            />
                        ))}
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', }}>
                        <Button
                            sx={{ textTransform: "none", marginRight: "1rem" }}
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearchClick}
                        >
                            Search
                        </Button>

                        <Button
                            sx={{ textTransform: "none" }}
                            variant="outlined"
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    </div>
                </Menu>
            )}
        </>
    );
}

