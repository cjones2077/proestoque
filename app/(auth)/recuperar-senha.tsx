// app/(auth)/recuperar-senha.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LogoProEstoque from '../../src/components/LogoProEstoque';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../src/constants/theme';

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleEnviar() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoArea}>
            <LogoProEstoque size="md" />
          </View>

          {enviado ? (
            /* Estado de sucesso */
            <View style={styles.successBox}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
              </View>
              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successText}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </Text>
              <Button
                title="Voltar ao Login"
                onPress={() => router.back()}
                fullWidth
                variant="outline"
                style={{ marginTop: SPACING.xl }}
              />
            </View>
          ) : (
            /* Formulário */
            <View style={styles.form}>
              <Text style={styles.heading}>Recuperar Senha</Text>
              <Text style={styles.description}>
                Informe seu e-mail e enviaremos um link de recuperação.
              </Text>

              <Input
                label="E-mail"
                icon="mail-outline"
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Button
                title="Enviar"
                onPress={handleEnviar}
                fullWidth
                loading={loading}
                style={{ marginTop: SPACING.sm }}
              />

              <Button
                title="Voltar ao Login"
                onPress={() => router.back()}
                fullWidth
                variant="outline"
                style={{ marginTop: SPACING.md }}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  form: {},
  heading: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  successBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
  },
  successIconWrapper: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  successText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
