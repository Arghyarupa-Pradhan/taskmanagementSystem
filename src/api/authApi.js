import axios from "axios";

const API_URL = "https://taskmanagement-backend-4vwp.onrender.com/api/auth";

export async function login(credentials) {
  return axios.post(`${API_URL}/login`, credentials);
}

export async function register(userData) {
  return axios.post(`${API_URL}/register`, userData);
}

export async function requestPasswordReset(email) {
  return axios.post(`${API_URL}/forgot-password`, { email });
}

export async function resetPassword(data) {
  return axios.post(`${API_URL}/reset-password`, data);
}