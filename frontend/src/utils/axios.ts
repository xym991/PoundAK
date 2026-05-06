import axios from "axios";

// Set the base URL for all requests
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL; // Replace with your API base URL

// Add a request interceptor to include the Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
