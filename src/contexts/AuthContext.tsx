import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  nome: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
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
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('@proestoque:token'),
          AsyncStorage.getItem('@proestoque:user'),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
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
      // Simula uma chamada de API (aguarda 500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        id: '1',
        nome: 'João Silva',
        email: email,
      };
      const mockToken = 'mock-jwt-token-12345';

      await Promise.all([
        AsyncStorage.setItem('@proestoque:token', mockToken),
        AsyncStorage.setItem('@proestoque:user', JSON.stringify(mockUser)),
      ]);

      setToken(mockToken);
      setUser(mockUser);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
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
