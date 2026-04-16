import axios from 'axios'
import { isLogged,getToken } from './accountServices'

const baseURL = 'http://localhost:8000/'

const api = axios.create({
  baseURL: baseURL,
  headers:{
    "Content-Type":"application/json",
  }
})

api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access');
    //console.log(access)
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const res = await axios.post(`${baseURL}token/refresh/`, {
          refresh: localStorage.getItem("refresh"),
        });

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        // Mettre à jour le header Authorization de la requête échouée
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return axios(originalRequest); // rejoue la requête initiale
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/Connection"; // ou toute autre action
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;