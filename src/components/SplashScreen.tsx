import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Animated } from 'react-native';
import LogoProEstoque from './LogoProEstoque';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação da barra de progresso simulada
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false, // width não suporta native driver
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <LogoProEstoque size="lg" />
      </Animated.View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} style={styles.indicator} />
        
        {/* Barra de progresso animada */}
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.loadingText}>Carregando dados do sistema...</Text>
      </View>

      <Text style={styles.footerText}>ProEstoque v1.0.0</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 60,
  },
  indicator: {
    marginBottom: SPACING.md,
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  loadingText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    position: 'absolute',
    bottom: 30,
  },
});
