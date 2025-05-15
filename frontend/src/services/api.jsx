
import axios from "axios";

const base = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const API = axios.create({
    baseURL:  `${base}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});


API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
