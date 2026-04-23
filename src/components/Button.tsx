// src/components/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';

type ButtonVariant = 'solid' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'solid',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isSolid = variant === 'solid';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        isSolid ? styles.solid : styles.outline,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isSolid ? COLORS.white : COLORS.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isSolid ? styles.textSolid : styles.textOutline,
            isDisabled && styles.textDisabled,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  solid: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textSolid: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.disabled,
  },
});
