import axios from 'axios';
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';
import type { Book, Passage } from '@/types/book';
import type { Character } from '@/types/character';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ════════════════════════════════════════════════════════════
// AUTHENTIFICATION
// ════════════════════════════════════════════════════════════

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// ════════════════════════════════════════════════════════════
// LIVRES
// ════════════════════════════════════════════════════════════

export const booksApi = {
  getAll: async (): Promise<ApiResponse<Book[]>> => {
    const response = await api.get('/books');
    return response.data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Book>> => {
    const response = await api.get(`/books/${slug}`);
    return response.data;
  },
};

// ════════════════════════════════════════════════════════════
// PASSAGES
// ════════════════════════════════════════════════════════════

export const passagesApi = {
  get: async (bookSlug: string, number: number): Promise<ApiResponse<Passage>> => {
    const response = await api.get(`/books/${bookSlug}/passages/${number}`);
    return response.data;
  },
};

// ════════════════════════════════════════════════════════════
// PERSONNAGES
// ════════════════════════════════════════════════════════════

export const charactersApi = {
  getAll: async (): Promise<ApiResponse<Character[]>> => {
    const response = await api.get('/characters');
    return response.data;
  },

  get: async (id: string): Promise<ApiResponse<Character>> => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  create: async (data: Partial<Character>): Promise<ApiResponse<Character>> => {
    const response = await api.post('/characters', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Character>): Promise<ApiResponse<Character>> => {
    const response = await api.put(`/characters/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },
};

export default api;