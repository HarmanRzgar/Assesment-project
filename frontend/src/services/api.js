import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
const UPLOADS_URL = 'http://localhost:3000/uploads';

const api = {
  // PDF operations
  fetchPdfs: async () => {
    const response = await axios.get(`${BASE_URL}/pdfs`);
    return response.data;
  },

  uploadPdf: async (formData) => {
    const response = await axios.post(`${BASE_URL}/upload`, formData);
    return response.data;
  },

  deletePdf: async (filename) => {
    const response = await axios.delete(`${BASE_URL}/file/${filename}`);
    return response.data;
  },

  // Search operations
  searchPdfs: async (query) => {
    const response = await axios.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // File operations
  syncFiles: async () => {
    const response = await axios.post(`${BASE_URL}/sync`);
    return response.data;
  },

  cleanupFiles: async () => {
    const response = await axios.post(`${BASE_URL}/cleanup`);
    return response.data;
  },

  // Helper function to get PDF URL
  getPdfUrl: (filename) => `${UPLOADS_URL}/${filename}`
};

export default api;