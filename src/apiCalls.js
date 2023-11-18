import axios from "axios";
import { async } from "q";
import handleError from "./errors/GlobalErrorHandler.jsx"

const url = window.location.href;
var apiEndpoint = "http://pro2-dev.sabanciuniv.edu/api";
if (url.indexOf("pro2") === -1) {
  apiEndpoint = "http://localhost:8080/api/v1"; //http://localhost:8080/api/v1/applications
}
// const apiEndpoint = "http://pro2-dev.sabanciuniv.edu/api";
// const apiEndpoint = "http://localhost:8000/api";

async function applyToPost(postId, userID, answers) {
  try {
    var bodyFormData = new FormData();
    /*bodyFormData.append("student_username", username);
    bodyFormData.append("working_hours", 10);
    bodyFormData.append("post_id", postId);
    bodyFormData.append("answers", JSON.stringify(answers));
    bodyFormData.append("status", "applied");
    bodyFormData.append("grade", 0);
    bodyFormData.append("faculty", "-");
    bodyFormData.append("transcript", transcript);*/
    const results = await axios.post(
      apiEndpoint + "/applicationRequest",
      { applicationId: postId, studentId: userID, answers: answers },
      { headers: { "Content-Type": "application/json" } }
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function getAnnouncement(id) {
  try {
    console.log(id);
    const results = await axios.get(`${apiEndpoint}/applications/${id}`);
    console.log(results);
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllAnnouncements() {
  try {
    const results = await axios.get(apiEndpoint + "/applications");
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllInstructors() {
  try {
    const results = await axios.get(apiEndpoint + "/users/instructors");
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllAnnouncementsOfInstructor(id) {
  try {
    const results = await axios.get(apiEndpoint + "/applications/instructor/" + id);
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllCourses() {
  try {
    const results = await axios.get(apiEndpoint + "/courses");
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
async function addAnnouncement(
  course_code,
  username,
  lastApplicationDate,
  lastApplicationTime,
  letterGrade,
  workHours,
  details,
  auth_instructors,
  desired_courses,
  questions,
  term
) {
  //const mockUserName = "instructor1";
  const faculty = "FENS";
  // const term = "Fall 2022";
  const title = "title add test";
  const deadline = formatDate(lastApplicationDate) + " " + lastApplicationTime;
  const transformedQuestions = questions.map((question) => (
    question.mQuestion
    //   {
    //   type: question.mValue,
    //   ranking: question.questionNumber,
    //   question: question.mQuestion,
    //   multiple_choices: question.mValue === "Multiple Choice" ? question.mMultiple : [],
    // }

  ));
  console.log(letterGrade);
  const authInstructor_ids = auth_instructors.map(
    (user) => user.id
  );

  try {
    const response = await axios.post(apiEndpoint + "/applications", {
      //instructor_username: username,
      //faculty: faculty,
      courseCode: course_code,
      //desired_courses: desired_courses,
      lastApplicationDate: deadline,
      term: term.term_desc,
      //title: title,
      weeklyWorkHours: workHours,
      jobDetails: details,
      authorizedInstructors: authInstructor_ids,
      minimumRequiredGrade: letterGrade,
      desiredCourseGrade: letterGrade,
      questions: transformedQuestions,
      previousCourseGrades: []
    });

    return response.data;
    // Handle the successful response here
  } catch (error) {

    return handleError(error);
    
  }
}

function updateAnnouncement(
  id,
  username,
  course_code,
  lastApplicationDate,
  lastApplicationTime,
  letterGrade,
  workHours,
  details,
  auth_instructors,
  desired_courses,
  questions,
  term,
) {
  const faculty = "FENS";
  // const term = "Fall 2022";
  const title = "title update test";

  const deadline = formatDate(lastApplicationDate) + " " + lastApplicationTime;
  const transformedQuestions = questions.map((question) => ({
    type: question.mValue,
    ranking: question.questionNumber,
    question: question.mQuestion,
    multiple_choices:
      question.mValue === "Multiple Choice" ? question.mMultiple : [],
  }));
  console.log(desired_courses);
  const authInstructor_ids = auth_instructors.map(
    (user) => user.id
  );
  try {
    axios.put(apiEndpoint + "/applications/" + id, {
      //instructor_username: username,
      //faculty: faculty,
      courseCode: course_code,
      minimumRequiredGrade: letterGrade,
      //desired_courses: desired_courses,
      lastApplicationDate: deadline,
      term: term.term_desc,
      //title: title,
      weeklyWorkHours: "PT10H",
      jobDetails: details,
      authorizedInstructors: authInstructor_ids,
      desiredCourseGrade: letterGrade,
      questions: transformedQuestions,
      previousCourseGrades: [],
    });
  } catch (error) {
    return handleError(error)
  }

}

async function getApplicationsByPost(postID) {
  try {
    const results = await axios.get(
      apiEndpoint + "/listPostApplication/" + postID
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function getApplicationByUsername(username) {
  try {
    const results = await axios.get(
      apiEndpoint + "/listStudentApplication/" + username
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function getApplicationRequestsByStudentId(studentId) {
  try {
    const results = await axios.get(
      apiEndpoint + "/applicationRequest/student/" + studentId
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function getApplicationRequestsByApplicationId(applicationId) {
  try {
    const results = await axios.get(
      apiEndpoint + "/applications/" + applicationId +"/applicationRequests"
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function updateApplicationById(
  applicationId,
  username,
  grade,
  faculty,
  working_hours,
  status = "Applied",
  post_id,
  answers,
  transcript
) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append("student_username", username);
    bodyFormData.append("working_hours", working_hours);
    bodyFormData.append("post_id", post_id);
    bodyFormData.append("answers", JSON.stringify(answers));
    bodyFormData.append("status", status);
    bodyFormData.append("grade", 0);
    bodyFormData.append("faculty", "-");
    bodyFormData.append("transcript", transcript);
    console.log(transcript);
    const results = await axios.post(
      apiEndpoint + "/updateApplication/" + applicationId,
      bodyFormData, { headers: { "Content-Type": "multipart/form-data" } }
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function validateLogin(serviceUrl, ticket) {
  try {
    // Check if serviceUrl is a valid URL
    const isValidUrl = isValidURL(serviceUrl);

    if (!isValidUrl) {
      throw new Error("The service URL is not valid.");
    }

    const result = await axios.post(apiEndpoint + "/auth/authentication", {
      serviceUrl: serviceUrl,
      ticket: ticket,
    });

    console.log(result.data);
    return result.data;
  } catch (error) {
    return handleError(error);
  }
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    //return handleError(error);
    return false;
  }
}


async function getTranscript(applicationId) {
  try {
    const result = await axios.get(apiEndpoint + "/applicationTranscript/" + applicationId, {
      responseType: 'blob'
    });
    return result.data;
  } catch (error) { return handleError(error); }

}

async function getTerms() {
  try {
    const result = await axios.get(apiEndpoint + "/terms", {
      headers: { "Authorization": "Basic dGVybXNfYXBpOmF5WV8zNjZUYTE=" }
    });
    return result.data;
  } catch (error) { return handleError(error); }

}

async function logout(token) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const response = await axios.get(apiEndpoint + "/auth/logout", { headers });


    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function postTranscript(formData) {
  try {
    const result = await axios.post(apiEndpoint + "/transcript/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return result.data;
  } catch (error) { return handleError(error); }

}

async function getCurrentTranscript(studentId) {
  try {
    const result = await axios.get(apiEndpoint + "/transcript/get-current-transcript/" + studentId);
    return result.data;
  } catch (error) {  }
}




export {
  getAllAnnouncements,
  getAllInstructors,
  getAllCourses,
  applyToPost,
  addAnnouncement,
  updateApplicationById,
  getAnnouncement,
  updateAnnouncement,
  getApplicationsByPost,
  getApplicationByUsername,
  validateLogin,
  getTranscript,
  getTerms,
  logout,
  getApplicationRequestsByStudentId,
  getAllAnnouncementsOfInstructor,
  postTranscript,
  getApplicationRequestsByApplicationId,
  getCurrentTranscript
};
