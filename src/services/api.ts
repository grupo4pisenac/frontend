import axios from 'axios';

export const api = axios.create({

  baseURL: 'https://backend-production-a784.up.railway.app', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@EduManage:token');
  
  // O NOSSO ESPIÃO:
  console.log("Interceptor da API disparado!");
  console.log("Token encontrado no navegador?", token ? "SIM! (Injetando...)" : "NÃO! (O token está vazio)");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
