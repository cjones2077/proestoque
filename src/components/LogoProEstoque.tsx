// src/components/LogoProEstoque.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProEstoqueProps {
  size?: LogoSize;
}

const sizeConfig: Record<LogoSize, { icon: number; fontSize: number; gap: number }> = {
  sm: { icon: 28, fontSize: FONT_SIZE.lg, gap: SPACING.xs },
  md: { icon: 48, fontSize: FONT_SIZE.xxl, gap: SPACING.sm },
  lg: { icon: 64, fontSize: FONT_SIZE.title, gap: SPACING.md },
};

export default function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { width: config.icon * 1.5, height: config.icon * 1.5 }]}>
        <Ionicons name="cube-outline" size={config.icon} color={COLORS.white} />
      </View>
      <View style={{ marginTop: config.gap }}>
        <Text style={[styles.title, { fontSize: config.fontSize }]}>
          Pro<Text style={styles.titleBold}>Estoque</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  titleBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
