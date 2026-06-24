// src/hooks/useCategorias.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { CategoriaAPI } from '../types/api.types';

interface UseCategorias {
  categorias: CategoriaAPI[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategorias(): UseCategorias {
  const [categorias, setCategorias] = useState<CategoriaAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<CategoriaAPI[]>('/categorias');
      setCategorias(data);
    } catch (err: any) {
      console.error('Erro ao buscar categorias:', err);
      setError('Não foi possível carregar as categorias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return { categorias, isLoading, error, refetch: fetchCategorias };
}
