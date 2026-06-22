import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../schemas/produtoSchema';
import { PRODUTOS_MOCK } from '../data/mockData';

export interface ProductsContextType {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (produto: Omit<Produto, 'id' | 'status'>) => Promise<void>;
  atualizarProduto: (id: string, produto: Omit<Produto, 'id' | 'status'>) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

function calcularStatus(quantidade: number, quantidadeMinima: number): 'Normal' | 'Baixo' | 'Sem estoque' {
  if (quantidade === 0) return 'Sem estoque';
  if (quantidade <= quantidadeMinima) return 'Baixo';
  return 'Normal';
}

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        produtos: action.payload,
        isLoading: false,
      };
    case 'ADD':
      return {
        ...state,
        produtos: [...state.produtos, action.payload],
      };
    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, {
    produtos: [],
    isLoading: true,
  });

  // Carregar produtos na inicialização
  useEffect(() => {
    async function loadProducts() {
      try {
        const stored = await AsyncStorage.getItem('@proestoque:produtos');
        if (stored) {
          dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
        } else {
          // Se não houver produtos salvos, inicializa com o mock data
          const initialProducts: Produto[] = PRODUTOS_MOCK.map((p) => {
            const quantidadeMinima = p.quantidade === 0 ? 5 : Math.ceil(p.quantidade * 0.3) || 2;
            return {
              id: p.id,
              nome: p.nome,
              categoria: p.categoria as any,
              quantidade: p.quantidade,
              quantidadeMinima,
              preco: p.preco,
              observacao: '',
              foto: '',
              status: p.status,
            };
          });
          await AsyncStorage.setItem('@proestoque:produtos', JSON.stringify(initialProducts));
          dispatch({ type: 'LOAD', payload: initialProducts });
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        dispatch({ type: 'LOAD', payload: [] });
      }
    }
    loadProducts();
  }, []);

  // Persistir produtos na AsyncStorage a cada atualização
  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem('@proestoque:produtos', JSON.stringify(state.produtos))
        .catch((error) => console.error('Erro ao persistir produtos no AsyncStorage:', error));
    }
  }, [state.produtos, state.isLoading]);

  async function adicionarProduto(data: Omit<Produto, 'id' | 'status'>) {
    const id = Date.now().toString();
    const status = calcularStatus(data.quantidade, data.quantidadeMinima);
    const novo: Produto = {
      ...data,
      id,
      status,
    };
    dispatch({ type: 'ADD', payload: novo });
  }

  async function atualizarProduto(id: string, data: Omit<Produto, 'id' | 'status'>) {
    const status = calcularStatus(data.quantidade, data.quantidadeMinima);
    const atualizado: Produto = {
      ...data,
      id,
      status,
    };
    dispatch({ type: 'UPDATE', payload: atualizado });
  }

  async function excluirProduto(id: string) {
    dispatch({ type: 'DELETE', payload: id });
  }

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        adicionarProduto,
        atualizarProduto,
        excluirProduto,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return context;
}
