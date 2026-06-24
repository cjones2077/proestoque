import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { getErrorMessage, getFieldErrors } from '../utils/getErrorMessage';

export interface User {
  id: string;
  nome: string;
  email: string;
}

export interface AuthError {
  message: string;
  fieldErrors: Record<string, string>;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const startTime = Date.now();
      try {
        const storedToken = await AsyncStorage.getItem('@proestoque:token');
        const storedUser = await AsyncStorage.getItem('@proestoque:user');

        if (storedToken && storedUser) {
          // Valida o token com o backend
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          try {
            const response = await api.get('/auth/me');
            if (response.data.usuario) {
              setToken(storedToken);
              setUser(response.data.usuario);
            }
          } catch (apiError) {
            console.log('Token inválido ou expirado, limpando dados...', apiError);
            await AsyncStorage.removeItem('@proestoque:token');
            await AsyncStorage.removeItem('@proestoque:user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        // Garante um atraso mínimo simulado de 1.5s para uma transição suave da SplashScreen
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    }

    loadStorageData();
  }, []);

  async function login(email: string, senha: string) {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token: apiToken, usuario } = response.data;

      await Promise.all([
        AsyncStorage.setItem('@proestoque:token', apiToken),
        AsyncStorage.setItem('@proestoque:user', JSON.stringify(usuario)),
      ]);

      api.defaults.headers.Authorization = `Bearer ${apiToken}`;
      setToken(apiToken);
      setUser(usuario);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const authError: AuthError = {
        message: getErrorMessage(error),
        fieldErrors: getFieldErrors(error),
      };
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }

  async function registrar(nome: string, email: string, senha: string) {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/registro', { nome, email, senha });
      const { token: apiToken, usuario } = response.data;

      await Promise.all([
        AsyncStorage.setItem('@proestoque:token', apiToken),
        AsyncStorage.setItem('@proestoque:user', JSON.stringify(usuario)),
      ]);

      api.defaults.headers.Authorization = `Bearer ${apiToken}`;
      setToken(apiToken);
      setUser(usuario);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      const authError: AuthError = {
        message: getErrorMessage(error),
        fieldErrors: getFieldErrors(error),
      };
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    try {
      await Promise.all([
        AsyncStorage.removeItem('@proestoque:token'),
        AsyncStorage.removeItem('@proestoque:user'),
      ]);
      setToken(null);
      setUser(null);
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
