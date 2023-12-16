import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { getStudentCourseGrades } from '../../apiCalls';
import { useSelector } from "react-redux";
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    DialogActions,
    Chip
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function DesiredCourseGradesPopup({ previousCourseGrades, courseCode, grade, isInprogressAllowed }) {
    const [open, setOpen] = React.useState(false);
    const [eligibilityChecked, setEligibilityChecked] = React.useState(false);
    const [studentCourseAndGrades, setStudentCourseAndGrades] = React.useState([]);
    const [courseGrades, setCourseGrades] = React.useState(null);
    const [isLoadingEligibility, setIsLoadingEligibility] = React.useState(false);

    React.useEffect(() => {
        console.log('course :>> ', courseCode);
        console.log('grade :>> ', grade);
        console.log('isInProgressAllowed :>> ', isInprogressAllowed);
        console.log('previousCourseGrades :>> ', previousCourseGrades);
        setCourseGrades(
            [
                {
                    course: { courseCode: courseCode },
                    grade: grade,
                    isInprogressAllowed: isInprogressAllowed
                },
                ...previousCourseGrades
            ]
        )
    }, [previousCourseGrades]);
    courseGrades && console.log('courseGrades :>> ', courseGrades);
    const userID = useSelector((state) => state.user.id);
    const isInstructor = useSelector((state) => state.user.isInstructor);
    const grades = {
        "A": 0,
        "A-": 1,
        "B+": 2,
        "B": 3,
        "B-": 4,
        "C+": 5,
        "C": 6,
        "C-": 7,
        "D": 8,
        "S": 9,
        "W": 10,
        "F": 11
    };;
    // const previousCourseGrades = [
    //     { courseCode: 'CS 101', minLetterGrade: 'A', inProgress: true },
    //     { courseCode: 'ABCDEF 202', minLetterGrade: 'B', inProgress: false },
    //     { courseCode: 'CS 101', minLetterGrade: 'A', inProgress: true },

    //     // Add more courses as needed
    // ];
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEligibilityChecked(false)
    };


    React.useEffect(() => {
        setEligibilityChecked(false);
        function fetchStudentGrades() {
            getStudentCourseGrades(userID).then((data) => {
                setStudentCourseAndGrades(data)
            }
            ).catch((_) => { })
        }
        fetchStudentGrades();
    }, [userID])


    const handleCheckEligibility = () => {
        if (!isInstructor) {
            setEligibilityChecked(false);
            if (studentCourseAndGrades && courseGrades) {
                const modifiedList = courseGrades.map((courseAndGrade) => {
                    console.log('courseAndGrade :>> ', courseAndGrade);
                    const studentGrade = studentCourseAndGrades.find((each) => each.courseCode === courseAndGrade.course.courseCode);
                    console.log('studentGrade :>> ', studentGrade);
                    let isEligible = false;
                    if (studentGrade) {
                        const { grade: studentGradeValue } = studentGrade;
                        const isInProgressAllowed = studentGradeValue === "IP" && courseAndGrade.isInprogressAllowed;
                        const isGradeEligible = studentGradeValue !== "IP" && (grades[studentGradeValue] <= grades[courseAndGrade.grade]);

                        isEligible = isInProgressAllowed || isGradeEligible;
                    }
                    console.log('isEligible :>> ', isEligible);
                    return { ...courseAndGrade, studentGrade: studentGrade?.grade ?? null, isEligible: isEligible };
                });
                setCourseGrades(modifiedList)
                setEligibilityChecked(true)
            } else {
                setIsLoadingEligibility(true);
            }
        }

    }


    return (
        <React.Fragment>
            <Button variant="outlined" sx={{ fontSize: "0.7rem", padding: "4px 8px" }} onClick={handleClickOpen}>
                See Requirements
            </Button>
            <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent dividers style={{ padding: '40px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 'fit-content' }}>
                                    Course Code
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    Required Letter Grade
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    In Progress Applicants
                                </TableCell>
                                {eligibilityChecked && <>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                        Your Grade
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        Eligibility
                                    </TableCell>
                                </>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courseGrades && courseGrades.map((prevGrades) => (
                                <TableRow key={prevGrades.course.courseCode}>

                                    <TableCell>
                                        <Chip
                                            label={prevGrades.course.courseCode}
                                            variant="filled"
                                            title={prevGrades.course.courseCode}
                                            color="primary"
                                            clickable={true}
                                            style={{ backgroundColor: '#E5D4FF', fontWeight: 'bold', color: 'black' }}
                                            sx={{
                                                width: '6rem',
                                                minHeight: '2.5rem',

                                                height: 'auto',
                                                '& .MuiChip-label': {
                                                    display: 'block',
                                                    whiteSpace: 'normal',
                                                },
                                                fontSize: `11px`
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>

                                        <Chip
                                            label={prevGrades.grade}
                                            variant="filled"
                                            title={prevGrades.grade}
                                            color="primary"
                                            clickable={true}
                                            style={{ backgroundColor: 'lightblue', fontWeight: 'normal', color: 'black' }}
                                            sx={{
                                                width: '50px',
                                                minHeight: '2rem',
                                                height: 'auto',
                                                '& .MuiChip-label': {
                                                    display: 'block',
                                                    whiteSpace: 'normal',
                                                },
                                                fontSize: `12px`
                                            }}
                                        />

                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>

                                        <Chip
                                            label={prevGrades.isInprogressAllowed ? (
                                                'Allowed'
                                            ) : (
                                                'Not Allowed'
                                            )}
                                            variant="filled"
                                            title={prevGrades.isInprogressAllowed ? (
                                                'Allowed'
                                            ) : (
                                                'Not Allowed'
                                            )}
                                            color="primary"
                                            clickable={true}
                                            style={{
                                                backgroundColor: `${prevGrades.isInprogressAllowed ? (
                                                    '#F4F27E'
                                                ) : (
                                                    '#F4BF96'
                                                )}`, fontWeight: 'normal', color: 'black'
                                            }}

                                            sx={{
                                                width: 'fit-content',
                                                minHeight: '3rem',
                                                height: 'auto',
                                                '& .MuiChip-label': {
                                                    display: 'block',
                                                    whiteSpace: 'normal',
                                                },
                                                fontSize: `12px`
                                            }}
                                        />

                                    </TableCell>
                                    {eligibilityChecked && <>
                                        <TableCell sx={{ textAlign: 'center' }}>

                                            {prevGrades.studentGrade ? <Chip
                                                label={prevGrades.studentGrade}
                                                variant="filled"
                                                title={prevGrades.studentGrade}
                                                color="primary"
                                                clickable={true}
                                                style={{ backgroundColor: 'lightblue', fontWeight: 'normal', color: 'black' }}
                                                sx={{
                                                    width: '50px',
                                                    minHeight: '2rem',
                                                    height: 'auto',
                                                    '& .MuiChip-label': {
                                                        display: 'block',
                                                        whiteSpace: 'normal',
                                                    },
                                                    fontSize: `12px`
                                                }}
                                            />
                                                :
                                                <RemoveIcon />
                                            }

                                        </TableCell>
                                        {prevGrades.isEligible != null && <TableCell sx={{ textAlign: 'center' }}>
                                            {prevGrades.isEligible ? (
                                                <DoneIcon sx={{ width: '2rem', height: '2rem', color: 'white', borderRadius: '50%', backgroundColor: 'lightgreen', padding: '4px' }} />
                                            ) : (
                                                <CloseIcon sx={{ width: '2rem', height: '2rem', color: 'white', borderRadius: '50%', backgroundColor: 'lightcoral', padding: '4px' }} />
                                            )}
                                        </TableCell>}
                                    </>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleCheckEligibility}>
                        Check My Eligibility
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}