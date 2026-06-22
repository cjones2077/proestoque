import { z } from 'zod';

export const CATEGORIAS = [
  'Eletrônicos',
  'Periféricos',
  'Monitores',
  'Móveis',
  'Armazenamento',
  'Áudio',
  'Outros',
] as const;

export type CategoriaType = typeof CATEGORIAS[number];

export const produtoSchema = z.object({
  nome: z.string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
    .trim(),
  quantidade: z.number({ message: 'A quantidade deve ser um número.' })
    .min(0, { message: 'A quantidade não pode ser negativa.' }),
  quantidadeMinima: z.number({ message: 'A quantidade mínima deve ser um número.' })
    .min(0, { message: 'A quantidade mínima não pode ser negativa.' }),
  preco: z.number({ message: 'O preço deve ser um número.' })
    .min(0, { message: 'O preço não pode ser negativo.' }),
  categoria: z.enum([
    'Eletrônicos',
    'Periféricos',
    'Monitores',
    'Móveis',
    'Armazenamento',
    'Áudio',
    'Outros',
  ], {
    message: 'Selecione uma categoria válida.',
  }),
  observacao: z.string().optional(),
  foto: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

export interface Produto extends ProdutoFormData {
  id: string;
  status: 'Normal' | 'Baixo' | 'Sem estoque';
}
