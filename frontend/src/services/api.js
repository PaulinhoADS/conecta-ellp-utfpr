// frontend/src/services/api.js
import axios from 'axios';

// Victor configurou a base da API para apontar para o nosso backend local
const api = axios.create({
  baseURL: 'http://localhost:3333', // A mesma porta definida no .env do backend
});

export default api;