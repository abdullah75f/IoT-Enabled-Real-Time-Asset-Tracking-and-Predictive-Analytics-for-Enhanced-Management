# IoT Asset Tracking System

Real-time asset tracking system using GPS, OBD-II sensors, and machine learning for predictive maintenance. Features anomaly detection, geo-fencing alerts, and mobile interface.

## 🏗️ Architecture

```
Hardware (ESP32) → Backend (NestJS) → Frontend (React Native)
```

## 📱 Frontend

**Location:** `my-app/`
- React Native with Expo
- Real-time GPS tracking and maps
- Vehicle diagnostic dashboard
- Predictive analytics

**Setup:**
```bash
cd my-app
npm install
npx expo start
```

## 🔧 Backend

**Location:** `backend/`
- NestJS API with PostgreSQL
- JWT authentication
- Machine learning models (scikit-learn)
- RESTful endpoints

**Setup:**
```bash
cd backend
npm install
pip install -r requirements.txt
npm run start:dev
```

## 🔌 Hardware

**Location:** `hardWare/`
- ESP32-OBD2: Vehicle diagnostic data collection
- ESP32-GPS: Location tracking and transmission

**Requirements:**
- ESP32 development board
- ELM327 Bluetooth OBD-II adapter
- NEO-6M GPS module

## 🚀 Quick Start

1. **Backend:** Setup database and environment variables
2. **Frontend:** Install dependencies and start Expo
3. **Hardware:** Upload ESP32 code and configure connections

## 📊 Features

- Real-time GPS tracking
- Vehicle diagnostic monitoring
- Predictive maintenance alerts
- Anomaly detection
- Mobile-friendly interface

## 🔧 Configuration

Update configuration files in each component:
- Hardware: WiFi credentials and server URLs
- Backend: Database and API keys
- Frontend: API endpoints

## 📄 License

MIT License
