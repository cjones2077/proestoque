import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../../src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.white },
        headerTitleStyle: { fontWeight: '700', color: COLORS.textPrimary },
        headerTintColor: COLORS.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Produtos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Produto' }} />
    </Stack>
  );
}
