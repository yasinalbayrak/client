import { toast } from 'react-toastify';

export default function handleError(error) {
  if (error.response.status === 401) {
    toast.error("Please login again.");
    window.location.replace("*");
  }
  if (error.response) {
    //console.log(error.response);
    toast.error(`Error: ${error.response.status} - ${error.response.data.message ?? error.response.data.detail}`);
  } else if (error.message) {
    toast.error(`Network Error: ${error.message}`);
  } else {
    toast.error('An error occurred.');
  }

  throw error
};

const CustomToastContent = ({ info, onMouseEnter, onMouseLeave}) => {
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
  toast.error("Server is not responding right now :(")
}
