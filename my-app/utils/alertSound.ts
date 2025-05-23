import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export const playGeofenceAlertSound = async () => {
  try {
    // Unload any existing sound
    if (sound) {
      await sound.unloadAsync();
    }

    // Load and play the sound
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../assets/sounds/alert.mp3')
    );
    sound = newSound;
    await sound.playAsync();
  } catch (error) {
    console.error('Error playing geofence alert sound:', error);
  }
};

export const cleanupSound = async () => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
}; 