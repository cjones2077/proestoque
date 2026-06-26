import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// EXPO_PUBLIC_* é exposto automaticamente pelo Expo sem necessitar de plugins extras.
// Para emulador Android use: http://10.0.2.2:3333/api
// Para dispositivo físico use: http://<IP_DA_SUA_MAQUINA>:3333/api
// Em produção (APK), a URL do Railway é usada como fallback.
const PRODUCTION_URL = 'https://proestoque-api-production-398d.up.railway.app/api';
const baseURL = process.env.EXPO_PUBLIC_API_URL || PRODUCTION_URL;

// Log para diagnóstico — verificar qual URL o app está usando
console.log('[API] Base URL:', baseURL);
console.log('[API] EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);

export const api = axios.create({
  baseURL,
  timeout: 30000,
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
// NÃO limpa em rotas de login/registro (onde 401 é "credenciais erradas")
const AUTH_PATHS = ['/auth/login', '/auth/registro'];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRoute = AUTH_PATHS.some((path) => requestUrl.includes(path));

      if (!isAuthRoute) {
        console.warn('Token inválido (401). Limpando credenciais salvas.');
        await AsyncStorage.multiRemove(['@proestoque:token', '@proestoque:user']);
      }
    }
    return Promise.reject(error);
  }
);
