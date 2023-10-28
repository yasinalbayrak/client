import { toast } from 'react-toastify';

export default function handleError(error) {
  if (error.response) {
    toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
  } else if (error.message) {
    toast.error(`Network Error: ${error.message}`);
  } else {
    toast.error('An error occurred.');
  }
  
  throw error
};
