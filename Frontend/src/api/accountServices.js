import api from "./api";


export const saveToken = (access,refresh) => {
    localStorage.setItem("access_token",access)
    localStorage.setItem("refresh",refresh)
}


export const login = (username, password) => {
    return api.post('token/',{username, password});
}

export const logout = () =>{
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh');
}

export const isLogged = () => {
    let token = localStorage.getItem('access_token')
    console.log(token)
    return !!token;
}

export const getToken = () => {
    return localStorage.getItem('access_token');
}

export const signup = async (userData) => {
  const response = await api.post('signup/', userData);
  return response.data;
};
