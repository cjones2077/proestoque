// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LogoProEstoque from '../../src/components/LogoProEstoque';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../src/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <LogoProEstoque size="lg" />
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Text style={styles.heading}>Entrar</Text>
            <Text style={styles.subheading}>
              Acesse sua conta para gerenciar seu estoque
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

            <Input
              label="Senha"
              icon="lock-closed-outline"
              placeholder="Sua senha"
              isPassword
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/recuperar-senha')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              onPress={handleLogin}
              fullWidth
              loading={loading}
            />
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
              <Text style={styles.footerLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  heading: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subheading: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: -SPACING.sm,
  },
  forgotText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
