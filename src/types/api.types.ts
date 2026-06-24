// src/types/api.types.ts
// Interfaces que espelham exatamente o que a API retorna

export interface CategoriaAPI {
  id: string;
  nome: string;
}

export type StatusEstoque = 'Normal' | 'Baixo' | 'Sem estoque';

export interface ProdutoAPI {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao: string | null;
  categoriaId: string;
  categoria: CategoriaAPI;
  criadoEm: string;
  atualizadoEm: string;
}

// Payload para criar/atualizar um produto via API
export interface ProdutoPayload {
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao?: string;
  categoriaId: string;
}
