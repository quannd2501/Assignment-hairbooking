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
  return axios.get(
    `${API_URL}/users?email=${email}&password=${password}`
  );
};