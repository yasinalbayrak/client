import React, { useState } from 'react';
import { IconButton, Select, MenuItem, InputLabel, FormControl, Input, Chip, OutlinedInput, Autocomplete, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { LOGIC_OPS, NUMERIC_OPERATORS, SELECT_OPERATORS, STR_OPERATORS } from '../../constants/appConstants';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: '#4A90E2',
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                underline: {
                    '&:after': {

                        borderBottomColor: '#4A90E2',
                    },
                },
            },
        },
    },
});

export default function FilterRow({ columns, onRemove, allFilters, setFilters, filter, setFilterCount, setRows, allRows }) {

    React.useEffect(() => {

        const newCount = allFilters.filter(f => typeof f.filterValue === 'string' ? f.filterValue !== "" : f.filterValue.length > 0).length;
        setFilterCount(newCount);
        let filteredIndices = {};


        allFilters.forEach((f, idx) => {
            if (typeof f.filterValue === 'string' ? f.filterValue !== "" : f.filterValue.length > 0) {
                let currentFilterIndices = new Set();

                allRows.forEach((r, rowIdx) => {
                    const fieldValue = r[f.column.field];
                    let pass = false;
                    console.log('f.column.field :>> ', f.column.field);
                    console.log('r :>> ', r);
                    switch (f.column.type) {
                        case 'string':
                            pass = switchStringType(f, fieldValue);
                            break;
                        case 'number':
                            const numericFieldValue = Number(fieldValue);
                            pass = switchNumberType(f, numericFieldValue);
                            break;
                        default:
                            const arrayFieldValue = fieldValue.split(",");
                            pass = switchArrayType(f, arrayFieldValue);
                            break;
                    }
                    console.log('pass :>> ', pass);
                    if (pass) currentFilterIndices.add(rowIdx);
                });

                filteredIndices[idx] = currentFilterIndices;
            }
        });

        let finalIndices = combineFilterResults(filteredIndices, filter.logicOp);
        if (allFilters.some((f) => typeof f.filterValue === 'string' ? f.filterValue !== "" : f.filterValue.length > 0))
            setRows(allRows.filter((_, idx) => finalIndices.has(idx)));
        else {
            setRows(allRows);
        }

    }, [allFilters, allRows]);

    function combineFilterResults(indices, logicOp) {
        let result = new Set();
        console.log('indices :>> ', indices);
        Object.values(indices).forEach((indexSet, i) => {
            if (i === 0 || logicOp === 'Or') {
                indexSet.forEach(index => result.add(index));
            } else { // "And" 
                result = new Set([...result].filter(x => indexSet.has(x)));
            }
        });

        return result;
    }

    function switchStringType(f, fieldValue) {
        switch (f.operator) {
            case 'Contains':
                return fieldValue.includes(f.filterValue);
            case 'Equals':
                return fieldValue === f.filterValue;
            case 'Starts With':
                return fieldValue.startsWith(f.filterValue);
            case 'Ends With':
                return fieldValue.endsWith(f.filterValue);
            case 'is empty':
                return !fieldValue || fieldValue.trim() === "";
            default:
                return false;
        }
    }

    function switchNumberType(f, numericFieldValue) {
        switch (f.operator) {
            case '=':
                return numericFieldValue === Number(f.filterValue);
            case '!=':
                return numericFieldValue !== Number(f.filterValue);
            case '>':
                return numericFieldValue > Number(f.filterValue);
            case '>=':
                return numericFieldValue >= Number(f.filterValue);
            case '<':
                return numericFieldValue < Number(f.filterValue);
            case '<=':
                return numericFieldValue <= Number(f.filterValue);
            case 'is empty':
                return numericFieldValue === null || numericFieldValue === undefined;
            default:
                return false;
        }
    }

    function switchArrayType(f, arrayFieldValue) {
        switch (f.operator) {
            case 'is':
                return f.filterValue[0] === arrayFieldValue[0];
            case "is not":
                return f.filterValue[0] !== arrayFieldValue[0];
            case "is any of":
                return f.filterValue.includes(arrayFieldValue[0]);
            case "is empty":
                return !arrayFieldValue || arrayFieldValue.length === 0;
            default:
                return false;
        }
    }

    if (!columns || columns.length <= 0 || !filter) {
        return null;
    }

    function getColumnType(type) {
        switch (type) {
            case "string":
                return STR_OPERATORS;
            case "singleSelect":
                return SELECT_OPERATORS;
            case "number":
                return NUMERIC_OPERATORS;
            default:
                return STR_OPERATORS;
        }
    }



    const handleChange = (property, value) => {
        console.log('propery :>> ', property);
        console.log('value :>> ', value);
        setFilters(prev =>
            property === "logicOp" ?
                prev.map(e => ({
                    ...e,
                    [property]: value
                }))
                : prev.map(e => {
                    if (e.id !== filter.id) return e;
                    if (!value) {
                        value = [];
                    }
                    const updates = { ...e, [property]: value };

                    switch (property) {
                        case 'column':
                            updates.filterValue = value.type === "singleSelect" ? [] : "";
                            updates.operator = getColumnType(value.type)[0];
                            break;
                        case 'operator':
                            updates.filterValue = value === 'is any of' ? [] : (typeof filter.filterValue === 'string' ? "" : []);
                            break;
                        default:
                            break;
                    }
                    return updates;
                })
        );
    };

    const renderFilterValueInput = (filter) => {
        if (filter.operator === "is empty") {
            
            return null; 
        }
        if (filter.column.type === "singleSelect") {
            if (filter.operator === "is any of") {
                return <Autocomplete
                    multiple
                    limitTags={1}
                    id="multiple-limit-tags"
                    options={filter.column.valueOptions}
                    getOptionLabel={(option) => option}
                    value={filter.filterValue}
                    onChange={(event, newValue) => {
                        handleChange('filterValue', newValue)
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Value" placeholder="Filter Values" />
                    )}
                    sx={{ width: '320px' }}
                />
            } else {

                return <Autocomplete

                    id="combo-box-demo"
                    options={filter.column.valueOptions}
                    value={filter.filterValue}
                    onChange={(event, newValue) => {
                        handleChange('filterValue', typeof newValue === 'string' ? newValue.split(",") : newValue)
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Value" placeholder="Filter Values" />}
                />

            }
        } else if (filter.column.type === 'number') {
            if (filter.operator === "is any of") {
                return <Autocomplete
                    multiple
                    limitTags={1}
                    freeSolo
                    id="multiple-limit-tags"
                    options={filter.filterValue}
                    getOptionLabel={(option) => option.toString()}
                    value={filter.filterValue}
                    onChange={(event, newValue) => {
                        handleChange('filterValue', newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            type="number"
                            label="Value"
                            placeholder="Filter Values"
                        />
                    )}
                    sx={{ width: '320px' }}
                />
            }

            return <FormControl variant="standard" sx={{ ml: 0 }}>
                <InputLabel shrink htmlFor="standard-adornment-value">
                    Value
                </InputLabel>
                <Input
                    id="standard-adornment-value"
                    type='number'
                    value={filter.filterValue}
                    placeholder='Filter Value'
                    onChange={(e) => handleChange('filterValue', e.target.value)}
                    autoComplete="off"
                />
            </FormControl>;
        } else {
            if (filter.operator === "is any of") {
                return <Autocomplete
                    multiple
                    freeSolo
                    id="multiple-limit-tags"
                    options={filter.filterValue}
                    getOptionLabel={(option) => option}
                    value={filter.filterValue}
                    onChange={(event, newValue) => {
                        handleChange('filterValue', newValue)
                    }}

                    renderInput={(params) => (
                        <TextField {...params}

                            InputLabelProps={{
                                shrink: true,
                            }}
                            label="Value" placeholder="Filter Values" />
                    )}

                    sx={{ width: '200px' }}
                />
            }

            return <FormControl variant="standard" sx={{ ml: 0 }}>
                <InputLabel shrink htmlFor="standard-adornment-value">
                    Value
                </InputLabel>
                <Input
                    id="standard-adornment-value"
                    value={filter.filterValue}
                    placeholder='Filter Value'
                    onChange={(e) => handleChange('filterValue', e.target.value)}
                    autoComplete="off"
                />
            </FormControl>
        }
    }



    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 2, width: "fit-content" }}>
                <Box sx={{ display: 'flex', alignItems: "flex-end", height: "48px", mr: 1 }}>
                    <IconButton onClick={onRemove} size="small">
                        <CloseIcon sx={{
                            fontSize: "24px"
                        }} />
                    </IconButton>
                </Box>

                {allFilters.length > 1 && (
                    <FormControl variant="standard" sx={{ mr: 2, width: "60px" }}>
                        {filter.logicOpAllowed && <><InputLabel id="logic-op-label"></InputLabel>
                            <Select
                                labelId="logic-op-label"
                                value={filter.logicOp}
                                onChange={(e) => handleChange('logicOp', e.target.value)}
                                disabled={allFilters.findIndex(f => f.id === filter.id) !== 1}

                            >
                                {LOGIC_OPS.map(op => (
                                    <MenuItem key={op} value={op}>{op}</MenuItem>
                                ))}
                            </Select>
                        </>}
                    </FormControl>
                )}

                <FormControl variant="standard" sx={{ ml: 0, mr: 0, width: "150px" }}>
                    <InputLabel id="column-label">Column</InputLabel>
                    <Select
                        labelId="column-label"
                        value={filter.column}
                        onChange={(e) => handleChange('column', e.target.value)}
                    >
                        {columns.map(column => (
                            <MenuItem key={column.field} value={column}>{column.headerName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="standard" sx={{ ml: 0, mr: 0, minWidth: "120px" }}>
                    <InputLabel id="operator-label">Operator</InputLabel>
                    <Select
                        labelId="operator-label"
                        value={filter.operator}
                        onChange={(e) => handleChange('operator', e.target.value)}
                    >
                        {getColumnType(filter.column.type).map(operator => (
                            <MenuItem key={operator} value={operator}>{operator}</MenuItem>
                        ))}
                    </Select>
                </FormControl>


                {renderFilterValueInput(filter)}


            </Box>
        </ThemeProvider>
    );
}
