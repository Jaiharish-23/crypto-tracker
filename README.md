# JHGNO Crypto Tracker

A modern, animated cryptocurrency tracking application built with React, featuring stunning animations powered by Three.js, GSAP, and Anime.js.

## ✨ Features

- **🔐 Animated Login Page** - Beautiful Three.js background with floating particles and interactive elements
- **📊 Real-time Dashboard** - Live cryptocurrency prices with animated charts and market statistics
- **📈 Advanced Charts** - Interactive candlestick charts with multiple timeframes
- **📰 Crypto News** - Latest cryptocurrency news with auto-refresh functionality
- **🎨 Stunning Animations** - Smooth transitions using GSAP, Anime.js, and Framer Motion
- **🌙 Dark Theme** - Modern glassmorphism design with purple/blue gradient accents
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

## 🚀 Technologies Used

- **Frontend Framework**: React 18 with Vite
- **Animations**: 
  - Three.js & React Three Fiber for 3D backgrounds
  - GSAP for smooth UI transitions
  - Anime.js for interactive element animations
  - Framer Motion for component animations
- **Styling**: TailwindCSS with custom glassmorphism effects
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **API**: Base44 integration for real-time crypto data

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JHGNO_CRYPTO_TRACKER
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Login Credentials

For demo purposes, use these credentials:
- **Username**: `demo`
- **Password**: `password`

## 🎯 Project Structure

```
JHGNO_CRYPTO_TRACKER/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── LoginPage.jsx       # Animated login with Three.js
│   │   ├── ThreeBackground.jsx # 3D background component
│   │   └── ParticleSystem.jsx  # Particle animation system
│   ├── api/
│   │   └── base44Client.js     # API client with mock data
│   ├── lib/
│   │   └── utils.js           # Utility functions
│   ├── App.jsx                # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── PAGE/
│   ├── dashboard.js          # Main dashboard page
│   ├── markst.js            # Markets overview page
│   ├── chart.js             # Advanced charts page
│   └── news.js              # Crypto news page
├── component/
│   ├── pricecard.js         # Animated price cards
│   ├── marketstats.js       # Market statistics component
│   ├── candlestickchart.js  # Candlestick chart component
│   └── newcard.js           # News article cards
└── component.js             # Main layout component
```

## 🎨 Animation Features

### Three.js Background
- Floating geometric shapes with physics
- Interactive particle systems
- Dynamic lighting effects
- Responsive 3D environment

### GSAP Animations
- Smooth page transitions
- Sidebar slide-in effects
- Logo floating animations
- Logout transition effects

### Anime.js Interactions
- Button hover effects
- Form input animations
- Loading state transitions
- Staggered list animations

### Framer Motion
- Component enter/exit animations
- Hover and tap interactions
- Layout animations
- Gesture-based interactions

## 📊 API Integration

The application now uses **FREE real-time APIs** for live data:

### 🔗 **Live APIs Used:**

#### **CoinGecko API (Free)**
- **Real-time cryptocurrency prices** for 10+ major coins
- **24h price changes** and percentage movements
- **Market capitalization** and trading volumes
- **Rate limit**: 50 calls/minute (free tier)
- **No API key required**

#### **Binance API (Free)**
- **Live candlestick chart data** (OHLC)
- **Multiple timeframes**: 1h, 4h, 8h, 1d, 3d, 1w
- **Real-time price updates** every 30 seconds
- **No API key required** for public endpoints

#### **RSS News APIs (Free)**
- **Cointelegraph RSS** via RSS2JSON service
- **CoinDesk RSS** for latest crypto news
- **Real-time news updates** every 5 minutes
- **No API key required**

### 📡 **API Status Monitoring**
- **Live API status indicator** in bottom-right corner
- **Real-time monitoring** of all API endpoints
- **Automatic fallback** to mock data if APIs fail
- **Color-coded status**: Green (online), Red (offline), Yellow (checking)

### 🔄 **Fallback System**
- **Graceful degradation** when APIs are unavailable
- **Mock data fallback** ensures app always works
- **Error handling** with user-friendly messages
- **Retry mechanisms** for failed requests

## 🎛️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start production server

## 🌟 Key Components

### LoginPage
- Three.js animated background
- Particle system effects
- Form validation with animations
- Responsive design

### Dashboard
- Live price updates
- Animated market statistics
- Interactive charts
- Real-time data refresh

### Markets
- Comprehensive coin listings
- Search and filter functionality
- Favorites system
- Sortable data tables

### Charts
- Multiple timeframe support
- Interactive candlestick charts
- Price analysis tools
- Historical data visualization

### News
- Auto-refreshing news feed
- Article preview cards
- Source attribution
- Time-based updates

## 🎨 Styling

The application uses a modern dark theme with:
- Glassmorphism effects
- Purple and blue gradient accents
- Smooth transitions and hover effects
- Responsive grid layouts
- Custom scrollbars

## 🔧 Customization

### Adding New Animations
1. Import the desired animation library
2. Create animation configurations
3. Apply to components using hooks or refs
4. Test across different screen sizes

### Modifying the Theme
1. Update CSS custom properties in `src/index.css`
2. Modify TailwindCSS configuration
3. Adjust gradient colors and effects
4. Update glassmorphism opacity values

### API Configuration
1. Replace mock data in `src/api/base44Client.js`
2. Add your API endpoints
3. Update response schemas
4. Handle error states appropriately

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add animations where appropriate
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Three.js community for 3D graphics inspiration
- GSAP for smooth animation capabilities
- Anime.js for interactive animations
- Framer Motion for React-specific animations
- TailwindCSS for utility-first styling
- Lucide for beautiful icons

---

**Built with ❤️ and lots of animations by the JHGNO team**
