import { toast } from 'react-toastify';

export default function handleError(error) {
  if(error.response.status === 401){
    toast.error("Please login again.");
    window.location.replace("*");
  }
  if (error.response) {
    toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
  } else if (error.message) {
    toast.error(`Network Error: ${error.message}`);
  } else {
    toast.error('An error occurred.');
  }
  
  throw error
};

export function handleInfo(info) {
  toast.info(info);
};

export function handleServerDownError(){
  toast.error("Server is not responding right now :(")
}
