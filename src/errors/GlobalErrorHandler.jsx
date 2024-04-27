import { toast } from 'react-toastify';

export default function handleError(error) {
  if (error.response.status === 401) {
    toast.error("Please login again.", {
      containerId: "1618",
      closeOnClick: true,
    });
    window.location.replace("*");
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
