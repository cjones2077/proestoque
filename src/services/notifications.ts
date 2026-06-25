import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function registerForNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permissao de notificacao nao concedida.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('stock-alerts', {
      name: 'Alertas de Estoque',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

export async function sendStockAlert(produtoNome: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Alerta de Estoque',
      body: `O produto "${produtoNome}" esta acabando!`,
      sound: true,
      ...(Platform.OS === 'android' && { channelId: 'stock-alerts' }),
    },
    trigger: null,
  });
}
