# IoT Asset Tracking Hardware

This directory contains the hardware code for an IoT-enabled real-time asset tracking system using ESP32 microcontrollers. The system consists of two main components:

1. **OBD-II Data Logger** - Collects vehicle diagnostic data
2. **GPS Tracker** - Provides location tracking capabilities

## Components

### 1. ESP32-OBD2 Data Logger

**File:** `ESP32-OBD2`

This module connects to a vehicle's OBD-II port via Bluetooth to collect real-time diagnostic data.

#### Features:
- Bluetooth connectivity to ELM327 OBD-II adapter
- Real-time monitoring of vehicle parameters:
  - Coolant Temperature (°C)
  - Engine RPM
  - Vehicle Speed (km/h)
  - MAF Air Flow (g/s)
  - Throttle Position (%)

#### Hardware Requirements:
- ESP32 development board
- ELM327 Bluetooth OBD-II adapter
- Vehicle with OBD-II port

#### Configuration:
```cpp
// OBD-II adapter MAC address (update with your adapter's MAC)
uint8_t obdAddress[6] = {0x**, 0x**, 0x**, 0x**, 0x**, 0x**};
const char* obdPin = "****";  // OBD-II adapter PIN, most of the time it is either 1234 or 0000
```

#### Setup Instructions:
1. Connect ESP32 to your computer
2. Update the MAC address in the code to match your OBD-II adapter
3. Upload the code to ESP32
4. Power on your vehicle (ignition must be ON)
5. The ESP32 will automatically connect to the OBD-II adapter

#### Data Collection:
The system reads data every 3 seconds and displays it via Serial Monitor. Data includes:
- Engine performance metrics
- Vehicle speed and throttle position
- Temperature readings
- Air flow measurements

### 2. ESP32-GPS Tracker

**File:** `ESP32-GPS.cpp`

This module provides GPS location tracking and sends coordinates to a backend server.

#### Features:
- GPS location tracking using TinyGPS++ library
- WiFi connectivity for data transmission
- HTTP POST requests to backend server
- Real-time coordinate logging

#### Hardware Requirements:
- ESP32 development board
- GPS module (NEO-6M or compatible)
- WiFi network access

#### Pin Configuration:
```cpp
// GPS module connections
HardwareSerial GPS(2); // UART2
// RX = GPIO16
// TX = GPIO17
```

#### Configuration:
```cpp
// WiFi credentials (update with your network)
const char* ssid = "*********";
const char* password = "*********";

// Backend endpoint (update with your server URL)
const char* serverName = "https://**************";
```

#### Setup Instructions:
1. Connect GPS module to ESP32:
   - GPS RX → ESP32 GPIO17 (TX)
   - GPS TX → ESP32 GPIO16 (RX)
   - GPS VCC → 3.3V
   - GPS GND → GND
2. Update WiFi credentials in the code
3. Update the backend server URL
4. Upload the code to ESP32
5. Power on the system

#### Data Transmission:
- GPS coordinates are sent every 10 seconds
- Data format: JSON with latitude and longitude
- HTTP POST requests to configured backend endpoint

## Installation and Setup

### Prerequisites:
- Arduino IDE with ESP32 board support
- Required libraries:
  - `BluetoothSerial` (included with ESP32)
  - `WiFi` (included with ESP32)
  - `HTTPClient` (included with ESP32)
  - `TinyGPSPlus` (install via Library Manager)

### Library Installation:
1. Open Arduino IDE
2. Go to Tools → Manage Libraries
3. Search for "TinyGPSPlus" and install

### Board Configuration:
1. Select ESP32 board in Arduino IDE
2. Set upload speed to 115200
3. Select appropriate COM port

## Usage

### OBD-II Logger:
1. Connect OBD-II adapter to vehicle
2. Power on vehicle
3. Monitor Serial output for diagnostic data
4. Data updates every 3 seconds

### GPS Tracker:
1. Ensure GPS module has clear sky view
2. Wait for GPS fix (may take 1-2 minutes)
3. Monitor Serial output for coordinates
4. Check backend server for received data

## Troubleshooting

### OBD-II Connection Issues:
- Verify vehicle ignition is ON
- Check OBD-II adapter power
- Confirm MAC address is correct
- Ensure Bluetooth is enabled

### GPS Issues:
- Check GPS module connections
- Ensure clear view of sky
- Verify WiFi credentials
- Check backend server availability

### WiFi Connection Issues:
- Verify network credentials
- Check signal strength
- Ensure network allows ESP32 connections

## Data Format

### OBD-II Data:
```
Coolant Temp        :  85.0 °C
Engine RPM         : 2500.0 rpm
Vehicle Speed      :  60.0 km/h
MAF Air Flow       :  12.5 g/s
Throttle Position  :  45.0 %
```

### GPS Data:
```json
{
  "latitude": 9.123456,
  "longitude": 38.789012
}
```

## Security Notes

- Update default WiFi credentials
- Use HTTPS endpoints for data transmission
- Consider implementing authentication for backend API
- Secure OBD-II adapter with strong PIN

## Contributing

When modifying the hardware code:
1. Test thoroughly with actual hardware
2. Update documentation for any configuration changes
3. Ensure compatibility with existing backend systems
4. Follow ESP32 best practices for power management

## License

This hardware code is part of the IoT Asset Tracking System project.
