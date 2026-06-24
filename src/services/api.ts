import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Para emuladores Android, usa-se 10.0.2.2 ao invés de localhost
// Se estiver usando dispositivo físico, coloque o IP da sua máquina
const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:3333/api' : 'http://localhost:3333/api';

export const api = axios.create({
  baseURL,
});

// Request Interceptor: adiciona o token JWT nas requisições
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

// Response Interceptor: trata erros 401 para deslogar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Não autorizado (401). Limpando token e refazendo login.');
      // O contexto de auth irá checar a validade e deslogar se necessário,
      // mas também podemos forçar a limpeza dos dados aqui.
      await AsyncStorage.removeItem('@proestoque:token');
      await AsyncStorage.removeItem('@proestoque:user');
      
      // Para o app reiniciar a navegação, você pode emitir um evento ou deixar o AuthContext agir
      // Se usar EventEmitter ou similar, seria emitido aqui
    }
    return Promise.reject(error);
  }
);
