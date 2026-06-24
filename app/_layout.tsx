import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import SplashScreen from '../src/components/SplashScreen';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ProductsProvider } from '../src/contexts/ProductsContext';

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && inTabsGroup) {
      // Se não estiver logado e tentar acessar o grupo (tabs), redireciona para o login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Se estiver logado e tentar acessar rotas de autenticação (como login), redireciona para as tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Torna a barra de navegação do Android translúcida (edge-to-edge)
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBackgroundColorAsync('transparent');
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <ProductsProvider>
        <StatusBar style="dark" />
        <NavigationGuard />
      </ProductsProvider>
    </AuthProvider>
  );
}
