import api from "./api";
 
export const getProducts = async () => {
    const response = await api.get("products/");
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`products/${id}/`);
    return response.data;
};

export const searchProduct = async (query) => {
    const response = await api.get(`products/search/?q=${query}`);
    return response.data
}

export const getProductRate = async (id) => {
    const response = await api.get(`products/rate/${id}/`);
    return response.data;
}

export const setProductRate = async (id,rate) => {
    const response = await api.put(`comments/${id}/`,{
        rating:rate
    });
    return response.data;
}
