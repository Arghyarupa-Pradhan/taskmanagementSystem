import api from "./axios";

export const login = (credentials) => {
  return api.post("/auth/login", credentials);   
};

export const register = (data) => {
  return api.post("/auth/register", data);
};
