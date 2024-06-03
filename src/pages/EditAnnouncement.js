import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import EditQuestion from "../components/EditQuestion";
import {Typography, Box, Grid, InputAdornment, Divider} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from '@mui/styles';
import {getTerms, getAnnouncement, getAllInstructors, getAllCourses, addAnnouncement} from "../apiCalls";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import UseNumberInputCompact from '../components/IncDec'
import {flipShowTerms, setTerm} from "../redux/userSlice";
import Alert from '@mui/material/Alert';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import BackButton from "../components/buttons/BackButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Tooltip from "@mui/material/Tooltip";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import HorizontalLinearAlternativeLabelStepper from "../components/stepper/stepper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import {WorkHour} from "./CreateAnnouncement";
import AbcIcon from "@mui/icons-material/Abc";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AddQuestion from "../components/AddQuestion";
import {handleInfo} from "../errors/GlobalErrorHandler";
import {toast} from "react-toastify";

const useStyles = makeStyles((theme) => ({
  activeItem: {
    backgroundColor: 'lightgreen',

    '&:hover': {
      color: 'black',
      fontWeight: 'normal'
    },
  },
}));



function EditAnnouncement() {
  const userId = useSelector((state) => state.user.id);
  const name = useSelector((state) => state.user.name);
  const surname = useSelector((state) => state.user.surname);
  const userName = name + " " + surname;
  const term = useSelector((state) => state.user.term);
  const username = useSelector((state) => state.user.username);
  const grades = [
    { value: "A", label: "A" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B", label: "B" },
    { value: "B-", label: "B-" },
    { value: "C+", label: "C+" },
    { value: "C", label: "C" },
    { value: "C-", label: "C-" },
    { value: "D+", label: "D+" },
    { value: "D", label: "D" },
    { value: "S", label: "S" },
    { value: "W", label: "W" },
  ];
  const WorkHour = [
    { value: "PT1H", label: "1 Hour" },
    { value: "PT2H", label: "2 Hours" },
    { value: "PT3H", label: "3 Hours" },
    { value: "PT4H", label: "4 Hours" },
    { value: "PT5H", label: "5 Hours" },
    { value: "PT6H", label: "6 Hours" },
    { value: "PT7H", label: "7 Hours" },
    { value: "PT8H", label: "8 Hours" },
    { value: "PT9H", label: "9 Hours" },
    { value: "PT10H", label: "10 Hours" },
  ];


  const navigate = useNavigate();
  const getColorForGrade = (grade) => {
    switch (grade) {
      case 'A':
      case 'A-':
        return 'success';
      case 'B+':
      case 'B':
      case 'B-':
        return 'info';
      case 'C+':
      case 'C':
      case 'C-':
        return 'primary';
      case 'D':
      case 'D+':
        return 'warning';
      case 'S':
        return 'default';
      default:
        return 'default';
    }
  };

  const MAX_WORD_COUNT = 2048;


  const [authUsersList, setAuthUserList] = useState([]); //get instructors from database
  const [authPeople, setAuthPeople] = useState([
    {
      display_name: name + " " + surname,
      username: userName,
      authOptionValue: name + " " + surname + " (" + userName + ")",
      id: userId
    }]);
  const [authValue, setAuthValue] = useState(""); // for autocomplete
  const [inputAuthValue, setAuthInputValue] = useState(""); // for autocomplete

  const [courseCodeList, setCourseCodeList] = useState([]); //get course codes from database
  const [courseList, setcourseList] = useState([]); //get courses from database

  const [courseCode, setCourseCode] = useState(""); //used for send request as selected from list to course code
  const [courseCodeValue, setCourseCodeValue] = useState(""); // for autocomplete
  const [inputCourseCodeValue, setCourseCodeInputValue] = useState(""); // for autocomplete

  const [selectedCourses, setSelectedCourses] = useState([]); //used for send request as selected from list
  const [courseValue, setCourseValue] = useState(""); // for autocomplete
  const [inputCourseValue, setCourseInputValue] = useState(""); // for autocomplete


  const [allTerms, setAllTerms] = useState([])
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [desiredLetterGrade, setDesiredLetterGrade] = useState({});
  const [isInprogressAllowed, setIsInprogressAllowed] = useState(false);
  const [isNotTakenAllowed, setIsNotTakenAllowed] = useState(false);
  const [desiredCourseCode, setDesiredCourseCode] = useState("");
  const [desiredCourseList, setDesiredCourseList] = useState([]); //get courses from database
  const [desiredCourseCodeValue, setDesiredCourseCodeValue] = useState(""); // for autocomplete
  const [desiredCourseCodeInputValue, setDesiredCourseCodeInputValue] = useState(""); // for autocomplete
  const [error, setError] = React.useState(false);
  const [announcementTerm, setAnnouncementTerm] = useState(null);
  const [termSelect, setTermSelect] = React.useState(term);
  const [isFocused, setIsFocused] = React.useState(false);

  const todayIstanbul = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
  const currentDate = new Date(todayIstanbul);
  const formattedDate = currentDate.toISOString().split('T')[0];


  useEffect(() => {

    dispatch(flipShowTerms())






    return () => {
      dispatch(flipShowTerms())
    };
  }, []);

  //get all instructors
  useEffect(() => {
    getAllInstructors().then((results) => {
      // const filteredResults = results.filter((instructor) => { //for removing current user from options
      //   return (instructor.user.name+" "+instructor.user.surname).toLowerCase() !== userName.toLowerCase();
      // });

      const transformedResults = results.map((instructor) => {
        const [lastName, firstName] = [instructor.user.surname, instructor.user.name];
        const displayName = firstName.trim() + " " + lastName.trim();
        const OptionValue = displayName + " (" + instructor.user.email + ")";

        return {
          display_name: displayName,
          username: instructor.user.name[0].toUpperCase() + instructor.user.name.slice(1) + " " + instructor.user.surname[0].toUpperCase() + instructor.user.surname.slice(1),
          authOptionValue: OptionValue,
          id: instructor.user.id,
        };
      });
      setAuthUserList(transformedResults);
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // get all courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAllCourses();


        const courseCodes = results.map((course) => {
          return {
            title: course.courseCode
          }
        })

        setCourseCodeList(courseCodes);
        setcourseList(courseCodes);
        setDesiredCourseList(courseCodes)
      } catch (error) {

      }
    };

    fetchData();
  }, []);

  const handleClose = (event, reason) => {
    handleDesiredCourseCodeDelete();
    setDesiredLetterGrade(null);
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
    setIsInprogressAllowed(false);
    setIsNotTakenAllowed(false);
  };

  function handleDesiredCourseCodeDelete() { //change here
    //console.log("Deleting course code");
    // const updatedSelectedCourses = selectedCourses.filter(
    //   (course) => course !== courseCode
    // );
    // setSelectedCourses(updatedSelectedCourses); //this leads some bug issues
    //setSelectedCourses([]);
    setDesiredCourseCodeValue("");
    setDesiredCourseCodeInputValue("");
    setDesiredCourseCode("");
  }

  const handleChangeDesired = (event, newValue) => {
    if (newValue) {

      var trimmedValue;
      if (typeof newValue === 'string') {

        trimmedValue = newValue;
      }
      // Add "xxx" option created dynamically
      else if (newValue.inputValue) {

        trimmedValue = newValue.inputValue;
      }
      else {

        trimmedValue = newValue.title;
      }

      trimmedValue.trim()

      setDesiredCourseCodeValue(trimmedValue);
      setDesiredCourseCode(trimmedValue);

      if (!desiredCourseList.some(course => course.title === trimmedValue)) {
        setDesiredCourseList((prev) => [...prev, { title: trimmedValue }]);
      }
    }

  }



  const handleAdd = () => {


    if (!desiredCourseCode || !desiredLetterGrade) {
      setError("Fill out the form.")
    }
    else if (selectedCourses.some((course) => course.courseCode === desiredCourseCode)) {
      setError("There is already requirement for this course.");
    }

    else {

      setSelectedCourses((prev) => ([
        ...prev,
        {
          courseCode: desiredCourseCode,
          grade: desiredLetterGrade,
          isInprogressAllowed: isInprogressAllowed,
          isNotTakenAllowed: isNotTakenAllowed
        }
      ]))
      handleClose();
    }

  }

  function extractSubstring(inputString) {
    const result = inputString.match(/^[^\s\d]+/);
    return result ? result[0].length : 2;
  }

  function updateGrade(courseCode, index) {
    setSelectedCourses((prev) => {
      return prev.map((course) => {

        if (course.courseCode === courseCode) {

          return {
            ...course,
            grade: grades[index].label,
          };
        }
        return course;
      });
    });
  }

  //used in autocomplete for keeping value and input value
  function handleAuthAdd(newValue) {
    if (newValue !== null) {
      const selectedUser = authUsersList.find((user) => user.authOptionValue === newValue);
      setAuthPeople([...authPeople, selectedUser]);
    }
    setAuthValue("");
    setAuthInputValue("");
  }

  function handleAuthDelete(userToDelete) {
    const updatedAuthPeople = authPeople.filter((user) => user.username !== userToDelete.username);
    // console.log(updatedAuthPeople)
    setAuthPeople(updatedAuthPeople);
  }

  //for auth filter options
  function filterOptions(options, { inputValue }) {
    const filtered = options.filter((option) => {
      if (authPeople.some((person) => person.authOptionValue === option)) {
        return false; // filter out if already in authPeople
      }
      return option.toLowerCase().includes(inputValue.toLowerCase());
    });

    // sort the filtered options based on their match with the input value
    const inputValueLowerCase = inputValue.toLowerCase();
    filtered.sort((a, b) => {
      const aIndex = a.toLowerCase().indexOf(inputValueLowerCase);
      const bIndex = b.toLowerCase().indexOf(inputValueLowerCase);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return a.localeCompare(b);
    });

    return filtered;
  }

  //console.log(authPeople) //for debugging authPeople

  //used in autocomplete for keeping value and input value
  function handleCourseCodeAdd(newValue) { //change here
    if (newValue !== null) {
      const selectedCourseCode = courseCodeList.find((course) => course === newValue);
      setCourseCode(selectedCourseCode);
      setSelectedCourses([...selectedCourses, selectedCourseCode]);
    }
    // setCourseCodeValue("");
    // setCourseCodeInputValue("");
  }

  function updateCourseCode(courseCode) {
    setCourseCode(courseCode);
  }

  function handleCourseCodeDelete() { //change here
    //console.log("Deleting course code");
    // const updatedSelectedCourses = selectedCourses.filter(
    //   (course) => course !== courseCode
    // );
    // setSelectedCourses(updatedSelectedCourses); //this leads some bug issues
    setSelectedCourses([]);
    setCourseCodeValue("");
    setCourseCodeInputValue("");
    setCourseCode("");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTerms();
        setAllTerms(res);
      } catch (_) {
        /* Handled */
      }
    };

    fetchData();
  }, []);


  const handleChange = (event, newValue) => {
    if (newValue) {

      var trimmedValue;
      if (typeof newValue === 'string') {

        trimmedValue = newValue;
      }
      // Add "xxx" option created dynamically
      else if (newValue.inputValue) {

        trimmedValue = newValue.inputValue;
      }
      else {

        trimmedValue = newValue.title;
      }

      trimmedValue.trim()

      setCourseCodeValue(trimmedValue);
      setCourseCode(trimmedValue);

      if (!courseList.some(course => course.title === trimmedValue)) {
        setcourseList((prev) => [...prev, { title: trimmedValue }]);
      }
    }

  }

  function findTermObject(term) {
    const termObj = allTerms.map((termObject) => {
      if (termObject.term_desc === term) {
        console.log(termObject)
        setAnnouncementTerm(termObject);
        return termObject;
      }
    });
    console.log(termObj)
    return termObj;
  }

  useEffect(() => {
    console.log(courseCode)
    console.log(courseCodeList)

  }, [courseCode, courseCodeList])




  function filterCourseCodes(optionCourseCodes, { inputValue }) {

    const filtered = optionCourseCodes.filter((option) => {
      if (courseCode === option.title) {
        return false; // filter out if already in selectedCourses
      }
      return option.title.toLowerCase().includes(inputValue.trim().toLowerCase());
    });

    // sort the filtered options based on their match with the input value
    const inputValueLowerCase = inputValue.toLowerCase();
    filtered.sort((a, b) => {
      const aIndex = a.title.toLowerCase().indexOf(inputValueLowerCase);
      const bIndex = b.title.toLowerCase().indexOf(inputValueLowerCase);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return a.title.localeCompare(b.title);
    });
    const isExisting = optionCourseCodes.some((option) => inputValue.trim() === option.title);
    if (inputValue && !isExisting) {
      filtered.push({
        inputValue,
        title: `Add "${inputValue.trim()}"`
      })
    }

    return filtered;

  }
  const handleTermSelect = (event) => {

    setTermSelect(event.target.value);
  };
  const steps = [
    'Required Fields',
    'Optional Fields',
    'Additional Questions',
  ];

  const handleNext = () => {

    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {

    if (activeStep === steps.length - 1) {

      const currentIstanbulTime = new Date(new Date().getTime());
      const combinedDateTime = announcementDetails.lastApplicationDate + "T" + announcementDetails.lastApplicationTime + ":00";
      const selectedTime = new Date(combinedDateTime);
      if (selectedTime < currentIstanbulTime) {
        alert("hi2")
        handleInfo("Selected last application date and time cannot be before the current Istanbul time.", {
          containerId: "1618",
          closeOnClick: true,
        });
        return;
      }





      if (
          announcementDetails.course_code &&
          announcementDetails.lastApplicationDate &&
          announcementDetails.lastApplicationTime &&
          announcementDetails.workHours &&
          announcementDetails.term &&
          authPeople &&
          (!announcementDetails.isDesiredLetterGradeEnabled || (announcementDetails.letterGrade)) &&

          (!announcementDetails.isSectionEnabled || (announcementDetails.section !== "" && announcementDetails.section))

      ) {
        console.log('announcementDetails :>> ', announcementDetails);
        addAnnouncement(
            announcementDetails.course_code,
            username,
            announcementDetails.lastApplicationDate,
            announcementDetails.lastApplicationTime,
            announcementDetails.isDesiredLetterGradeEnabled ? announcementDetails.letterGrade : null,
            announcementDetails.workHours,
            announcementDetails?.jobDetails ?? "",
            authPeople,
            selectedCourses,

            announcementDetails.term,
            announcementDetails.isInprogressAllowed,
            announcementDetails.isNotTakenAllowed,
            announcementDetails.section
        ).then((data) => {
          dispatch(setTerm({ term: announcementDetails.term }));
          navigate("/Home", {
            replace: true
          });

          toast.success("Your announcement has been successfully added.", {
            containerId: "1618",
            closeOnClick: true,
          })

        }).catch((_) => {
          /* Error is already printed */
        });

      } else {
        alert("hi")
        console.log('announcementDetails :>> ', announcementDetails);
        handleInfo("Please fill out the required fields.")
      }
    } else {
      handleNext();
    }

  };
  function isValidString(str) {
    return /^[A-Z]+(\s*)?\d+$/.test(str);
  }
  const courseCodeValid = (courseCode) => courseCode.trim() != '' && !isValidString(courseCode.trim())

  //used in autocomplete for keeping value and input value
  function handleCourseAdd(newValue) {
    if (newValue !== null) {
      const selectedCourse = courseList.find((course) => course === newValue);
      setSelectedCourses([...selectedCourses, selectedCourse]);
    }
    setCourseValue("");
    setCourseInputValue("");
  }


  function handleCourseDelete(courseToDelete) {
    const updatedSelectedCourses = selectedCourses.filter(
      (course) => course.courseCode !== courseToDelete
    );
    // console.log(updatedSelectedCourses)
    setSelectedCourses(updatedSelectedCourses);
  }

  function filterCourses(optionCourses, { inputValue }) {
    const filtered = optionCourses.filter((option) => {
      if (selectedCourses.some((course) => course === option)) {
        return false; // filter out if already in selectedCourses
      }
      return option.toLowerCase().includes(inputValue.toLowerCase());
    });

    // sort the filtered options based on their match with the input value
    const inputValueLowerCase = inputValue.toLowerCase();
    filtered.sort((a, b) => {
      const aIndex = a.toLowerCase().indexOf(inputValueLowerCase);
      const bIndex = b.toLowerCase().indexOf(inputValueLowerCase);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return a.localeCompare(b);
    });

    return filtered;
  }



  const [announcementDetails, setAnnouncementDetails] = useState(null);
  const [UserDetails, setUserDetails] = useState({});


  const { id } = useParams(); //for taking post id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAnnouncement(id);

        // Handle potential errors in the fetched data
        if (!results) {
          console.error("No data received from getAnnouncement");
          return;
        }

        const deadline = results.lastApplicationDate.split("T");
        const authInstructors = results.authorizedInstructors;
        const desiredCourses = results.previousCourseGrades;

        const FindAuthPeople = authInstructors.reduce((people, instructor) => {
          const user = authUsersList.find((authUser) =>
            authUser.username.toLowerCase() === (instructor.user.name.toLowerCase() + " " + instructor.user.surname.toLowerCase())
          );

          if (user) {
            people.push(user);
          }

          return people;
        }, []);

        const FindDesiredCourses = desiredCourses.reduce((courses, desiredCourse) => {
          courses.push({
            courseCode: desiredCourse.course.courseCode,
            grade: desiredCourse.grade,
            isInprogressAllowed: desiredCourse.isInprogressAllowed,
            isNotTakenAllowed: desiredCourse.isNotTakenAllowed,
          });
          return courses;
        }, []);

        const findTermObject = allTerms.find((term) => term.term_desc === results.term);

        const PostResult = {
          course_code: results.course.courseCode,
          lastApplicationDate: deadline[0],
          lastApplicationTime: deadline[1],
          letterGrade: results.minimumRequiredGrade,
          workHours: results.weeklyWorkHours,
          jobDetails: results.jobDetails,
          authInstructor: FindAuthPeople,
          desiredCourses: FindDesiredCourses,
          term: findTermObject,
          questions: results.questions,
          isInprogressAllowed: results.isInprogressAllowed,
          isNotTakenAllowed: results.isNotTakenAllowed,
          isSectionEnabled: results.section != null,
          section: results.section
        };

        setCourseCode(results.course.courseCode);
        setCourseCodeValue(results.course.courseCode);
        setCourseCodeInputValue(results.course.courseCode);
        setTermSelect(findTermObject);
        setAuthPeople(FindAuthPeople);
        setSelectedCourses(FindDesiredCourses);
        setAnnouncementDetails(PostResult);

        const QuestionsResult = results.questions;
        const transformedResultQuestions = QuestionsResult.map((question) => {
          return {
            questionNumber: question.ranking,
            mQuestion: question.question,
            mValue: question.type,
            mMultiple: question.multiple_choices === "[]" ? ["", ""] : JSON.parse(question.multiple_choices),
          };
        });



        // Additional state update checks if needed
        if (results && results.course && results.course.courseCode) {
          setCourseCode(results.course.courseCode);
          setCourseCodeValue(results.course.courseCode);
          setCourseCodeInputValue(results.course.courseCode);
        }

      } catch (error) {
        console.error("Error fetching or processing announcement:", error);
      }
    };

    fetchData();
  }, [id, authUsersList, courseCodeList, courseList, allTerms]);


  // set changes for autocomplete
  useEffect(() => {
    setAnnouncementDetails((prevDetails) => ({
      ...prevDetails,
      course_code: courseCode,
      authInstructor: authPeople,
      desiredCourses: selectedCourses,
    }));
  }, [courseCode, authPeople, selectedCourses]);

  function handleInput(event) {
    const { name, value } = event.target;

    if (name === "jobDetails" && value.length > 2048) {
      return;
    }

    setAnnouncementDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  useEffect(() => { setError(null) }, [desiredCourseCode, desiredCourseList])
  useEffect(() => {
    setAnnouncementDetails(prev => ({
      ...prev,
      term: termSelect
    }))
  }, [termSelect])

  const handleDesiredInputChange = (event, newInputValue) => {
    const uppercaseValue = newInputValue.toUpperCase();
    const filteredValue = uppercaseValue.replace(/[^A-Z0-9\ ]/g, '');
    setDesiredCourseCodeValue(filteredValue);
  };
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  console.log('termSelect :>> ', termSelect);
  if (!announcementDetails || !termSelect) return (<div>Loading...</div>);
  console.log('announcementDetails :>> ', announcementDetails);
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <Button
            variant="contained"
            startIcon={<CloseIcon />}
            color="error"
            sx={{
              position: 'relative',
              margin: "3rem 0 0 0"
            }}
            onClick={() => navigate("/home", { replace: true })}
        >
          Cancel
        </Button>
        <AppBarHeader />
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4, mt: 2 }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Edit Announcement
            </Typography>
          </Box>
            <HorizontalLinearAlternativeLabelStepper
                activeStep={activeStep}
                steps={steps}
            />

        </Grid>

        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ backgroundColor: "none" }}>
          <Grid item xs={8}
                sx={{ backgroundColor: "none" }}
          >
            {activeStep === 0 && (<>
                  <Grid container direction="row" justifyContent="start" alignItems="center" marginY={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                      {(announcementDetails.term && Object.keys(announcementDetails.term).length > 0) && (
                          <CheckCircleIcon sx={{ ml: -4, color: "green" }} />
                      )}
                      <CalendarTodayIcon sx={{ color: Object.keys(announcementDetails.term).length === 0 ? "" : "green" }} />
                      <Divider orientation="vertical" variant="middle" color={Object.keys(announcementDetails.term).length === 0 ? "" : "success"} flexItem sx={{ mx: 2 }} />
                      <Typography variant="body1" sx={{ display: 'flex' }}>
                        Term:
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            disabled
                            id="demo-simple-select"
                            value={termSelect}
                            name="term"
                            sx={{ minWidth: 190, mt: 1 }}
                            MenuProps={{ style: { maxHeight: '360px' }, autoFocus: false }}
                            defaultValue={termSelect}
                        >
                          {allTerms.map((eachTerm) => (
                              <MenuItem
                                  key={eachTerm.term_code}
                                  value={eachTerm}
                                  sx={{ maxHeight: '360px' }}
                                  className={eachTerm.is_active === '1' ? classes.activeItem : ''}
                              >
                                {eachTerm.term_desc}
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

            <Grid
                container
                direction="row"
                justifyContent="start"
                alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                {(courseCode ?? "").trim() !== "" && <CheckCircleIcon
                    sx={{
                      ml: -4,
                      color: "green"
                    }} />}
                <BookOutlinedIcon sx={{
                  color: (courseCode ?? "").trim() === "" ? "" : "green"
                }} />
                <Divider orientation="vertical" variant="middle" color={(courseCode ?? "").trim() === "" ? "" : "success"} flexItem
                         sx={{ mx: 2 }} />
                <Typography sx={{ display: 'flex' }}>Course:</Typography>


                <Autocomplete
                    onBlur={() => {
                      if (!courseCode) {
                        setCourseCodeValue("")
                      }

                    }}
                    value={courseCodeValue}
                    onChange={handleChange}
                    filterOptions={filterCourseCodes}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys

                    id="free-solo-with-text-demo"
                    options={courseList}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.title}</li>}
                    sx={{ width: 250 }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            multiline
                            size="small"
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                setCourseCode((prev) => (prev.addSpaces()))
                                event.preventDefault();
                              }
                            }}
                            onKeyPress={(event) => {
                              const key = event.key;
                              const regex = /^[A-Za-z0-9\ ]+$/;

                              if (!regex.test(key) && key !== 'Enter') {
                                event.preventDefault();
                              } else {
                                setCourseCode("")
                              }
                            }}

                            sx={{
                              width: 250,
                              ...(params.disabled && {
                                backgroundColor: 'transparent',
                                color: 'inherit',
                                pointerEvents: 'none',
                              }),
                            }}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                  <>
                                    {params.InputProps.endAdornment}
                                    {courseCode && (
                                        <IconButton
                                            onClick={handleCourseCodeDelete}
                                            aria-label="Clear"
                                            size="small"
                                        >
                                          <ClearIcon />
                                        </IconButton>
                                    )}
                                  </>
                              ),
                            }}
                        />
                    )}
                    disableClearable
                    disabled
                />
                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginLeft: "1rem" }}>


                  <FormControlLabel
                      value={announcementDetails.isSectionEnabled}
                      onChange={(event) => {

                        setAnnouncementDetails((prev) => ({
                          ...prev,
                          isSectionEnabled: event.target.checked,
                          section: event.target.checked ? prev.section : null
                        }));
                      }}
                      sx={{ minWidth: "fit-content" }}
                      control={<Checkbox checked={announcementDetails.isSectionEnabled} />}
                      label="Add Section"
                      disabled
                  />
                  <TextField
                      label="Section"
                      variant="outlined"
                      name="section"
                      value={announcementDetails.section ?? ''}
                      onChange={handleInput}
                      autoComplete="off"
                      sx={{
                        marginLeft: "1rem",
                        userSelect: "none",
                        minWidth: "3rem",
                        "& .MuiOutlinedInput-input": {
                          height: "0px",

                        },
                        "& .MuiOutlinedInput-root": {
                          height: "40px",

                        },
                        "& .MuiInputLabel-outlined": {
                          transform: "translate(14px, 10px) scale(1)",
                        },
                        "& .MuiInputLabel-shrink": {
                          transform: "translate(14px, -6px) scale(0.75)", // Adjust label position for shrunk state
                        },

                      }}
                      disabled
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid
                container
                direction="row"
                justifyContent="start"
                alignItems="center"
                marginY={2}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                {/* Icon and Deadline Text */}
                {(announcementDetails.lastApplicationDate && announcementDetails.lastApplicationTime) && <CheckCircleIcon
                    sx={{
                      ml: -4,
                      color: "green"
                    }} />}


                <AccessAlarmIcon
                    sx={{
                      color: (announcementDetails.lastApplicationDate && announcementDetails.lastApplicationTime) ? "green" : ""
                    }} />



                <Divider orientation="vertical" variant="middle" color={(announcementDetails.lastApplicationDate && announcementDetails.lastApplicationTime) ? "success" : ""} flexItem
                         sx={{ mx: 2 }} />


                <Typography>Deadline:</Typography>




                {/* Date Input */}
                <Grid item>
                  <TextField
                      id="outlined-required"
                      name="lastApplicationDate"
                      label="Date"
                      variant="outlined"
                      type="date"
                      value={announcementDetails.lastApplicationDate}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      onChange={handleInput}
                      inputProps={{ min: formattedDate }}
                      sx={{ width: 150 }}
                  />
                </Grid>

                {/* Time Picker */}
                <Grid item sx={{ width: 'auto' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        id="outlined-required-time"
                        name="lastApplicationTime"
                        label="Time"
                        inputFormat="HH:mm"
                        value={announcementDetails.lastApplicationTime}
                        onChange={(newValue) => {
                          let newTime = '';
                          if (newValue) {
                            newTime = newValue.$H.toString().padStart(2, '0') + ':' + newValue.$m.toString().padStart(2, '0');
                          }

                          setAnnouncementDetails((prevDetails) => ({
                            ...prevDetails,
                            lastApplicationTime: newTime,
                          }));
                        }}

                        ampm={false}
                        renderInput={(params) => <TextField {...params} placeholder="hh:mm" />}
                        sx={{
                          marginBottom: "0.5rem",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "lightgray !important",
                            borderWidth: "1px ",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black!important",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black !important",
                          },
                          "& .MuiInputBase-input": {
                            color: "black",
                          },
                          "& .MuiInputLabel-root": {
                            color: "gray !important",
                          },
                          "& .MuiOutlinedInput-root": {
                            width: "105px !important",
                            height: "40px !important",
                          },
                          "& .MuiInputBase-root": {
                            height: "100%",
                          },
                          "& .MuiPickersClock-pin": {
                            backgroundColor: "black",
                          },
                          "& .MuiPickersClockPointer-pointer": {
                            backgroundColor: "black",
                          },
                          "& .MuiIconButton-root": {
                            padding: "8px",
                            "& .MuiSvgIcon-root": {
                              fill: "black",
                              fontSize: "1rem",
                            },
                          },
                          "& .MuiTypography-body2": {
                            fontSize: "0.8rem",
                          },
                          "& .MuiPaper-root": {
                            overflowY: "hidden ",
                          },
                          marginTop: "9px",
                        }}

                    />
                  </LocalizationProvider>
                </Grid>


              </Box>
            </Grid>

                  <Grid
                      container
                      direction="row"
                      justifyContent="start"
                      alignItems="center"
                      sx={{ mt: 2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                      {(announcementDetails.workHours) && <CheckCircleIcon
                          sx={{
                            ml: -4,
                            color: "green"
                          }} />}
                      <WorkHistoryOutlinedIcon
                          sx={{
                            color: announcementDetails.workHours ? "green" : ""
                          }} />

                      <Divider orientation="vertical" variant="middle" color={(announcementDetails.workHours) ? "success" : ""} flexItem
                               sx={{ mx: 2 }} />
                      <Typography>Weekly Work Hours:</Typography>
                      <TextField
                          id="outlined-select-currency"
                          name="workHours"
                          select
                          value={announcementDetails.workHours}
                          size="small"
                          sx={{ width: 225 }}
                          onChange={handleInput}
                      >
                        {WorkHour && WorkHour.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Grid>
                </>

            )}

            {activeStep === 1 && (<>
              <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  sx={{
                    mt: 2,
                    padding: "1rem 0"
                  }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>

                <AbcIcon />
                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }}
                />

                <Grid item container direction="row" alignItems="center" sx={{ width: "fit-content" }}>
                  <Typography>Minimum Desired Letter Grade For {courseCode}</Typography>
                  <div className="toggler">
                    <input
                        id="toggler-1"
                        name="toggler-1"
                        type="checkbox"
                        value="1"
                        checked={announcementDetails.isDesiredLetterGradeEnabled}
                        disabled

                    />
                    <label htmlFor="toggler-1" className={announcementDetails.isDesiredLetterGradeEnabled ? "label-on" : "label-off"}>
                      <svg className={announcementDetails.isDesiredLetterGradeEnabled ? "toggler-on" : "toggler-off"} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        {announcementDetails.isDesiredLetterGradeEnabled ? (
                            <polyline className="path check" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>
                        ) : (
                            <>
                              <line className="path line" x1="34.4" y1="34.4" x2="95.8" y2="95.8"></line>
                              <line className="path line" x1="95.8" y1="34.4" x2="34.4" y2="95.8"></line>
                            </>
                        )}
                      </svg>
                    </label>
                  </div>
                </Grid>


                <TextField
                    id="outlined-select-currency"
                    name="letterGrade"
                    select
                    value={announcementDetails.letterGrade ?? null}
                    size="small"
                    sx={{ width: 225, ml: 1 }}
                    onChange={handleInput}
                    disabled
                >
                  {grades.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                  ))}
                </TextField>

              </Box>
            </Grid>

              <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="flex-start"
                  sx={{
                    mt: 2
                  }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                    <AutorenewIcon />
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />

                    <FormControlLabel
                        value={announcementDetails.isInprogressAllowed}
                        onChange={(event) => {
                          setAnnouncementDetails((prevDetails) => ({
                            ...prevDetails,
                            isInprogressAllowed: event.target.checked,
                          }));
                        }}
                        control={<Checkbox
                            color="success"
                            checked={announcementDetails.isInprogressAllowed}
                        />}
                        label="Allow In Progress Applicants"
                        labelPlacement="start"
                        sx={{ m: 0 }}
                        disabled
                    />

                    <Tooltip
                        title="Selecting this option enables currently enrolled students to submit applications for Learning Assistantship to this course."
                        placement="right"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: '#a4a2a2', // Change to your desired lighter color
                              color: 'rgba(255,255,255,0.87)', // Adjust text color if needed
                              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                              fontSize: '14px'

                            },
                          },
                        }}
                    >
                      <IconButton>
                        <HelpCenterIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                    <AutorenewIcon />
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />
                    <FormControlLabel
                        value={announcementDetails.isNotTakenAllowed}
                        onChange={(event) => {
                          setAnnouncementDetails((prevDetails) => ({
                            ...prevDetails,
                            isNotTakenAllowed: event.target.checked,
                          }));
                        }}
                        control={<Checkbox
                            color="success"
                            checked={announcementDetails.isNotTakenAllowed}
                        />}
                        label="Allow Not Taken Applicants"
                        labelPlacement="start"
                        sx={{ m: 0 }}
                        disabled
                    />

                    <Tooltip
                        title="Selecting this option enables not taken students to submit applications for Learning Assistantship to this course."
                        placement="right"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: '#a4a2a2', // Change to your desired lighter color
                              color: 'rgba(255,255,255,0.87)', // Adjust text color if needed
                              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                              fontSize: '14px'

                            },
                          },
                        }}
                    >
                      <IconButton>
                        <HelpCenterIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                </Box>
              </Grid>

                  <Grid
                      container
                      direction="row"
                      justifyContent="start"
                      alignItems="flex-start"
                      sx={{
                        mt: 2
                      }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                      <BorderColorOutlinedIcon />

                      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />



                      <TextareaAutosize
                          minRows={3}
                          maxRows={6}
                          name="jobDetails"
                          value={announcementDetails.jobDetails}
                          placeholder="Enter job details..."
                          onChange={handleInput}
                          style={{
                            minWidth: '670px',
                            border: '1px solid #c1c4bc',
                            borderRadius: '5px',
                            padding: '12px',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '15px',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                          }}
                      />

                      <Typography variant="body2" style={{ width: '100%', fontSize: '11px' }}>
                        Remaining Characters: {MAX_WORD_COUNT - announcementDetails.jobDetails.length}
                        <br />
                      </Typography>


                    </Box>


                  </Grid>

                  <Grid
                      container
                      direction="row"
                      justifyContent="start"
                      alignItems="flex-start"
                      sx={{
                        mt: 2
                      }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                      <Groups2OutlinedIcon />

                      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />

                      <Typography sx={{ my: 2, mr: 2 }}>Authorized Instructor(s):</Typography>
                      <Grid
                          item
                          xs={6}
                          direction="column"
                          justifyContent="center"
                          alignItems="flex-center"
                      >
                        <Autocomplete
                            id="controllable-states-demo"
                            options={authUsersList && authUsersList.map((authUser) => {
                              return authUser.authOptionValue;
                            })}
                            filterOptions={filterOptions}
                            value={authValue}
                            inputValue={inputAuthValue}
                            noOptionsText={"No other instructors"}
                            onInputChange={(event, newInputValue) => {
                              if (newInputValue !== null) {
                                setAuthInputValue(newInputValue);
                              }
                            }}
                            onChange={(event, newValue) => {
                              if (newValue !== null) handleAuthAdd(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    multiline
                                    size="small"
                                    sx={{ mb: 2, mt: 1, width: 400 }}
                                />
                            )}
                        />
                      </Grid>

                      <Grid container spacing={1} sx={{ ml: 1 }}>

                        {authPeople &&
                            authPeople.map((authPerson, index) => {

                              console.log('authPerson :>> ', authPerson);
                              return (
                                  <Grid item xs={6} key={index}>
                                    <Chip
                                        key={authPerson.username}
                                        label={authPerson.display_name + (authPerson.username.toLowerCase() === username.toLowerCase() ? " (You)" : "")}
                                        variant="outlined"
                                        avatar={
                                          <Avatar
                                              sx={{
                                                backgroundColor: index % 2 === 0 ? "#6A759C" : "#4D5571"

                                              }}
                                          >
                                            <Typography
                                                fontSize="small"
                                                sx={{ color: "white" }}
                                            >
                                              {authPerson.display_name.split(" ")[0][0].toUpperCase()}
                                            </Typography>
                                          </Avatar>
                                        }
                                        sx={{
                                          width: '100%', justifyContent: 'space-between', minHeight: '2rem',
                                          height: 'fit-content',
                                          '& .MuiChip-label': {
                                            display: 'block',
                                            whiteSpace: 'normal',
                                          },
                                        }}
                                        onDelete={() => handleAuthDelete(authPerson)}
                                        disabled={authPerson.username === username}
                                    />
                                  </Grid>
                              );
                            })}
                      </Grid>
                    </Box>
                  </Grid>

              <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="flex-start"
                  sx={{ my: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150, gap: 1 }}>
                  <SchoolOutlinedIcon />

                  <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />


                  <Typography >Desired Course Grade(s):</Typography>
                  <Grid
                      item
                      xs={6}
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        backgroundColor: (selectedCourses && selectedCourses.length === 0) ? "#FFF" : "#F5F5F5",
                        borderRadius: "5%",
                        marginTop: "0.5rem",
                        marginLeft: "1rem",
                        minWidth: "fit-content"
                      }}
                  >
                    <Grid container justifyContent={selectedCourses.length > 0 ? "center" : "flex-start"}>
                      <Button
                          variant="contained"
                          color="success"
                          onClick={handleClickOpen}
                          sx={{
                            backgroundColor: "#9ADE7B",
                            padding: '4px',
                            width: "0.5rem",
                            '& .MuiButton-startIcon': {
                              marginLeft: 0,
                              fontSize: '1rem',
                            },
                          }}
                          disabled
                      >
                        <AddIcon />
                      </Button>
                    </Grid>


                    <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                      <DialogTitle>New Requirement</DialogTitle>
                      <DialogContent>
                        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="start"
                                alignItems="center"
                            >
                              <Typography>Course Code<span style={{ color: 'red' }}>*</span>:</Typography>

                              <Autocomplete
                                  onBlur={() => {
                                    if (!desiredCourseCode) {
                                      setDesiredCourseCodeValue("")
                                    }

                                  }}
                                  value={desiredCourseCodeValue}
                                  onChange={handleChangeDesired}
                                  filterOptions={filterCourseCodes}
                                  onInputChange={handleDesiredInputChange}
                                  label="course"
                                  selectOnFocus
                                  clearOnBlur
                                  handleHomeEndKeys
                                  id="free-solo-with-text-demo"
                                  options={desiredCourseList}
                                  getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                      return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                      return option.inputValue;
                                    }
                                    // Regular option
                                    return option.title;
                                  }}
                                  renderOption={(props, option) => <li {...props}>{option.title}</li>}
                                  sx={{ width: 'fit-content', marginRight: "1rem" }}
                                  freeSolo
                                  renderInput={(params) => (
                                      <TextField
                                          {...params}

                                          multiline
                                          size="small"
                                          onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                              event.preventDefault();
                                            }
                                          }}
                                          error={courseCodeValid(desiredCourseCodeValue)}
                                          helperText={courseCodeValid(desiredCourseCodeValue) ? "Coursecode should have letters followed by single space followed by digits: XXX 123" : ""}

                                          onKeyPress={(event) => {
                                            const key = event.key;
                                            const regex = /^[A-Za-z0-9\ ]+$/;

                                            if (!regex.test(key) && key !== 'Enter') {
                                              event.preventDefault();
                                            } else {
                                              setDesiredCourseCode("")
                                            }

                                          }}
                                          sx={{
                                            mx: 2, mt: 1, mb: 2, width: 300,
                                            ...(params.disabled && {
                                              backgroundColor: 'transparent',
                                              color: 'inherit',
                                              pointerEvents: 'none',
                                            }),
                                          }}
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                  {params.InputProps.endAdornment}
                                                  {desiredCourseCode && (
                                                      <IconButton
                                                          onClick={handleDesiredCourseCodeDelete}
                                                          aria-label="Clear"
                                                          size="small"
                                                      >
                                                        <ClearIcon />
                                                      </IconButton>
                                                  )}
                                                </>
                                            ),
                                          }}
                                      />
                                  )}
                                  disableClearable
                              />


                            </Grid>
                          </FormControl>
                          <FormControl sx={{ m: 1, minWidth: 120 }}>

                            <Grid
                                container
                                direction="row"
                                justifyContent="start"
                                alignItems="center"
                            >
                              <Typography> Minimum Desired Letter Grade</Typography>
                              <TextField
                                  id="outlined-select-currency"
                                  name="letterGrade"
                                  select
                                  value={desiredLetterGrade}
                                  size="small"
                                  sx={{ m: 2, width: 225 }}
                                  onChange={(event) => {
                                    setDesiredLetterGrade(event.target.value)
                                  }}
                              >
                                {grades.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                ))}
                              </TextField>

                            </Grid>


                          </FormControl>
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="start"
                                alignItems="center"
                            >
                              <FormControlLabel
                                  value={isInprogressAllowed}
                                  onChange={(_) => {
                                    setIsInprogressAllowed((prev) => !prev)
                                  }}


                                  control={<Checkbox

                                  />}
                                  label="Allow In Progress Applicants"
                              />
                              <Tooltip
                                  title="Selecting this option enables currently enrolled students to submit applications for Learning Assistantship."
                                  placement="right"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        backgroundColor: '#a4a2a2', // Change to your desired lighter color
                                        color: 'rgba(255,255,255,0.87)', // Adjust text color if needed
                                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                        fontSize: '14px'

                                      },
                                    },
                                  }}

                              >
                                <IconButton>
                                  <HelpCenterIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </FormControl>

                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="start"
                                alignItems="center"
                            >
                              <FormControlLabel
                                  value={isNotTakenAllowed}
                                  onChange={(_) => {
                                    setIsNotTakenAllowed((prev) => !prev)
                                  }}
                                  control={<Checkbox
                                  />}
                                  label="Allow Applicants Who Have Not Taken"
                              />
                              <Tooltip
                                  title="Selecting this option enables not taken students to submit applications for Learning Assistantship."
                                  placement="right"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        backgroundColor: '#a4a2a2', // Change to your desired lighter color
                                        color: 'rgba(255,255,255,0.87)', // Adjust text color if needed
                                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                        fontSize: '14px'

                                      },
                                    },
                                  }}

                              >
                                <IconButton>
                                  <HelpCenterIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            {error && <Alert severity="error">{error}</Alert>}
                          </FormControl>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => {
                          handleAdd();
                        }}>Add</Button>
                      </DialogActions>
                    </Dialog>
                    {selectedCourses.length > 0 && <Table>

                      <TableBody>

                        {selectedCourses.map((courseSelected, i) => (
                            <TableRow key={courseSelected.courseCode}>
                              <TableCell>
                                <Chip
                                    label={courseSelected.courseCode}
                                    variant="outlined"
                                    avatar={
                                      <Avatar
                                          sx={{
                                            backgroundColor: i % 2 === 0 ? "#5FB3F6" : "#2196F3",
                                          }}
                                      >
                                        <Typography fontSize="small" sx={{ color: "white" }}>
                                          {
                                            courseSelected.courseCode.slice(0, 2)}
                                        </Typography>
                                      </Avatar>
                                    }
                                />
                              </TableCell>
                              <TableCell>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Chip
                                      label={courseSelected.grade}
                                      color={getColorForGrade(courseSelected.grade)}
                                      sx={{
                                        backgroundColor: 'white',
                                        fontWeight: 'bold',
                                        marginRight: '8px',
                                        width: '3rem'
                                      }}
                                      variant="outlined"
                                  />
                                  {<UseNumberInputCompact
                                      index={grades.findIndex((grade) => grade.label === courseSelected.grade)}
                                      grade={courseSelected.grade} courseCode={courseSelected.courseCode}
                                      callback={updateGrade} />
                                  }
                                </div>


                              </TableCell>
                              <TableCell>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <FiberManualRecordIcon

                                      sx={{
                                        cursor: "pointer",
                                        color: courseSelected.isInprogressAllowed ? 'green' : 'red',
                                        marginRight: 1,
                                      }}
                                  />
                                  {/* TODO do not enter static values */}
                                  <Typography width={`${"Allowed In Progress Applicants".length * 8}px`} variant="body2"
                                              color={courseSelected.isInprogressAllowed ? 'textPrimary' : 'error'}>
                                    {(courseSelected.isInprogressAllowed ? 'Allowed In Progress Applicants' : 'Not Allowed In Progress Applicants')}
                                  </Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <FiberManualRecordIcon

                                      sx={{
                                        cursor: "pointer",
                                        color: courseSelected.isNotTakenAllowed ? 'green' : 'red',
                                        marginRight: 1,
                                      }}
                                  />
                                  {/* TODO do not enter static values */}
                                  <Typography width={`${"Allowed Applicants Who Have Not Taken".length * 8}px`} variant="body2"
                                              color={courseSelected.isNotTakenAllowed ? 'textPrimary' : 'error'}>
                                    {(courseSelected.isNotTakenAllowed ? 'Allowed Not Taken Applicants' : 'Not Allowed Not Taken Applicants')}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip
                                    label="Delete"
                                    color="error"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleCourseDelete(courseSelected.courseCode)}
                                />
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>}
                  </Grid>

                </Box>
              </Grid></>)}

            </Grid>
          </Grid>

        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
          {(activeStep === 2) && (
              <Grid item sx={{ mb: -7,ml: -5}}> {/* Adjust the value as needed */}
                <EditQuestion
                    AnnouncementDetails={announcementDetails}
                    userDetails={UserDetails}
                    postID={id}
                    username={userName}
                />
              </Grid>
          )}
        </Grid>  <Grid container xs={6} sx={{ backgroundColor: "none", mt: 2 }}>

        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={(theme) => ({
                mr: 1,
                border: '1px solid',
                borderColor: activeStep === 0 ? '#d3d3d3' : 'black', // Lighter gray when disabled, black when not
                borderRadius: '4px',
              })}
          >
            Back
          </Button>

          {activeStep !== steps.length - 1 && <Button
              onClick={handleComplete}
              disabled={
                  activeStep === 0 &&
                  (
                      (Object.keys(announcementDetails.term).length < 0) ||
                      (courseCode ?? "").trim() === "" ||
                      !announcementDetails.workHours ||
                      !(announcementDetails.lastApplicationDate && announcementDetails.lastApplicationTime)
                  )
              }
              sx={(theme) => ({
                border: '1px solid',
                borderColor: (
                    activeStep === 0 &&
                    (
                        (Object.keys(announcementDetails.term).length < 0) ||
                        (courseCode ?? "").trim() === "" ||
                        !announcementDetails.workHours ||
                        !(announcementDetails.lastApplicationDate && announcementDetails.lastApplicationTime)
                    )
                ) ? '#d3d3d3' : 'black', // Lighter gray when disabled, black when not
                borderRadius: '4px',
              })}
          >
             Continue

          </Button>}
        </Box>
      </Grid>
      </Box>
    </Box>
  );
}

export default EditAnnouncement;
