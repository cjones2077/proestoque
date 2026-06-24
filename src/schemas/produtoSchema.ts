// src/schemas/produtoSchema.ts
import { z } from 'zod';
import { StatusEstoque } from '../types/api.types';

export const UNIDADES = ['un', 'kg', 'cx', 'L', 'g', 'ml', 'pc'] as const;
export type UnidadeType = typeof UNIDADES[number];

export const produtoSchema = z.object({
  nome: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
    .trim(),
  quantidade: z
    .number({ message: 'A quantidade deve ser um número.' })
    .min(0, { message: 'A quantidade não pode ser negativa.' }),
  quantidadeMinima: z
    .number({ message: 'A quantidade mínima deve ser um número.' })
    .min(0, { message: 'A quantidade mínima não pode ser negativa.' }),
  preco: z
    .number({ message: 'O preço deve ser um número.' })
    .min(0, { message: 'O preço não pode ser negativo.' }),
  // categoriaId é o ID da categoria selecionada (vindo da API)
  categoriaId: z.string().min(1, { message: 'Selecione uma categoria.' }),
  unidade: z.enum(UNIDADES, { message: 'Selecione uma unidade válida.' }),
  observacao: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

// Interface do Produto como exibido nas telas (com status calculado localmente)
export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao: string | null;
  categoriaId: string;
  // Nome da categoria para exibição
  categoriaNome: string;
  status: StatusEstoque;
}
