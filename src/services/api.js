import axios from "axios";

const API_URL = "http://localhost:3001";

export const getServices = () => {
  return axios.get(`${API_URL}/services`);
};

export const getServiceById = (id) => {
  return axios.get(`${API_URL}/services/${id}`);
};

export const getStylists = () => {
  return axios.get(`${API_URL}/stylists`);
};

export const getAppointmentsByUser = (userId) => {
  return axios.get(`${API_URL}/appointments?userId=${userId}`);
};

export const createAppointment = (appointment) => {
  return axios.post(`${API_URL}/appointments`, appointment);
};

export const getAppointments = () => {
  return axios.get(`${API_URL}/appointments`);
};
export const loginUser = (email, password) => {
  return axios.get(`${API_URL}/users?email=${email}&password=${password}`);
};
export const registerUser = (user) => {
  return axios.post(`${API_URL}/users`, user);
};
export const getUsers = () => {
  return axios.get(`${API_URL}/users`);
};
export const updateAppointment = (id, data) => {
  return axios.patch(`${API_URL}/appointments/${id}`, data);
};
export const getReviews = () => {
  return axios.get(`${API_URL}/reviews`);
};

export const createReview = (review) => {
  return axios.post(`${API_URL}/reviews`, review);
};
export const createService = (service) => {
  return axios.post(`${API_URL}/services`, service);
};

export const updateService = (id, service) => {
  return axios.put(`${API_URL}/services/${id}`, service);
};

export const deleteService = (id) => {
  return axios.delete(`${API_URL}/services/${id}`);
};

export const createStylist = (stylist) => {
  return axios.post(`${API_URL}/stylists`, stylist);
};

export const updateStylist = (id, stylist) => {
  return axios.patch(`${API_URL}/stylists/${id}`, stylist);
};

export const updateUser = (id, data) => {
  return axios.patch(`${API_URL}/users/${id}`, data);
};
