import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// EXPO_PUBLIC_* é exposto automaticamente pelo Expo sem necessitar de plugins extras.
// Para emulador Android use: http://10.0.2.2:3333/api
// Para dispositivo físico use: http://<IP_DA_SUA_MAQUINA>:3333/api
const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3333/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

// ─── Request Interceptor ────────────────────────────────────────────
// Injeta o token JWT em cada requisição autenticada
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@proestoque:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao ler token no interceptor:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────
// Limpa o storage caso a API retorne 401 (token expirado/inválido)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token inválido (401). Limpando credenciais salvas.');
      await AsyncStorage.multiRemove(['@proestoque:token', '@proestoque:user']);
    }
    return Promise.reject(error);
  }
);
