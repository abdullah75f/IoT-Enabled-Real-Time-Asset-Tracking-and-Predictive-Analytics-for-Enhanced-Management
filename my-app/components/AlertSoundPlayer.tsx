import React, { useEffect } from 'react';
import { playGeofenceAlertSound } from '../utils/alertSound';

interface AlertSoundPlayerProps {
  shouldPlay: boolean;
}

const AlertSoundPlayer: React.FC<AlertSoundPlayerProps> = ({ shouldPlay }) => {
  useEffect(() => {
    if (shouldPlay) {
      playGeofenceAlertSound();
    }
  }, [shouldPlay]);

  return null; // This component doesn't render anything
};

export default AlertSoundPlayer; 