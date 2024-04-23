import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import FilterRow from './FilterRow';
import { LOGIC_OPS, SELECT_OPERATORS, STR_OPERATORS } from '../../constants/appConstants';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Badge, Box, IconButton, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect } from 'react';
export function CustomFilterPanel(props) {
  const initialFilters = React.useMemo(() => [
    {
      id: 0,
      logicOpAllowed: false,
      logicOp: LOGIC_OPS[0],
      column: props.columns[2],
      operator: STR_OPERATORS[0],
      filterValue: "",
    },
  ], [props.columns]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filters, setFilters] = React.useState(initialFilters);
  const [filterCount, setFilterCount] =  React.useState(0);
  useEffect(() => { console.log('filters :>> ', filters); }, [filters])
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setFilterCount(0);
  }
  const onRemoveFilter = (id) => {
    setFilters(currentFilters => {
      const newFilters = currentFilters.filter(f => f.id !== id);
      if (newFilters.length > 0) {
        newFilters[0].logicOpAllowed = false;
      }
      return newFilters;
    });

    if (filters.length <= 1) {
      handleClose();
      setFilters(initialFilters);
    }
    
  };
  const handleAddFilter = () => {
    const addedFilter = { ...initialFilters[0] };
    addedFilter.logicOpAllowed = true;
    addedFilter.id = (filters[filters.length - 1].id) + 1
    addedFilter.logicOp = filters.length === 1 ? "And" : (filters[filters.length - 1].logicOp)
    setFilters((_) => [...filters, addedFilter]);
  }

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={filterCount} color="primary" sx={{mr:1.5}}>
          <FilterListIcon></FilterListIcon>
        </Badge>

        Filters
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        sx={{
          userSelect: "none"
        }}

      >
        {filters.map((f) => (
          <MenuItem
            disableRipple
            disableTouchRipple

            sx={{
              pl: 1,
              backgroundColor: 'white !important',
              '&:hover': {
                backgroundColor: '#fff !important',
              },
              '&.css-1ip6yz4-MuiButtonBase-root-MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: '#fff !important',
                },
              },
              '.css-1ip6yz4-MuiButtonBase-root-MuiMenuItem-root.Mui-focusVisible': {
                backgroundColor: '#fff !important',
              }
            }}
          >
            <FilterRow setFilterCount={setFilterCount}  setRows={props.setRows} allRows={props.allRows} onRemove={() => onRemoveFilter(f.id)} columns={props.columns} allFilters={filters} setFilters={setFilters} filter={f}> </FilterRow>
          </MenuItem>
        ))}
        <MenuItem
          disableRipple
          disableTouchRipple

          sx={{
            pl: 1,
            backgroundColor: 'white !important',
            '&:hover': {
              backgroundColor: '#fff !important',
            },
            '&.css-1ip6yz4-MuiButtonBase-root-MuiMenuItem-root': {
              '&:hover': {
                backgroundColor: '#fff !important',
              },
            },
            '.css-1ip6yz4-MuiButtonBase-root-MuiMenuItem-root.Mui-focusVisible': {
              backgroundColor: '#fff !important',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={handleAddFilter} color="primary" aria-label="add filter" startIcon={<AddIcon sx={{ color: "#1e88e5" }} />}>

                <Typography variant="body2" color="#1e88e5">ADD FILTER</Typography>
              </Button>

            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={handleClear} color="primary" aria-label="add filter" startIcon={<DeleteForeverIcon sx={{
                color: "#1e88e5"
              }} />}>

                <Typography variant="body2" color="#1e88e5">REMOVE ALL</Typography>
              </Button>
            </Box>
          </Box>
        </MenuItem>



      </Menu>
    </div>
  );
}
