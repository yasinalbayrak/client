import { useDispatch } from 'react-redux';
import react from 'react';
import { toast } from 'react-toastify';
import { logout } from "../apiCalls";

export default function handleError(error) {
 
  if (error.response.status === 401) {
    
    const url = window.location.href;
    toast.error("Please login again.", {
      containerId: "1618",
      closeOnClick: true,
    });
    if (url.indexOf("pro2") === -1) {
      window.location.replace("http://localhost:3000/build/");
    }else{
      window.location.replace("http:pro2-dev.sabanciuniv.edu/build/");
      toast.error("Please login again.", {
        containerId: "1618",
        closeOnClick: true,
      });
    }
    //console.log(window.location.toString());
    //window.location.replace("*");
    // const url = window.location.href;
    // console.log("URL is:" + url);
    // const encodedURL = encodeURIComponent(url);
    // const casLoginBaseURL = "https://login.sabanciuniv.edu/cas/login?service=";
    // const casLoginURL = casLoginBaseURL + encodedURL;
    // window.location.replace(casLoginURL);
  }
  if (error.response) {
    //console.log(error.response);
    toast.error(`Error: ${error.response.status} - ${error.response.data.message ?? error.response.data.detail}`, {
      containerId: "1618",
      closeOnClick: true,
    });
  } else if (error.message) {
    toast.error(`Network Error: ${error.message}`,{
      containerId: "1618",
      closeOnClick: true,
    });
  } else {
    toast.error('An error occurred.',{
      containerId: "1618",
      closeOnClick: true,
    });
  }

  throw error
};

const CustomToastContent = ({ info, onMouseEnter, onMouseLeave }) => {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {info}
    </div>
  );
};


export function handleInfo(info) {

  const handleMouseEnter = () => {
    toast.pause()
  };

  const handleMouseLeave = () => {

    toast.play()
  };

  toast.info(<CustomToastContent
    info={info}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}

  />, {
    containerId: "1618",
    closeOnClick: true,
  });
}
export function handleServerDownError() {
  toast.error("Server is not responding right now :(",{
    containerId: "1618",
    closeOnClick: true,
  })
}
