// src/data/mockData.ts

export type StatusEstoque = 'Normal' | 'Baixo' | 'Sem estoque';

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
  status: StatusEstoque;
}

export const PRODUTOS_MOCK: Produto[] = [
  { id: '1', nome: 'Notebook Dell XPS 13', categoria: 'Eletrônicos', quantidade: 15, preco: 8500.00, status: 'Normal' },
  { id: '2', nome: 'Mouse Sem Fio Logitech', categoria: 'Periféricos', quantidade: 4, preco: 150.00, status: 'Baixo' },
  { id: '3', nome: 'Teclado Mecânico Keychron', categoria: 'Periféricos', quantidade: 0, preco: 650.00, status: 'Sem estoque' },
  { id: '4', nome: 'Monitor LG Ultrawide 29"', categoria: 'Monitores', quantidade: 10, preco: 1200.00, status: 'Normal' },
  { id: '5', nome: 'Cadeira Ergonomica Herman Miller', categoria: 'Móveis', quantidade: 2, preco: 7800.00, status: 'Baixo' },
  { id: '6', nome: 'SSD NVMe Samsung 1TB', categoria: 'Armazenamento', quantidade: 25, preco: 550.00, status: 'Normal' },
  { id: '7', nome: 'Headset Gamer HyperX', categoria: 'Áudio', quantidade: 8, preco: 450.00, status: 'Normal' },
  { id: '8', nome: 'Webcam Logitech C920', categoria: 'Periféricos', quantidade: 0, preco: 350.00, status: 'Sem estoque' },
];
