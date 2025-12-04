import api from "./api";

export const fetchStates = () => api.get("/states");

export const fetchCities = (state) =>
  api.get(`/cities/${state}`);

export const fetchDonors = (filterBy:string, value:string) => {
  return api.get(`/donors/search?filterBy=${filterBy}&value=${value}`);
}
