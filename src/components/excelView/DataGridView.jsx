import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarExportContainer, GridToolbarContainer, GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarDensitySelector, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarQuickFilter, useGridApiContext, GridColumnMenu } from '@mui/x-data-grid';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { Button, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import { LETTER_GRADES, STATUS_OPTIONS } from '../../constants/appConstants';
import { CustomFilterPanel } from './CustomFilterPanel';

function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
            columnMenuFilterItem: null,
        }}
      />
    );
  }

const defaultColumns = [
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        type: 'singleSelect',
        valueOptions: STATUS_OPTIONS,
        editable: true,
    },
    { field: 'id', headerName: 'ID', width: 90, type: "string" },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: false,
        type: 'string'

    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: false,
        type: 'string'
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column is not sortable.',
        sortable: false,
        width: 160,
        type: 'string',
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
        field: 'majors',
        headerName: 'Majors',
        width: 150,
        editable: false,
        type: 'string'
    },
    {
        field: 'minors',
        headerName: 'Minors',
        width: 150,
        editable: false,
        type: 'string'
    },
    {
        field: 'mainCourseGrade',
        headerName: 'CS 305 Grade',
        width: 150,
        editable: false,
        type: 'singleSelect',
        valueOptions: LETTER_GRADES
    },


];


function CustomToolbar(props) {
    return (
        <GridToolbarContainer {...props}>
            <CustomFilterPanel 
            columns={props.columns}
            setRows= {props.setRows} 
            allRows= {props.allRows}
            />
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

function ExcelExportMenuItem(props) {
    const apiRef = useGridApiContext();
    const { hideMenu } = props;

    const handleExport = () => {
        hideMenu?.();

        const columnsToExport = apiRef.current.getVisibleColumns().slice(1);
        const aoa = [columnsToExport.map(col => col.headerName)];
        const rows = apiRef.current.getAllRowIds().map(id => apiRef.current.getRow(id));

        rows.forEach(row => {
            const rowData = columnsToExport.map(col => {

                if (col.field === 'fullName') {

                    const firstNameColumn = 'B';
                    const lastNameColumn = 'C';

                    const excelRowNumber = aoa.length + 1;
                    return { f: `=${firstNameColumn}${excelRowNumber} & " " & ${lastNameColumn}${excelRowNumber}` };
                }


                if (Array.isArray(row[col.field])) {
                    return row[col.field].join(", ");
                }


                return row[col.field] || '';
            });

            console.log('rowData :>> ', rowData);
            aoa.push(rowData);
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'DataGridExport.xlsx');
    };

    return (
        <MenuItem onClick={handleExport}>
            Download as Excel
        </MenuItem>
    );
}


const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
    <GridToolbarExportContainer {...other}>
        <GridCsvExportMenuItem options={csvOptions} />
        <ExcelExportMenuItem />
        <GridPrintExportMenuItem options={printOptions} />
    </GridToolbarExportContainer>
);

export default function DataGridView({ applicationRequests, announcement }) {
    const [allRows, setAllRows] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([...defaultColumns]);
    const [filterModel, setFilterModel] = React.useState({
        items: [],
        quickFilterExcludeHiddenColumns: true,
        quickFilterValues: [],
        logic: 'AND'
    });
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

    const [isFilterPanelOpen, setFilterPanelOpen] = React.useState(false);




    const calculateWidth = (text) => {
        const baseWidth = 10;
        const padding = 0;
        return Math.max(0, 150);
    };

    React.useEffect(() => {

        const dynamicColsQAndA = applicationRequests[0]?.qandA.map((qa, idx) => {
            
            const obj = {
                field: `q${idx + 1}`,
                headerName: `Q${idx + 1}: ${qa.question.question}`,
                width: calculateWidth(qa.question.question),
                editable: false,
                sortable: qa.question.type === "NUMERIC",
                type: qa.question.type === "NUMERIC" ? 'number' 
                    : qa.question.type !== "MULTIPLE_CHOICE" ? 'string'
                    : 'singleSelect',
            };
        
            
            if (qa.question.type === "MULTIPLE_CHOICE") {
                obj.valueOptions = qa.question.choices;
            }
        
            return obj;
        }) || [];

        const dynamicColsCourseAndGrades = announcement.previousCourseGrades.map((cg, idx) => ({
            field: `${cg.course.courseCode} Grade`,
            headerName: `${cg.course.courseCode} Grade`,
            width: calculateWidth(cg.course.courseCode),
            editable: false,
            sortable: true,
            type:'singleSelect',
            valueOptions: LETTER_GRADES
        }))
        setColumns([...defaultColumns, ...dynamicColsCourseAndGrades, ...dynamicColsQAndA]);

        const updatedRows = applicationRequests.map((appReq) => {
            const [fname, lname] = appReq.transcript.studentName.split(/\s+/);
            const QA = appReq.qandA.reduce((acc, qa, idx) => ({
                ...acc,
                [`q${idx + 1}`]: qa.question.type === "MULTIPLE_CHOICE" ?
                    qa.question.allowMultipleAnswers ? [...qa.answer].map(index => qa.question.choices[parseInt(index)])
                        : qa.question.choices[parseInt(qa.answer)]
                    : qa.answer,
            }), {});

            const courseAndGrades = announcement.previousCourseGrades.reduce((acc, cg) => ({
                ...acc,
                [`${cg.course.courseCode} Grade`]: cg.grade // TODO
            }), {})

            return {
                status: appReq.status,
                id: appReq.transcript.studentSuId,
                firstName: fname,
                lastName: lname,
                majors: appReq.transcript.program.majors,
                minors: appReq.transcript.program.minors,
                mainCourseGrade: "A", // TODO

                ...courseAndGrades,
                ...QA,
            };
        });
        setAllRows(updatedRows);
        setRows(updatedRows);
    }, [applicationRequests]);

    return (
        <Box sx={{ height: "auto", width: 'fit-content' }}>
            
           
            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight   
                checkboxSelection
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: CustomNoRowsOverlay,
                    noResultsOverlay: CustomNoRowsOverlay,
                    columnMenu: CustomColumnMenu
                }}
                slotProps={{
                    toolbar: {columns: columns, setRows: setRows, allRows: allRows}
                }}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                sx={{
                    '& .MuiDataGrid-overlayWrapperInner': {},
                    '& .MuiDataGrid-footerContainer': { justifyContent: 'flex-start' },
                    '& .MuiTablePagination-root': { justifyContent: 'flex-start' },


                    '& .MuiBox-root': { flex: 1 },
                }}
            />
        </Box>
    );
}