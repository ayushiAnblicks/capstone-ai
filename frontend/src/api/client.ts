import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 120_000, // Backend processing can take time (OCR + AI)
});

export default apiClient;
