import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProducts } from '../../../src/contexts/ProductsContext';
import ProdutoForm from '../../../src/components/ProdutoForm';
import { COLORS, FONT_SIZE, SPACING } from '../../../src/constants/theme';
import { ProdutoFormData } from '../../../src/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtos, atualizarProduto, excluirProduto } = useProducts();
  const router = useRouter();

  // Encontra o produto pelo ID
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produto não encontrado.</Text>
      </View>
    );
  }

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      await atualizarProduto(produto.id, data);
      router.back();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Produto',
      `Tem certeza de que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirProduto(produto.id);
              router.back();
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProdutoForm
        initialValues={produto}
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.error,
    fontWeight: '600',
  },
});
