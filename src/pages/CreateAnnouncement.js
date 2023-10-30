import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AppBarHeader from "../components/AppBarHeader";
import Sidebar from "../components/Sidebar";
import AddQuestion from "../components/AddQuestion";
import { Typography, Box, Grid } from "@mui/material";
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
import { getAllInstructors, getAllCourses } from "../apiCalls";

function CreateAnnouncement() {
  const grades = [
    { value: "A", label: "A" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B", label: "B" },
    { value: "B-", label: "B-" },
    { value: "C+", label: "C+" },
    { value: "C", label: "C" },
    { value: "C-", label: "C-" },
    { value: "D", label: "D" },
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
  

  const userName = useSelector((state) => state.user.username);

  const term = useSelector((state) => state.user.term);
  console.log('yasin: ', term)
  //const userName = "instructor1"; //mock data for testing

  const [authUsersList, setAuthUserList] = useState([]); //get instructors from database
  const [authPeople, setAuthPeople] = useState([]); //used for send request as selected from list
  const [authValue, setAuthValue] = useState(""); // for autocomplete
  const [inputAuthValue, setAuthInputValue] = useState(""); // for autocomplete

  const [courseCodeList, setCourseCodeList] = useState([]); //get course codes from database
  const [courseList, setcourseList] = useState([]); //get courses from database

  const [courseCode, setCourseCode] = useState(""); //used for send request as selected from list to course code
  const [courseCodeValue, setCourseCodeValue] = useState(""); // for autocomplete
  const [inputCourseCodeValue, setCourseCodeInputValue] = useState(""); // for autocomplete

  const [selectedCourses, setSelectedCourses] = useState([]); //used for send request as selected from list to desired courses
  const [courseValue, setCourseValue] = useState(""); // for autocomplete
  const [inputCourseValue, setCourseInputValue] = useState(""); // for autocomplete

  //get all instructors
  useEffect(() => {
    getAllInstructors().then((results) => {
      const filteredResults = results.filter((instructor) => { //for removing current user from options
        return instructor.instructor_username !== userName;
      });

      const transformedResults = filteredResults.map((instructor) => {
        const lastName = instructor.user.surname
        const firstName = instructor.user.name
        const displayName = firstName.trim() + " " + lastName.trim();
        const OptionValue = displayName + " (" + instructor.user.email + ")";

        return {
          display_name: displayName,
          username: instructor.email,
          authOptionValue: OptionValue,
          id: instructor.user.id
        };
      });
      setAuthUserList(transformedResults);
    });
  }, []);

  // get all courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAllCourses();
        const [courseCodes, courseTitles] = results.reduce(
          (acc, course) => {
            acc[0].push(course.courseCode);
            acc[1].push(course.courseTitle);
            return acc;
          },
          [[], []]
        );
  
        setCourseCodeList(courseCodes);
        setcourseList(courseCodes);
      } catch (error) {
        // Handle errors here, e.g., log or show an error message.
        console.error('Error fetching courses:', error);
      }
    };
  
    fetchData();
  }, []);
  

  //console.log(authUsersList);
  //console.log(courseList);

  // console.log(courseCode)
  // console.log(courseCodeValue)
  // console.log(inputCourseCodeValue)

  //used in autocomplete for keeping value and input value
  function handleAuthAdd(newValue) {
    if (newValue !== null) {
      const selectedUser = authUsersList.find(
        (user) => user.authOptionValue === newValue
      );
      setAuthPeople([...authPeople, selectedUser]);
    }
    setAuthValue("");
    setAuthInputValue("");
  }

  function handleAuthDelete(userToDelete) {
    const updatedAuthPeople = authPeople.filter(
      (user) => user.username !== userToDelete.username
    );
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

  console.log(authPeople) //for debugging authPeople

  //used in autocomplete for keeping value and input value
  function handleCourseCodeAdd(newValue) { //change here
    if (newValue !== null) {
      const selectedCourseCode = courseCodeList.find((course) => course === newValue);
      updateCourseCode(selectedCourseCode)
      setSelectedCourses([...selectedCourses, selectedCourseCode]);
    }
    // setCourseCodeValue("");
    // setCourseCodeInputValue("");
  }

  function updateCourseCode(courseCode){
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

  function filterCourseCodes(optionCourseCodes, { inputValue }) {
    const filtered = optionCourseCodes.filter((option) => {
      if (courseCode === option) {
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
      (course) => course !== courseToDelete
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

  const [announcementDetails, setAnnouncementDetails] = useState({
    course_code: courseCode,
    lastApplicationDate: new Date().toLocaleDateString("en-CA"),
    lastApplicationTime: new Date()
      .toLocaleTimeString()
      .replace(/(.*)\D\d+/, "$1"),
    letterGrade: "A",
    workHours: "5 Hours",
    jobDetails: "",
    authInstructor: authPeople,
    desiredCourses: selectedCourses,
  });

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
    setAnnouncementDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  console.log(announcementDetails) //for debugging announcement details
  console.log(courseCode.length) //for debugging announcement details

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <AppBarHeader />
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4, mt: 2 }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Create Announcement
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              variant="h5"
              sx={{
                textDecoration: "underline",
                marginY: 2,
                fontWeight: "bold",
              }}
            >
              Announcement Details:
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
            >
              <Typography>Course Code<span style={{ color: 'red' }}>*</span>:</Typography>
              {/* <TextField
                id="outlined-required"
                name="course_code"
                label="Enter course code"
                variant="outlined"
                size="small"
                multiline
                maxRows={20}
                sx={{ m: 2, width: 350 }}
                value={announcementDetails.course_code}
                onChange={handleInput}
              /> */}
              <Autocomplete
                id="controllable-states-demo"
                options={courseList && courseList.map((course) => {
                  return course;
                })}
                filterOptions={filterCourseCodes}
                value={courseCodeValue}
                inputValue={inputCourseCodeValue}
                onInputChange={(event, newInputCourseCodeValue) => {
                  if (newInputCourseCodeValue !== null) {
                    setCourseCodeInputValue(newInputCourseCodeValue);
                  }
                }}
                onChange={(event, newCourseCodeValue) => {
                  if (newCourseCodeValue !== null) {
                    setCourseCodeValue(newCourseCodeValue);
                    //handleCourseCodeAdd(newCourseCodeValue);
                    updateCourseCode(newCourseCodeValue)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    multiline
                    size="small"
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
                //getOptionDisabled={(option) => !!courseCode && option !== courseCode}
              />
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
            >
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
                sx={{ m: 2 }}
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
                sx={{ m: 2 }}
                onChange={handleInput}
              />
            </Grid>
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
                value={announcementDetails.letterGrade}
                size="small"
                sx={{ m: 2, width: 225 }}
                onChange={handleInput}
              >
                {grades.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="center"
            >
              <Typography>Weekly Work Hours<span style={{ color: 'red' }}>*</span>:</Typography>
              <TextField
                id="outlined-select-currency"
                name="workHours"
                select
                value={announcementDetails.workHours}
                size="small"
                sx={{ m: 2, width: 225 }}
                onChange={handleInput}
              >
                {WorkHour && WorkHour.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="flex-start"
            >
              <Typography paddingTop={3}>Job Details<span style={{ color: 'red' }}>*</span>:</Typography>
              <TextField
                placeholder="Enter Job Details..."
                name="jobDetails"
                value={announcementDetails.jobDetails}
                multiline
                size="small"
                rows={5}
                maxRows={20}
                sx={{ m: 2, width: 400 }}
                onChange={handleInput}
                required
              />
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="flex-start"
            >
              <Typography sx={{ my: 2 }}>Authorized Instructor(s):</Typography>
              <Grid
                item
                xs={6}
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
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
                      sx={{ mx: 2, mt: 1, mb: 2, width: 300 }}
                    />
                  )}
                />
                {authPeople &&
                  authPeople.map((authPerson, index) => {
                    return (
                      <Chip
                        key={authPerson.username}
                        label={authPerson.display_name}
                        variant="outlined"
                        avatar={
                          <Avatar
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#6A759C" : "#4D5571",
                            }}
                          >
                            <Typography
                              fontSize="small"
                              sx={{ color: "white" }}
                            >
                              {authPerson.display_name.split(" ")[0][0]}
                            </Typography>
                          </Avatar>
                        }
                        sx={{ m: 1 }}
                        onDelete={() => handleAuthDelete(authPerson)}
                      />
                    );
                  })}
              </Grid>
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
                alignItems="flex-start"
                sx={{ backgroundColor: (selectedCourses && selectedCourses.length === 0) ? "#FFF" : "#F5F5F5" }}
              >
                <Autocomplete
                  id="controllable-states-demo"
                  options={courseList && courseList.map((course) => {
                    return course;
                  })}
                  filterOptions={filterCourses}
                  value={courseValue}
                  inputValue={inputCourseValue}
                  onInputChange={(event, newInputCourseValue) => {
                    if (newInputCourseValue !== null) {
                      setCourseInputValue(newInputCourseValue);
                    }
                  }}
                  onChange={(event, newCourseValue) => {
                    if (newCourseValue !== null) handleCourseAdd(newCourseValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      multiline
                      size="small"
                      sx={{ mx: 2, mt: 1, mb: 2, width: 300 }}
                    />
                  )}
                  disabled={courseCode && courseCode.length === 0} //if it creates some problems, delete it.
                />
                {selectedCourses &&
                  selectedCourses.map((courseSelected, i) => {
                    return (
                      <Chip
                        key={courseSelected}
                        label={courseSelected}
                        variant="outlined"
                        avatar={
                          <Avatar
                            sx={{
                              backgroundColor:
                                i % 2 === 0 ? "#5FB3F6" : "#2196F3",
                            }}
                          >
                            <Typography fontSize="small" sx={{ color: "white" }}>
                              {courseSelected.split(" ")[0][0]}
                            </Typography>
                          </Avatar>
                        }
                        color={courseSelected === courseCode ? "error" : "default"}
                        sx={{ m: 1 }}
                        onDelete={() => handleCourseDelete(courseSelected)}
                      />
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <AddQuestion AnnouncementDetails={announcementDetails} username={userName} />
      </Box>
    </Box>
  );
}

export default CreateAnnouncement;
