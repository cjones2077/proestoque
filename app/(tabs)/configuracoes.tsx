// app/(tabs)/configuracoes.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '../../src/constants/theme';

export default function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="settings-outline" size={56} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.subtitle}>
        Em breve você poderá personalizar o aplicativo por aqui.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
