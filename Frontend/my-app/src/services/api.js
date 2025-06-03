import axios from 'axios';
import env_config from '../Config.js';
import algosdk from 'algosdk';

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

export const postFinalSubmissionLink = async (finalSubmission, bountyId) => {
  const token = localStorage.getItem('authToken');
  const response = await API.post(`accept-submission-link/${bountyId}`, finalSubmission, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post('login/', userData);
  const user_id = response.data.user_id
  const user_role = response.data.user_role
  const token = response.data.token;
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', user_id);
    localStorage.setItem('userRole', user_role);
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

export const transferAmount = async (bountyId) => {
  const token = localStorage.getItem('authToken');
  const response = await API.get(`transfer-amount/${bountyId}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response;
}; 

export const fetchFreelancerBountyList = async (bountyType) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-freelancer-bounties/${userId}/${bountyType}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.freelancer_bounties;
}; 

export const fetchClientBountyList = async (bountyType) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-client-bounties/${userId}/${bountyType}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.client_bounties;
}; 

export const fetchFreelancerBounties = async () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const response = await API.get(`get-requested-bounties/${userId}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.requestedBounties;
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

export const fetchMessages = async (bountyId) => {
  const token = localStorage.getItem('authToken');
  const response = await API.get(`message/${bountyId}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data.chat;
}; 

export const postChatMessage = async (formData, bountyId) => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const payLoad = {
    bounty_id: bountyId,
    user: userId,
    message: formData.chat,
    created_time: new Date().toISOString(),
  }
  const response = await API.post(`message/`, payLoad, {
    headers: {
      Authorization: `Token ${token}`
    }

  });
  return response.data;
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
  const freelancerAddress = localStorage.getItem("walletAddress");
  const userId = localStorage.getItem('userId');
  const requestData = {
    requested_candidate_id: userId,
    bounty_id: bountyId,
    candidate_pera_wallet_address: freelancerAddress,
  }
  const token = localStorage.getItem('authToken');
  const response = await API.post('request-bounty/', requestData, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data;
}; 

export const acceptBountyRequest = async (bountyId, candidateId) => {
  const token = localStorage.getItem('authToken');
  const response = await API.post('accept-bounty-request/', {
    bounty_id: bountyId,
    requested_candidate_id: candidateId,
  }, {
    headers: {
      Authorization: `Token ${token}`,
    }
  });

  return response.data;
};

function encodeBoxKeyWithPrefix(prefix, id) {
  const prefixBytes = new TextEncoder().encode(prefix);
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setBigUint64(0, BigInt(id));
  const idBytes = new Uint8Array(buffer);
  return new Uint8Array([...prefixBytes, ...idBytes]);
}

export const transferAlgosToSmartContracts = async (
  bountyId,
  rewardAmount,
  freelancerAddress,
  activeAddress,
  transactionSigner,
  algodClient
) => {
  const atc = new algosdk.AtomicTransactionComposer();
  const suggestedParams = await algodClient.getTransactionParams().do();

  const method = algosdk.ABIMethod.fromSignature(
    'create_task(pay,uint64,address,address,uint64)void'
  );

  const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: activeAddress,
    receiver: env_config.smart_contract_app_address,
    amount: rewardAmount,
    suggestedParams,
  });

  const boxKey = encodeBoxKeyWithPrefix("users", bountyId);

  atc.addMethodCall({
    appID: env_config.smart_contract_app_id,
    method,
    methodArgs: [
      { txn: paymentTxn, signer: transactionSigner },
      Number(bountyId),
      activeAddress,
      freelancerAddress,
      rewardAmount
    ],
    boxes: [{ appIndex: env_config.smart_contract_app_id, name: boxKey }],
    sender: activeAddress,
    suggestedParams,
    signer: transactionSigner,
  });

  await atc.execute(algodClient, 4);
}

export const transferAlgosToFreelancer = async (
  bountyId,
  activeAddress,
  transactionSigner,
  algodClient
) =>{
  const atc = new algosdk.AtomicTransactionComposer();
  const suggestedParams = await algodClient.getTransactionParams().do();

  const method = algosdk.ABIMethod.fromSignature(
    'release_reward(uint64,address)uint64'
  );
  const boxKey = encodeBoxKeyWithPrefix("users", bountyId);
  
  atc.addMethodCall({
      appID: env_config.smart_contract_app_id,
      method,
      methodArgs: [
        Number(bountyId),
        activeAddress,
      ],
      sender: activeAddress,
      fee: 4000,
      suggestedParams,
      boxes: [{ appIndex: env_config.smart_contract_app_id, name: boxKey }],
      signer: transactionSigner,
    });
  
    await atc.execute(algodClient, 4);

}
