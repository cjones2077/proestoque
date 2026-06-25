import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

function SkeletonBlock({ width, height, style }: { width: number | string; height: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: COLORS.border,
          borderRadius: BORDER_RADIUS.sm,
          opacity,
        },
        style,
      ]}
    />
  );
}

export default function SkeletonProductCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <SkeletonBlock width={48} height={48} style={{ borderRadius: BORDER_RADIUS.md }} />
      </View>

      <View style={styles.info}>
        <SkeletonBlock width="75%" height={14} />
        <SkeletonBlock width="40%" height={10} style={{ marginTop: 6 }} />
        <SkeletonBlock width="55%" height={12} style={{ marginTop: 6 }} />
      </View>

      <SkeletonBlock width={60} height={24} style={{ borderRadius: BORDER_RADIUS.full }} />
    </View>
  );
}

export function SkeletonProductList() {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  iconWrapper: {
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
});
