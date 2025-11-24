# Air Quality Index Search Engine

A modern, full-stack web application for real-time air quality monitoring worldwide. Features a premium UI with glassmorphism effects, smooth animations, and comprehensive air quality data.

## ✨ Features

- **🌍 Global Coverage**: Search for any city worldwide
- **⚡ Real-time Data**: Live air quality information from Open-Meteo APIs
- **📊 Comprehensive Metrics**: 
  - PM2.5 (Fine particulate matter)
  - PM10 (Coarse particulate matter)
  - O₃ (Ozone)
  - NO₂ (Nitrogen dioxide)
  - CO (Carbon monoxide)
  - Temperature (°C)
- **🎨 Premium UI Design**:
  - Vibrant purple-blue gradient background
  - Animated floating elements
  - Glassmorphism effects
  - Smooth hover animations on parameter cards
  - Color-coded AQI status (Good, Moderate, Unhealthy, etc.)
- **⚡ Performance Optimized**: 1-hour caching for faster response times
- **📱 Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express
- Axios for API calls
- Node-Cache for in-memory caching
- CORS enabled

**Frontend:**
- React (Vite)
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Inter font family

**APIs:**
- Open-Meteo Air Quality API
- Open-Meteo Weather Forecast API
- Open-Meteo Geocoding API

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node index.js
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 API Endpoints

### GET `/api/search`

Search for AQI data by city name.

**Query Parameters:**
- `city` (required): Name of the city

**Example:**
```
GET http://localhost:3000/api/search?city=London
```

**Response:**
```json
{
  "aqi": 52,
  "city": {
    "name": "London, United Kingdom"
  },
  "iaqi": {
    "pm25": { "v": 12.4 },
    "pm10": { "v": 23.1 },
    "o3": { "v": 55.0 },
    "no2": { "v": 22.6 },
    "co": { "v": 167 },
    "t": { "v": 7.1 }
  },
  "time": {
    "s": "2025-11-24T15:02:03.607Z"
  },
  "source": "cache"
}
```

## 🎨 Design Highlights

- **Modern Gradient Background**: Purple to blue gradient with animated floating elements
- **Glassmorphism**: Frosted glass effect on cards and search box
- **Micro-interactions**: Hover animations on parameter cards
- **Color Psychology**: Each parameter has a unique color scheme
- **Typography**: Inter font for clean, modern readability
- **Visual Hierarchy**: Clear separation of AQI status and detailed metrics

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Data provided by [Open-Meteo](https://open-meteo.com/)
- Icons by [Lucide](https://lucide.dev/)
