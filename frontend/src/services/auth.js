import axios from 'axios';

const apiRequest = async (url, userData) => {
  try {
    const res = await axios.post(url, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data; // Assuming a successful response
  } catch (error) {
    if (error.response) {
      console.error(`Request failed with response data:`, error.response.data);
      console.error(`Request failed with status code:`, error.response.status);
    } else {
      console.error(`Request failed without a response:`, error.message);
    }
    throw error; // Rethrow the error to be handled elsewhere
  }
};

export const signup = async (userData) => {
  // console.log("auth.jsx exports:", { signup });
  return apiRequest(`${import.meta.env.VITE_BASE_URL}/api/v1/user/signup`, userData);
};

export const login = async (userData) => {
  // console.log("auth.jsx exports:", { login });
  return apiRequest(`${import.meta.env.VITE_BASE_URL}/api/v1/user/login`, userData);
};

export default { signup, login };
