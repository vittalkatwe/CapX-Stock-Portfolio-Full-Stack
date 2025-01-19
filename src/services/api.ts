import axios from 'axios';
import { Stock, StockFormData } from '../types/stock';

const API_URL = 'https://capx-stock-portfolio-backend.onrender.com/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockApi = {
  getAllStocks: async (): Promise<Stock[]> => {
    const response = await api.get('/stocks');
    return response.data;
  },

  getStock: async (id: string): Promise<Stock> => {
    const response = await api.get(`/stocks/${id}`);
    return response.data;
  },

  createStock: async (stock: StockFormData): Promise<Stock> => {
    const response = await api.post('/stocks', stock);
    return response.data;
  },

  updateStock: async (id: string, stock: StockFormData): Promise<Stock> => {
    const response = await api.put(`/stocks/${id}`, stock);
    return response.data;
  },

  deleteStock: async (id: string): Promise<void> => {
    await api.delete(`/stocks/${id}`);
  },
};