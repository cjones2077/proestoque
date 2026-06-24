// app/(tabs)/produtos/[id].tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProducts } from '../../../src/contexts/ProductsContext';
import ProdutoForm from '../../../src/components/ProdutoForm';
import LoadingView from '../../../src/components/LoadingView';
import ErrorView from '../../../src/components/ErrorView';
import { COLORS } from '../../../src/constants/theme';
import { ProdutoFormData } from '../../../src/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtos, isLoading, atualizarProduto, excluirProduto, loadProducts } = useProducts();
  const router = useRouter();

  if (isLoading) {
    return <LoadingView message="Carregando produto..." />;
  }

  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return (
      <ErrorView
        message="Produto não encontrado. Ele pode ter sido excluído."
        onRetry={loadProducts}
      />
    );
  }

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      await atualizarProduto(produto.id, data);
      router.back();
    } catch {
      // Erro já tratado (Alert) dentro do contexto
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Produto',
      `Tem certeza de que deseja excluir "${produto.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirProduto(produto.id);
              router.back();
            } catch {
              // Erro já tratado no contexto
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Mapeia o produto salvo nos valores iniciais do formulário
  const initialValues: Partial<ProdutoFormData> = {
    nome: produto.nome,
    quantidade: produto.quantidade,
    quantidadeMinima: produto.quantidadeMinima,
    preco: produto.preco,
    categoriaId: produto.categoriaId,
    unidade: produto.unidade as any,
    observacao: produto.observacao ?? '',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProdutoForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttonTitle="Salvar Alterações"
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
