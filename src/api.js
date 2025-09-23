import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // backend URL
});

// Add token to every request if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if ( token &&
    !req.url.includes("/login") &&
    !req.url.includes("/register")) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
