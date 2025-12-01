import api from "./api";

export const fetchStates = () => api.get("/states");

export const fetchCities = (state) =>
  api.get(`/states/${state}/cities`);
