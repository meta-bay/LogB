import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const validateToken = async (token) => {
  try {
    const response = await api.post("/validate-token/", { token });
    return response.data.valid;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPosts = () => api.get("/posts/");
export const getPost = (id) => api.get(`/posts/${id}/`);
export const createPost = (data) => api.post("/posts/", data);
export const deletePost = (id) => api.delete(`/posts/${id}/`);
export const updatePost = (id, postData) => api.put(`/posts/${id}/`, postData);
export const login = (credentials) => api.post("/token/", credentials);
export const getUserProfile = () => api.get("/users/me/?expand=profile");
export const register = async (data) => {
  return await api.post("/register/", data);
};

export const updateUserProfile = async (formData) => {
  return await api.patch("/users/me/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default api;
