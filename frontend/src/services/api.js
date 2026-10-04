// frontend/src/services/api.js
import axios from 'axios';

// O Victor configurou a base da API para apontar para o nosso backend local
const api = axios.create({
  baseURL: 'http://localhost:3333', // A mesma porta que definimos no .env do backend
});

export default api;