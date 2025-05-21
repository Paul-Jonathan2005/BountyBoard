import axios from 'axios';

const API = axios.create({
  baseURL: '/api', 
});

export const registerUser = async (userData) => {
  userData = {
    ...userData,
    rating: 0,
    num_of_rating : 0
  }
  const response = await API.post('register/', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post('login/', userData);
  return response.data;
};

