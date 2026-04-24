export type Categoria = {
  id: string;
  nome: string;
  icone: string; // Nome do ícone Ionicons
  cor: string;   // Cor hex para o badge
};

export type Produto = {
  id: string;
  nome: string;
  categoriaId: string;
  quantidade: number;
  quantidadeMinima: number; // Abaixo disso = alerta de estoque baixo
  preco: number;
  unidade: string;          // "un", "kg", "cx", "L"
  ultimaMovimentacao: string; // ISO date string
};

export type Movimentacao = {
  id: string;
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  observacao?: string;
};