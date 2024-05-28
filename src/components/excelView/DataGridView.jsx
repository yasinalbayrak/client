import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarExportContainer, GridToolbarContainer, GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarDensitySelector, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarQuickFilter, useGridApiContext, GridColumnMenu, GridFooter, GridFooterContainer, gridFilterActiveItemsSelector, gridFilterModelSelector } from '@mui/x-data-grid';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { Button, Chip, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import { LETTER_GRADES, STATUS_OPTIONS } from '../../constants/appConstants';
import { CustomFilterPanel } from './CustomFilterPanel';
import ChangeStatusButton from './ChangeStatusButton';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import { finalizeStatus, updateApplicationRequestStatus, updateApplicationRequestStatusMultiple } from '../../apiCalls';
import Popup from '../popup/Popup';
import { handleInfo } from '../../errors/GlobalErrorHandler';

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
export const renderStatusIcon = (status) => {
    const green = "#2e7d32"
    const red = "#c62828"
    const blue = "#0288d1"
    const orange = "#ff9800"
    switch (status) {
        case STATUS_OPTIONS[0]:
            return {
                icon: <CheckOutlinedIcon
                    color={green}
                />,
                color: green
            }
        case STATUS_OPTIONS[1]:
            return {
                icon: <ReportProblemOutlinedIcon
                    color={red}
                />,
                color: red
            }
        case STATUS_OPTIONS[2]:
            return {
                icon: <AutorenewOutlinedIcon
                    color={orange}
                />,
                color: orange
            }
        case STATUS_OPTIONS[3]:
            return {
                icon: <InfoIcon
                    color={blue}
                />,
                color: blue
            }
        default:
            return {
                icon: <InfoIcon
                    color={blue}
                />,
                color: blue
            }
    }
}

const defaultColumns = [
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        type: 'singleSelect',
        valueOptions: STATUS_OPTIONS,
        editable: true,
        sortable: false,
        renderCell: (params) => (
            <Chip
                variant="outlined"
                size="small"
                icon={renderStatusIcon(params.value).icon}
                label={params.value}
                sx={{
                    borderColor: renderStatusIcon(params.value).color,
                    color: renderStatusIcon(params.value).color
                }}

            />
        )

    },
    {
        field: 'commitstatus',
        headerName: 'Commitment Status',
        width: 160,
        type: 'string',
        editable: false,
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
        field: 'gpa',
        headerName: 'GPA',
        width: 150,
        editable: false,
        type: 'string'
    }



];


function CustomToolbar(props) {
    return (
        <GridToolbarContainer {...props}>
            <CustomFilterPanel
                columns={props.columns}
                setRows={props.setRows}
                allRows={props.allRows}
            />
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

function CustomFooter(props) {
    const apiRef = useGridApiContext();

    const selectedRowData = apiRef.current.getAllRowIds()
        .filter(id => props.selectionModel.includes(id))
        .map(id => apiRef.current.getRow(id))

    const handleChange = (status) => {
        const statusList = selectedRowData.map((row) => ({
            appReqId: row.appReqId,
            status: status
        }))

        updateApplicationRequestStatusMultiple(statusList).then((res) => {

            props.setAllRows(prev => prev.map(row => (
                props.selectionModel.includes(row.id) ? { ...row, status } : row
            )));
            props.setRows(prev => prev.map(row => (
                props.selectionModel.includes(row.id) ? { ...row, status } : row
            )));
            console.log('selectionModel :>> ', props.selectionModel);

            props.setApplicationRequests(prev => prev.map(appReq => {
                console.log('appReq.student.user.universityId :>> ', appReq.student.user.universityId);
                console.log('status :>> ', status);
                return (
                    props.selectionModel.includes(appReq.student.user.universityId) ? { ...appReq, statusIns: status } : appReq
                )
            }));

        }).catch((e) => {
            /* Already Handled */
        })


        props.setSelectionModel([]);
    };

    return (
        <GridFooterContainer {...props}>
            {props.selectionModel.length > 0 && (
                <ChangeStatusButton
                    handleChange={handleChange}
                />
            )}
            <GridFooter sx={{ border: 'none' }} />
            <Button
                color='success'
                variant="contained"
                disableElevation
                endIcon={<SaveIcon />}
                onClick={props.flipPopup}
                sx={{
                    ml: 2,
                    fontSize: "small"
                }}
            >
                Announce Final Results
            </Button>
        </GridFooterContainer>
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

export default function DataGridView({ applicationRequests, announcement, setApplicationRequests }) {
    console.log("announcement: ",announcement)
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
    const [finalizePopoUpOpened, setFinalizePopoUpOpened] = React.useState(false);

    const [isFilterPanelOpen, setFilterPanelOpen] = React.useState(false);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const handleSelectionChange = (newSelectionModel) => {
        setSelectionModel(newSelectionModel);
        // Here you can handle selected rows, for example, log them
        console.log('newSelectionModel :>> ', newSelectionModel);
    };

    console.log('applicationRequests :>> ', applicationRequests);

    const calculateWidth = (text) => {
        const baseWidth = 10;
        const padding = 0;
        return Math.max(0, 150);
    };

    console.log('announcement :>> ', announcement);

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
            type: 'singleSelect',
            valueOptions: LETTER_GRADES
        }))
        setColumns([

            ...defaultColumns,
            ...dynamicColsCourseAndGrades,
            {
                field: 'mainCourseGrade',
                headerName: `${announcement.course.courseCode} Grade`,
                width: 150,
                editable: false,
                type: 'singleSelect',
                valueOptions: LETTER_GRADES
            },
            ...dynamicColsQAndA]);

        const updatedRows = applicationRequests.map((appReq) => {
            console.log("deneemeee", appReq);//delete
            const nameParts = appReq.transcript.studentName.split(/\s+/);
            const lname = nameParts.pop();
            const fname = nameParts.join(' '); 

            const QA = appReq.qandA.reduce((acc, qa, idx) => ({
                ...acc,
                [`q${idx + 1}`]: qa.question.type === "MULTIPLE_CHOICE" ?
                    qa.question.allowMultipleAnswers ? [...qa.answer].map(index => qa.question.choices[parseInt(index)])
                        : qa.question.choices[parseInt(qa.answer)]
                    : qa.answer,
            }), {});

            const courseAndGrades = announcement.previousCourseGrades.reduce((acc, cg) => ({
                ...acc,
                [`${cg.course.courseCode} Grade`]: appReq.transcript.course.find((coursefind)=>cg.course.courseCode===coursefind.courseCode).grade,
            }), {});

            let commitStatus;
            if (appReq.committed && appReq.forgiven) {
                commitStatus = 'Error';
            } else if (appReq.committed && !appReq.forgiven) {
                commitStatus = 'Committed';
            } else if (!appReq.committed && appReq.forgiven) {
                commitStatus = 'Forgiven';
            } else {
                commitStatus = 'Not Committed';
            }


            return {
                status: appReq.statusIns,
                commitstatus: commitStatus,
                id: appReq.student.user.universityId,
                firstName: fname,
                lastName: lname,
                majors: appReq.transcript.program.majors,
                minors: appReq.transcript.program.minors,
                mainCourseGrade: appReq.transcript.course.find((coursefind)=>announcement.course.courseCode===coursefind.courseCode).grade,
                gpa: appReq.transcript.cumulativeGPA,
                ...courseAndGrades,
                ...QA,
                appReqId: appReq.applicationRequestId,
            };
        });
        setAllRows(updatedRows);
        setRows(updatedRows);
    }, [applicationRequests]);


    const handleProcessRowUpdate = React.useCallback(async (newRow, oldRow) => {
        console.log('newRow :>> ', newRow);
        console.log('oldRow :>> ', oldRow);
        if (newRow.status !== oldRow.status) {
            // Call to backend API to update the status
            try {

                await updateApplicationRequestStatus(newRow.appReqId, newRow.status);

                setApplicationRequests(prev => {
                    return prev ? prev.map(appReq => newRow.appReqId === appReq.applicationRequestId ? { ...appReq, statusIns: newRow.status } : appReq) : [];
                });

                console.log("Status updated successfully");
            } catch (error) {
                console.error("Failed to update status:", error);
                throw new Error("Update failed. Reverting changes on the frontend.");
            }
        }
        return newRow;
    }, []);
    const flipPopup = () => {
        setFinalizePopoUpOpened((prev) => !prev);
    };

    return (
        <Box sx={{ height: "auto", width: '90%' }}>


            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                checkboxSelection
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: CustomNoRowsOverlay,
                    noResultsOverlay: CustomNoRowsOverlay,
                    columnMenu: CustomColumnMenu,
                    footer: CustomFooter
                }}
                slotProps={{
                    toolbar: { columns: columns, setRows: setRows, allRows: allRows },
                    footer: { selectionModel: selectionModel, setSelectionModel: setSelectionModel, setAllRows: setAllRows, setRows: setRows, flipPopup: flipPopup, setApplicationRequests: setApplicationRequests }
                }}
                processRowUpdate={handleProcessRowUpdate}
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={(ids) => {

                    setSelectionModel(ids);
                }}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}

                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-overlayWrapperInner': {},
                    '& .MuiDataGrid-footerContainer': { justifyContent: 'flex-start' },
                    '& .MuiTablePagination-root': { justifyContent: 'flex-start' },


                    '& .MuiBox-root': { flex: 1 },
                }}

            />
            <Popup
                opened={finalizePopoUpOpened}
                flipPopup={flipPopup}
                title={"Confirm Announcing Final Status?"}
                text={"If there would be a final status announcement, all the students will be notified about their final status. Are you sure you want to announce the final status?\n Final status can be done again after this action."}
                posAction={() => {
                    finalizeStatus(announcement.applicationId);
                    flipPopup();
                    setApplicationRequests((prev) => {
                        console.log('prev Yasin:>> ', prev);
                        return prev.map((appReq) => ({ ...appReq, status: appReq.statusIns }))
                    })
                    handleInfo("Successfully finalized the results.");
                }}
                negAction={flipPopup}
                posActionText={"Finalize"}
            />
        </Box>
    );
}