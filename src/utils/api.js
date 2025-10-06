// src/utils/api.js
import axios from 'axios';
import { BACKEND_URL } from '../config';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? BACKEND_URL : '/', // Use proxy in development
  timeout: 10000,
  withCredentials: false, // OAuth doesn't need credentials for these requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Only redirect to login if not already on login/signup page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// AI Service Functions
export const aiService = {
  // Job summarization using enhanced ML service
  summarizeJob: async (jobDescription) => {
    try {
      const response = await api.post('/api/ai/summarize-job', {
        job_description: jobDescription
      });
      return response.data;
    } catch (error) {
      console.error('Job summarization failed:', error);
      throw error;
    }
  },

  // Resume skill extraction using enhanced ML service  
  extractSkills: async (resumeText) => {
    try {
      const response = await api.post('/api/ai/extract-resume-skills', {
        resume_text: resumeText
      });
      return response.data;
    } catch (error) {
      console.error('Skill extraction failed:', error);
      throw error;
    }
  },

  // AI-powered cover letter generation
  generateCoverLetter: async (resumeText, jobDescription, resumeFile = null) => {
    try {
      if (resumeFile) {
        // If PDF file is provided
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('job_description', jobDescription);
        
        const response = await api.post('/api/ai/cover-letter', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // If text is provided
        const response = await api.post('/api/ai/cover-letter', {
          resume_text: resumeText,
          job_description: jobDescription
        });
        return response.data;
      }
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      throw error;
    }
  },

  // Job-resume fit score prediction
  predictFitScore: async (resumeText, jobDescription) => {
    try {
      const response = await api.post('/api/ai/predict-fit', {
        resume_text: resumeText,
        job_description: jobDescription
      });
      return response.data;
    } catch (error) {
      console.error('Fit score prediction failed:', error);
      throw error;
    }
  },

  // Check ML service health
  checkMLHealth: async () => {
    try {
      const response = await api.get('/api/ai/ml-health');
      return response.data;
    } catch (error) {
      console.error('ML health check failed:', error);
      throw error;
    }
  },

  // Legacy endpoints (for backwards compatibility)
  legacy: {
    summarize: async (jobDescription) => {
      try {
        const response = await api.post('/api/ai/summarize', {
          jobDescription
        });
        return response.data;
      } catch (error) {
        console.error('Legacy summarization failed:', error);
        throw error;
      }
    },

    extractSkills: async (jobDescription) => {
      try {
        const response = await api.post('/api/ai/extract-skills', {
          jobDescription
        });
        return response.data;
      } catch (error) {
        console.error('Legacy skill extraction failed:', error);
        throw error;
      }
    },

    calculateFitScore: async (resumeSkills, jobSkills) => {
      try {
        const response = await api.post('/api/ai/fit-score', {
          resumeSkills,
          jobSkills
        });
        return response.data;
      } catch (error) {
        console.error('Legacy fit score calculation failed:', error);
        throw error;
      }
    }
  }
};

export default api;
