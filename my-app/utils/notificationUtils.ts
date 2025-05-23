import { Alert } from 'react-native';

export const setupNotifications = async () => {
  // No setup needed for in-app alerts
  return;
};

export const sendGeofenceNotification = async (title: string, body: string) => {
  // Just show an alert
  Alert.alert(title, body);
}; 