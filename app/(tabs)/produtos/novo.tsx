import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '../../../src/contexts/ProductsContext';
import ProdutoForm from '../../../src/components/ProdutoForm';
import { COLORS } from '../../../src/constants/theme';
import { ProdutoFormData } from '../../../src/schemas/produtoSchema';

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();
  const router = useRouter();

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      await adicionarProduto(data);
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProdutoForm onSubmit={handleSubmit} buttonTitle="Cadastrar Produto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
