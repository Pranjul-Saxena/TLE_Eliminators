// src/api/axiosConfig.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // base URL of your backend
});

export default apiClient;