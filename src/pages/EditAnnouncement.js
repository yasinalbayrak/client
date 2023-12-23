import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import EditQuestion from "../components/EditQuestion";
import { Typography, Box, Grid, InputAdornment } from "@mui/material";
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
import { getTerms, getAnnouncement, getAllInstructors, getAllCourses } from "../apiCalls";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import UseNumberInputCompact from '../components/IncDec'
import { flipShowTerms } from "../redux/userSlice";
import Alert from '@mui/material/Alert';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import BackButton from "../components/buttons/BackButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Tooltip from "@mui/material/Tooltip";

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
  const grades = [
    {value: "A", label: "A"},
    {value: "A-", label: "A-"},
    {value: "B+", label: "B+"},
    {value: "B", label: "B"},
    {value: "B-", label: "B-"},
    {value: "C+", label: "C+"},
    {value: "C", label: "C"},
    {value: "C-", label: "C-"},
    {value: "D+", label: "D+"},
    {value: "D", label: "D"},
    {value: "S", label: "S"},
    {value: "W", label: "W"},
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
  const authUsers = [
    { display_name: "Murat Karaca", username: "muratkaraca" },
    { display_name: "Taner Dincer", username: "tanerd" },
    { display_name: "Melih Gursoy", username: "melihg" },
    { display_name: "Baha Ersoy", username: "bersoy" },
    { display_name: "Cem Kaya", username: "cemkaya" },
  ];

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
  const [desiredCourseCode, setDesiredCourseCode] = useState("");
  const [desiredCourseList, setDesiredCourseList] = useState([]); //get courses from database
  const [desiredCourseCodeValue, setDesiredCourseCodeValue] = useState(""); // for autocomplete
  const [desiredCourseCodeInputValue, setDesiredCourseCodeInputValue] = useState(""); // for autocomplete
  const [error, setError] = React.useState(false);
  const [announcementTerm, setAnnouncementTerm] = useState(null);
  const [termSelect, setTermSelect] = React.useState(term);
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
          isInprogressAllowed: isInprogressAllowed
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
          isInprogressAllowed: results.isInprogressAllowed
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

  console.log('termSelect :>> ', termSelect);
  if (!announcementDetails || !termSelect) return (<div>Loading...</div>);
  console.log('announcementDetails :>> ', announcementDetails);
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <BackButton to={"/home"} />
        <AppBarHeader />
        <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Edit Announcement
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ textDecoration: "underline", marginY: 2, fontWeight: "bold" }}>
              Announcement Details:
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
              marginY={2}
            >


              <Box sx={{ minWidth: 150 }}>
                <Typography>Term<span style={{ color: 'red' }}>*</span>:</Typography>
                <FormControl fullWidth>

                  <Select
                    labelId="demo-simple-select-label"
                    disabled
                    id="demo-simple-select"
                    value={termSelect}
                    name="term"
                    sx={{ minWidth: 150, mt: 2 }}
                    MenuProps={{
                      style: { maxHeight: '360px' },
                      autoFocus: false
                    }}
                    onChange={handleTermSelect}
                    defaultValue={termSelect}
                  >
                    {allTerms.map((eachTerm) => (
                      <MenuItem
                        key={eachTerm.term_code}
                        value={eachTerm}
                        sx={{ maxHeight: '360px' }}
                        className={
                          eachTerm.is_active === '1'
                            ? classes.activeItem
                            : ''
                        }
                      >
                        {eachTerm.term_desc}
                      </MenuItem>

                    ))}
                  </Select>

                </FormControl>
              </Box>
            </Grid>
            <Grid container direction="row" justifyContent="start" alignItems="center">
              <Box sx={{ minWidth: 150 }}>
                <Typography>Course Code<span style={{ color: 'red' }}>*</span>:</Typography>

                <Autocomplete
                  value={courseCodeValue}
                  onChange={handleChange}
                  filterOptions={filterCourseCodes}
                  disabled
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
                  sx={{ width: 300, ml: -2 }}
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
                      onKeyPress={(event) => {
                        const key = event.key;
                        const regex = /^[A-Za-z0-9]+$/;

                        if (!regex.test(key) && key !== 'Enter') {
                          event.preventDefault();
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
                            {courseCode && (
                              <IconButton
                                onClick={handleCourseCodeDelete}
                                aria-label="Clear"
                                size="small"
                                disabled
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
                  getOptionDisabled={(option) => !!courseCode && option !== courseCode}
                />



              </Box>
            </Grid>
            <Grid container direction="row" justifyContent="start" alignItems="center">
              <Box sx={{ minWidth: 150 }}>
                <Typography>Last Application Date<span style={{ color: 'red' }}>*</span>:</Typography>
                <TextField
                  id="outlined-required"
                  name="lastApplicationDate"
                  label="Enter last date"
                  variant="outlined"
                  type="date"
                  value={announcementDetails.lastApplicationDate}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ mt: 2 }}
                  onChange={handleInput}
                />
                <TextField
                  id="outlined-required"
                  name="lastApplicationTime"
                  label="Enter deadline"
                  variant="outlined"
                  type="time"
                  value={announcementDetails.lastApplicationTime}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ mt: 2, ml: 2 }}
                  onChange={handleInput}
                />
              </Box>
            </Grid>
            <Grid container direction="row" justifyContent="start" alignItems="center">
              <Box sx={{ minWidth: 150, mt: 2 }}>
                <Typography> Minimum Desired Letter Grade<span style={{ color: 'red' }}>*</span>:</Typography>
                <TextField
                  id="outlined-select-currency"
                  name="letterGrade"
                  select
                  value={announcementDetails.letterGrade ?? null}
                  size="small"
                  sx={{ mt: 2, width: 225 }}
                  onChange={handleInput}
                >
                  {grades.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                 <FormControlLabel
                   
                    value={announcementDetails.isInprogressAllowed}
                    onChange={(event) => {

                      console.log('event :>> ', event);
                      setAnnouncementDetails((prevDetails) => ({
                        ...prevDetails,
                        isInprogressAllowed: event.target.checked, 
                      }));
                    }}
                    control={ <Checkbox 
                      checked={announcementDetails.isInprogressAllowed}/>}
                    
                    label="Allow In Progress Applicants"
                    sx={{mt: 2, ml: 2}}
                />

                <Tooltip
                    title="By checking this box, you allow students who currently taking this course to apply to be a LA."
                    placement="right"
                    sx={{marginLeft: -1, marginTop:2}}
                >
                  <IconButton>
                    <HelpCenterIcon/>
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid container direction="row" justifyContent="start" alignItems="center">
              <Box sx={{ minWidth: 150, mt: 2 }}>
                <Typography>Weekly Work Hours<span style={{ color: 'red' }}>*</span>:</Typography>
                <TextField
                  id="outlined-select-currency"
                  name="workHours"
                  select
                  value={announcementDetails.workHours ?? null}
                  size="small"
                  sx={{ mt: 2, width: 225 }}
                  onChange={handleInput}
                >
                  {WorkHour.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
            {<Grid container direction="row" justifyContent="start" alignItems="flex-start">
              <Box sx={{minWidth: 150, mt: 2}}>
                <div style={{display: "block"}}>
                  <Typography paddingTop={3}>Job Details:</Typography>
                </div>
                <div style={{margin: "15px 0", display: "block"}}>
                  <div style={{display: 'flex', flexDirection: 'column', width: '400px', position: 'relative'}}>
                    <TextareaAutosize
                        rows={1}
                        size="small"
                        name="jobDetails"
                        multiline
                        value={announcementDetails.jobDetails}
                        onChange={handleInput}
                        placeholder="Enter the job details..."
                        style={{
                          width: "100%",
                          border: "1px solid #c1c4bc",
                          borderRadius: "5px",
                          padding: "8px",
                          outline: "none",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "15px",
                          resize: "vertical",
                        }}
                    />
                    {announcementDetails.jobDetails !== undefined && (
                        <Typography variant="body2" style={{marginTop: '7px', marginLeft: '3px', width: '100%', fontSize: '11px' }}>
                          Remaining Characters: {MAX_WORD_COUNT - announcementDetails.jobDetails.length}
                          <br/>
                        </Typography>
                    )}
                  </div>
                </div>
              </Box>
            </Grid>}


            <Grid container direction="row" justifyContent="start" alignItems="flex-start">
              <Box sx={{ minWidth: 150, mt: 2 }}>
                <Typography sx={{ my: 2 }}>Authorized Instructor(s):</Typography>
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
                        sx={{ mb: 1, mt: 1, width: 300 }}
                      />
                    )}
                  />
                  <Grid container spacing={1} sx={{ width: '25rem' }}>

                  {authPeople &&
                    authPeople.map((authPerson, index) => {


                      return (
                        <Grid item xs={5} key={index}>
                          <Chip
                            key={authPerson.username}
                            label={authPerson.display_name + (authPerson.username.toLowerCase() === userName.toLowerCase() ? " (You)" : "")}
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
                            sx={{ width: '100%', justifyContent: 'space-between' }}
                            onDelete={() => handleAuthDelete(authPerson)}
                            disabled={authPerson.username === userName}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
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
              <Typography sx={{ my: 2 }}>Desired Course Grade(s):</Typography>
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
                                  mx: 2, mt: 1, mb: 2, width: 150,
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
                          <Typography> Minimum Desired Letter Grade<span style={{ color: 'red' }}>*</span>:</Typography>
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


                            control={<Checkbox />}
                            label="Allow In Progress Applicants"
                          />
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
                            {<UseNumberInputCompact index={grades.findIndex((grade) => grade.label === courseSelected.grade)} grade={courseSelected.grade} courseCode={courseSelected.courseCode} callback={updateGrade} />
                            }
                          </div>


                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FiberManualRecordIcon
                              onClick={() => {


                                setSelectedCourses((prev) => {
                                  return prev.map((course) => {

                                    if (course.courseCode === courseSelected.courseCode) {

                                      return {
                                        ...course,
                                        isInprogressAllowed: !courseSelected.isInprogressAllowed,
                                      };
                                    }
                                    return course;
                                  });
                                });

                              }}
                              sx={{
                                cursor: "pointer",
                                color: courseSelected.isInprogressAllowed ? 'green' : 'red',
                                marginRight: 1,
                              }}
                            />
                            {/* TODO do not enter static values */}
                            <Typography width={`${"IP Not Allowed".length * 8}px`} variant="body2" color={courseSelected.isInprogressAllowed ? 'textPrimary' : 'error'}>
                              {"IP " + (courseSelected.isInprogressAllowed ? 'Allowed' : 'Not Allowed')}
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
            </Grid>
          </Grid>

        </Grid>
        <EditQuestion AnnouncementDetails={announcementDetails} userDetails={UserDetails} postID={id} username={userName} />
      </Box>
    </Box>
  );
}

export default EditAnnouncement;
