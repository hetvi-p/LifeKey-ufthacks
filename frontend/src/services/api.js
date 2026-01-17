import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors gracefully - don't crash when backend is down
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is not available, log but don't throw (for UI dev)
    if (!error.response && (error.code === 'ECONNREFUSED' || error.message.includes('Network Error'))) {
      console.warn('Backend not available - UI development mode');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, name) => {
    const response = await api.post('/auth/login', { email, name });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id.toString());
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  getUserId: () => {
    return localStorage.getItem('user_id');
  },
};

// Policies API
export const policiesAPI = {
  create: async (disputeWindowHours = 24) => {
    const response = await api.post('/policies', { dispute_window_hours: disputeWindowHours });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/policies/me');
    return response.data;
  },
};

// Recipients API
export const recipientsAPI = {
  create: async (email, legalName, dob) => {
    const response = await api.post('/recipients', { email, legal_name: legalName, dob });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/recipients/me');
    return response.data;
  },
};

// Vault Items API
export const vaultItemsAPI = {
  create: async (title, type, payload) => {
    const response = await api.post('/vault-items', { title, type, payload });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/vault-items/me');
    return response.data;
  },
};

// Assignments API
export const assignmentsAPI = {
  create: async (policyId, vaultItemId, recipientId, permission = 'view') => {
    const response = await api.post('/assignments', {
      policy_id: policyId,
      vault_item_id: vaultItemId,
      recipient_id: recipientId,
      permission,
    });
    return response.data;
  },
};

// Claims API
export const claimsAPI = {
  submit: async (policyId, recipientEmail, legalName, dob, idDoc, deathCert) => {
    const formData = new FormData();
    formData.append('policy_id', policyId);
    formData.append('recipient_email', recipientEmail);
    formData.append('legal_name', legalName);
    formData.append('dob', dob);
    formData.append('id_doc', idDoc);
    formData.append('death_cert', deathCert);

    const response = await api.post('/claims', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  get: async (claimId) => {
    const response = await api.get(`/claims/${claimId}`);
    return response.data;
  },
  approve: async (claimId, adminEmail = 'admin@afterme.dev') => {
    const formData = new FormData();
    formData.append('admin_email', adminEmail);
    const response = await api.post(`/claims/${claimId}/approve`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  issueReleases: async (claimId) => {
    const response = await api.post(`/claims/${claimId}/issue-releases`);
    return response.data;
  },
};

// Releases API
export const releasesAPI = {
  view: async (token) => {
    const response = await api.get(`/release/${token}`);
    return response.data;
  },
};

// Audit API
export const auditAPI = {
  list: async () => {
    const response = await api.get('/audit/me');
    return response.data;
  },
};

export default api;
