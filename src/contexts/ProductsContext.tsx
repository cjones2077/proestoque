import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { sendStockAlert } from '../services/notifications';
import { ProdutoAPI, ProdutoPayload } from '../types/api.types';
import { Produto, ProdutoFormData } from '../schemas/produtoSchema';

function calcularStatus(
  quantidade: number,
  quantidadeMinima: number
): 'Normal' | 'Baixo' | 'Sem estoque' {
  if (quantidade === 0) return 'Sem estoque';
  if (quantidade <= quantidadeMinima) return 'Baixo';
  return 'Normal';
}

function mapApiProduto(p: ProdutoAPI): Produto {
  return {
    id: p.id,
    nome: p.nome,
    quantidade: p.quantidade,
    quantidadeMinima: p.quantidadeMinima,
    preco: p.preco,
    unidade: p.unidade,
    observacao: p.observacao,
    categoriaId: p.categoriaId,
    categoriaNome: p.categoria.nome,
    status: calcularStatus(p.quantidade, p.quantidadeMinima),
  };
}

export interface ProductsContextType {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  atualizarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

type State = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'DELETE'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOAD_SUCCESS':
      return { isLoading: false, error: null, produtos: action.payload };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

function verificarEstoqueCritico(
  produtos: Produto[],
  notificadosRef: React.MutableRefObject<Set<string>>
) {
  for (const p of produtos) {
    if (
      (p.status === 'Baixo' || p.status === 'Sem estoque') &&
      !notificadosRef.current.has(p.id)
    ) {
      notificadosRef.current.add(p.id);
      sendStockAlert(p.nome);
    }
  }
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    produtos: [],
    isLoading: true,
    error: null,
  });

  const notificadosRef = useRef<Set<string>>(new Set());

  const loadProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const { data } = await api.get<ProdutoAPI[]>('/produtos');
      const mapped = data.map(mapApiProduto);
      dispatch({ type: 'LOAD_SUCCESS', payload: mapped });
      verificarEstoqueCritico(mapped, notificadosRef);
    } catch (err: any) {
      const msg = 'Nao foi possivel carregar os produtos. Verifique sua conexao.';
      console.error('loadProducts error:', err?.response?.data ?? err.message);
      dispatch({ type: 'SET_ERROR', payload: msg });
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const submittingRef = useRef(false);

  async function adicionarProduto(data: ProdutoFormData) {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const payload: ProdutoPayload = {
      nome: data.nome,
      quantidade: data.quantidade,
      quantidadeMinima: data.quantidadeMinima,
      preco: data.preco,
      unidade: data.unidade,
      observacao: data.observacao,
      categoriaId: data.categoriaId,
    };
    try {
      await api.post<ProdutoAPI>('/produtos', payload);
      await loadProducts();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? 'Erro ao adicionar o produto.';
      Alert.alert('Erro', msg);
      throw err;
    } finally {
      submittingRef.current = false;
    }
  }

  async function atualizarProduto(id: string, data: ProdutoFormData) {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const payload: ProdutoPayload = {
      nome: data.nome,
      quantidade: data.quantidade,
      quantidadeMinima: data.quantidadeMinima,
      preco: data.preco,
      unidade: data.unidade,
      observacao: data.observacao,
      categoriaId: data.categoriaId,
    };
    try {
      await api.put<ProdutoAPI>(`/produtos/${id}`, payload);
      notificadosRef.current.delete(id);
      await loadProducts();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? 'Erro ao atualizar o produto.';
      Alert.alert('Erro', msg);
      throw err;
    } finally {
      submittingRef.current = false;
    }
  }

  async function excluirProduto(id: string) {
    dispatch({ type: 'DELETE', payload: id });
    try {
      await api.delete(`/produtos/${id}`);
      notificadosRef.current.delete(id);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao excluir o produto.';
      Alert.alert('Erro', msg);
      await loadProducts();
      throw err;
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        error: state.error,
        loadProducts,
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
