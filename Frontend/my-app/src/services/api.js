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
  const user_id = response.data.user_id
  const token = response.data.token;
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', user_id);
  }
  return response.data;
};

export const logoutUser = async () => {
  const token = localStorage.getItem('authToken');
  const response = await API.post('logout/', {}, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  if (response.status === 200) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletInfo');
    localStorage.removeItem('walletInfo');
  }
  return response.data;
};

export const fetchUserDetails = async () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-user-details/${username}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.user_details;
};

export const fetchBountyDetails = async (bountyId) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-bounty-details/${bountyId}/${userId}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.bounty_details;
};


export const fetchBountyList = async (bountyType) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-client-bounties/${userId}/${bountyType}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.client_bounties;
}; 

export const fetchBountyTypes = async () => {
  const token = localStorage.getItem('authToken');
  const response = await API.get('get-bounty-types/', {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.task_types;
}; 

export const fecthTaskTypeBounties = async (taskType) => {
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-bounty-types/${taskType}/get-bounties`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.bounties;
}; 

export const fetchBountyRequests = async (bountyId) => {
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-client-bounty/${bountyId}/get-requests`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.requested_candidates;
}; 


export const createBounty = async (bountyData) => {
  const userId = localStorage.getItem('userId');
  bountyData = {
    ...bountyData,
    client_id: userId,
  }
  const token = localStorage.getItem('authToken');
  const response = await API.post('create-bounty/', bountyData, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data;
}; 

export const sendBountyRequest = async (bountyId) => {
  const userId = localStorage.getItem('userId');
  const requestData = {
    requested_candidate_id: userId,
    bounty_id: bountyId,
  }
  const token = localStorage.getItem('authToken');
  const response = await API.post('request-bounty/', requestData, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data;
}; 

