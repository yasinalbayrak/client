import axios from "axios";
import handleError from "./errors/GlobalErrorHandler.jsx"

const url = window.location.href;
var apiEndpoint = "http://pro2-dev.sabanciuniv.edu:8080/api/v1";
if (url.indexOf("pro2") === -1) {
  apiEndpoint = "http://localhost:8080/api/v1";
}

function getJwtFromCookie() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf('jwt=') === 0) {
      return cookie.substring('jwt='.length, cookie.length);
    }
  }
  return null;
}


async function applyToPost(postId, userID, answers) {
  try {
    const token = getJwtFromCookie()
    const results = await axios.post(
      apiEndpoint + "/applicationRequest/student" ,
      { applicationId: postId, answers: answers },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      }
    );
    return true;
  } catch (error) {
    try {
      handleError(error);
    }
    catch (e) {
      return false
    }

  }

}

async function getAnnouncement(id) {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(`${apiEndpoint}/applications/${id}`, {
      headers: { "Authorization": "Bearer " + token }
    });

    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllAnnouncements() {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(apiEndpoint + "/applications", {
      headers: { "Authorization": "Bearer " + token }
    });
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllInstructors() {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(apiEndpoint + "/users/instructors", {
      headers: { "Authorization": "Bearer " + token }
    });
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getAllAnnouncementsOfInstructor() {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(apiEndpoint + "/applications/instructor", {
      headers: { "Authorization": "Bearer " + token }
    });
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getTranscriptInfo() {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(apiEndpoint + "/transcript/current-transcript-status", {
      headers: { "Authorization": "Bearer " + token }
    });
    return results.data;
  } catch (error) {
    return handleError(error);
  }
}




async function getAllCourses() {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(apiEndpoint + "/courses", {
      headers: { "Authorization": "Bearer " + token }
    });
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
  term,
  isInprogressAllowed,
  section
) {

  const token = getJwtFromCookie()
  const deadline = formatDate(lastApplicationDate) + " " + lastApplicationTime;

  const transformedQuestions = questions
    .filter((question) => question.mQuestion.trim() !== "")
    .map((question) => {
      let type;

      switch (question.mValue) {
        case "Text Answer":
          type = "TEXT";
          break;
        case "Numeric Answer":
          type = "NUMERIC";
          break;
        case "Multiple Choice":
          type = "MULTIPLE_CHOICE";
          break;
        default:
          type = "TEXT";
      }

      return {
        question: question.mQuestion,
        type: type,
        choices: question.mMultiple,
        allowMultipleAnswers: question.allowMultipleAnswers
      };
    });

  console.log(letterGrade);
  const authInstructor_ids = auth_instructors.map(
    (user) => user.id
  );

  try {
    const response = await axios.post(apiEndpoint + "/applications", {

      courseCode: course_code,
      previousCourseGrades: desired_courses,
      lastApplicationDate: deadline,
      term: term.term_desc,
      //title: title,
      weeklyWorkHours: workHours,
      jobDetails: details,
      authorizedInstructors: authInstructor_ids,
      minimumRequiredGrade: letterGrade,
      desiredCourseGrade: letterGrade,
      questions: transformedQuestions,
      isInprogressAllowed: isInprogressAllowed,
      section: section?.trim()
    }, {
      headers: { "Authorization": "Bearer " + token }
    });

    return response.data;
    // Handle the successful response here
  } catch (error) {

    return handleError(error);

  }
}

async function updateAnnouncement(
  id,
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
  term,
  isInprogressAllowed,
  section
) {
  const token = getJwtFromCookie();
  const faculty = "FENS";
  // const term = "Fall 2022";
  const title = "title update test";
  console.log('isInprogressAllowed :>> ', isInprogressAllowed);
  const deadline = formatDate(lastApplicationDate) + " " + lastApplicationTime;
  console.log(letterGrade);
  const authInstructor_ids = auth_instructors.map(
    (user) => user.id
  );
  try {
    const response = await axios.put(apiEndpoint + "/applications/" + id, {
      //instructor_username: username,
      //faculty: faculty,
      courseCode: course_code,
      previousCourseGrades: desired_courses,
      lastApplicationDate: deadline,
      term: term.term_desc,
      //title: title,
      weeklyWorkHours: workHours,
      jobDetails: details,
      authorizedInstructors: authInstructor_ids,
      minimumRequiredGrade: letterGrade,
      desiredCourseGrade: letterGrade,
      questions: questions,
      isInprogressAllowed: isInprogressAllowed,
      section: section?.trim()
    }, {
      headers: { "Authorization": "Bearer " + token }
    });
    return response.data;
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
    const token = getJwtFromCookie()
    
    const results = await axios.get(
      apiEndpoint + "/applicationRequest/student/" + studentId, {
      headers: { "Authorization": "Bearer " + token }
    }
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function getApplicationRequestsByApplicationId(applicationId) {
  try {
    const token = getJwtFromCookie()
    const results = await axios.get(
      apiEndpoint + "/applications/" + applicationId + "/applicationRequests", {
      headers: { "Authorization": "Bearer " + token }
    }
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
    const token = getJwtFromCookie()
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
      bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + token
        }
    }
    );
    return results.data;
  } catch (error) { return handleError(error); }

}

async function deleteApplicationById(applicationId) {
  try {
    const token = getJwtFromCookie()
    const results = await axios.delete(
      apiEndpoint + "/applications/" + applicationId, {
      headers: { "Authorization": "Bearer " + token }
    }
    );
    return
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
    
    const expiryDays = 1;
    const now = new Date();
    now.setTime(now.getTime() + (expiryDays * 24 * 60 * 60 * 1000)); // 1 day
    const expires = "expires=" + now.toUTCString();
    document.cookie = "jwt=" + result.data.token + ";" + expires + ";path=/";

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
    const result = await axios.get(apiEndpoint + "/transcript/get-transcript-file/" + applicationId);
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
    const token = getJwtFromCookie()
    const result = await axios.post(apiEndpoint + "/transcript/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + token
      }
    });
    return result.data;
  } catch (error) { return handleError(error); }

}

async function getCurrentTranscript(studentId) {
  try {
    const token = getJwtFromCookie()
    const result = await axios.get(apiEndpoint + "/transcript/get-current-transcript/" + studentId, {
      headers: { "Authorization": "Bearer " + token }
    });
    return result.data;
  } catch (error) { }
}

async function getStudentCourseGrades() {
  try {
    const token = getJwtFromCookie()

    const result = await axios.get(apiEndpoint + "/users/previous-grades", {
      headers: { "Authorization": "Bearer " + token }
    });
    return result.data;
  } catch (error) { }
}

async function getCourseGrades(courseIds,studentId) {
  try {
    const token = getJwtFromCookie()
    const result = await axios.post(
      apiEndpoint + "/transcript/course-grades/" + studentId,
      { courses: courseIds },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      }
    );

    return result.data;
  } catch (error) { }

}

async function updateApplicationRequestStatus(applicationRequestId, status) {
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/applicationRequest/" + applicationRequestId + "/status",
      { status: status },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      }
    );

    return result.data;
  } catch (error) { handleError(error) }

}

async function getApplicationRequestById(applicationRequestId) {
  try {
    const token = getJwtFromCookie()
    const result = await axios.get(
      apiEndpoint + "/applicationRequest/" + applicationRequestId, {
      headers: { "Authorization": "Bearer " + token }
    }
    );
    console.log(result.data);
    return result.data;
  } catch (error) { handleError(error) }

}


async function updateApplicationRequest(applicationRequestId, applicationId, studentId, answers) {
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/applicationRequest/student/update/" + applicationRequestId,
      { applicationId: applicationId, answers: answers },
      {
        headers: { "Authorization": "Bearer " + token }
      }

    );

    return true;
  } catch (error) {
    try {
      handleError(error);
    }
    catch (e) {
      return false
    }
  }

}

async function checkStudentEligibility(applicationId) {
  try {
    const token = getJwtFromCookie()
    const result = await axios.post(
      apiEndpoint + "/applicationRequest/student/checkEligibility/" + applicationId,
      {},
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function finalizeStatus(appReqId){
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/applicationRequest/instructor/finalizeStatus/" + appReqId,
      {},
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function getNotifications() {
  try {
    const token = getJwtFromCookie()
    const result = await axios.get(
      apiEndpoint + "/notifications",
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function changeNotificationStatus(requestData){
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/notifications",
      {
        "notificationChanges": requestData
      },
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}
async function changeNotificationPreferences(requestData){
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/notifications/preferences",
      requestData,
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function getUnreadNotificationCount(token) {
  try {
    const result = await axios.get(
      apiEndpoint + "/notifications/unread",
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function addFollowerToApplication(applicationId){
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/applications/" + applicationId + "/followers/add",
      {},
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function removeFollowerFromApplication(applicationId){
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/applications/" + applicationId + "/followers/remove",
      {},
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

async function getApplicationsByFollower(){
  try {
    const token = getJwtFromCookie()
    const result = await axios.get(
      apiEndpoint + "/applications/byFollowers",
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }

}

async function withdrawApplication(applicationReqId){
  try {
    const token = getJwtFromCookie()
    const result = await axios.put(
      apiEndpoint + "/applicationRequest/withdraw/" + applicationReqId,
      {},
      {
        headers: { "Authorization": "Bearer " + token }
      }
    );

    return result.data;
  } catch (error) {
    handleError(error)
  }
}

export {
  getUnreadNotificationCount,
  changeNotificationPreferences,
  changeNotificationStatus,
  getNotifications,
  checkStudentEligibility,
  updateApplicationRequestStatus,
  getCourseGrades,
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
  getCurrentTranscript,
  deleteApplicationById,
  getStudentCourseGrades,
  getApplicationRequestById,
  updateApplicationRequest,
  finalizeStatus,
  getTranscriptInfo,
  addFollowerToApplication,
  removeFollowerFromApplication,
  getApplicationsByFollower,
  withdrawApplication

};
