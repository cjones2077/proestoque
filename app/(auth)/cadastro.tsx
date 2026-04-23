// app/(auth)/cadastro.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LogoProEstoque from '../../src/components/LogoProEstoque';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../src/constants/theme';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [senhaError, setSenhaError] = useState('');

  function handleCadastro() {
    // Validação de senhas
    if (senha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem');
      return;
    }

    setSenhaError('');
    setLoading(true);

    // Simula loading de 2 segundos
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 2000);
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
            <LogoProEstoque size="md" />
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Text style={styles.heading}>Criar Conta</Text>
            <Text style={styles.subheading}>
              Preencha os dados abaixo para começar
            </Text>

            <Input
              label="Nome"
              icon="person-outline"
              placeholder="Seu nome completo"
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
            />

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
              placeholder="Mínimo 6 caracteres"
              isPassword
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (senhaError) setSenhaError('');
              }}
            />

            <Input
              label="Confirmar Senha"
              icon="lock-closed-outline"
              placeholder="Repita a senha"
              isPassword
              value={confirmarSenha}
              onChangeText={(text) => {
                setConfirmarSenha(text);
                if (senhaError) setSenhaError('');
              }}
              error={senhaError}
            />

            <Button
              title="Criar Conta"
              onPress={handleCadastro}
              fullWidth
              loading={loading}
              style={{ marginTop: SPACING.sm }}
            />
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>Entrar</Text>
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
    paddingVertical: SPACING.xl,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
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
