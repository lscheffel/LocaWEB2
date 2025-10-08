import axios from 'axios';
import { Locacao } from '../store/slices/locacoesSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const locacoesApi = {
  getAll: async (): Promise<Locacao[]> => {
    const response = await axios.get(`${API_BASE_URL}/locacoes`);
    return response.data;
  },

  create: async (locacao: Omit<Locacao, 'id' | 'created_at'>): Promise<Locacao> => {
    const response = await axios.post(`${API_BASE_URL}/locacoes`, locacao);
    return response.data;
  },

  update: async (id: number, locacao: Partial<Locacao>): Promise<Locacao> => {
    const response = await axios.put(`${API_BASE_URL}/locacoes/${id}`, locacao);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/locacoes/${id}`);
  },
};