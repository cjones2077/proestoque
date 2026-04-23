import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona o usuário para a tela de login ao abrir o app
  return <Redirect href="/(auth)/login" />;
}
