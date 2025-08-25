# ⚽ EScore - Football Hub

A modern, responsive football statistics and management platform built with React. Get real-time match data, team statistics, player information, and league standings from top football competitions around the world.

## 🌟 Features

### 🏆 **League Management**
- **Individual League Routes**: Direct access to each league's matches and standings
- **Real-time Data**: Live match updates and current standings
- **Multiple Competitions**: Support for Premier League, La Liga, Bundesliga, Serie A, and more
- **Breadcrumb Navigation**: Easy navigation between leagues and sections

### ⚽ **Match Information**
- **Live Matches**: Real-time match status and scores
- **Match Filtering**: Filter by matchday, status, stage, season, and date range
- **Detailed Statistics**: Match details, venues, and team information
- **Responsive Design**: Optimized for all device sizes

### 👥 **Team Management**
- **Team Profiles**: Comprehensive team information and statistics
- **Squad Details**: Player rosters and team compositions
- **Team History**: Founded dates, venues, and club information

### 📊 **Standings & Statistics**
- **League Tables**: Current standings with form indicators
- **Visual Indicators**: Color-coded positions (Champions League, Europa League, Relegation)
- **Form Tracking**: Recent match results and team performance

### 🎨 **Modern UI/UX**
- **Dark Mode Support**: Beautiful dark theme with smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Enhanced user experience with micro-interactions
- **Accessibility**: Screen reader friendly with proper focus management

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heshamibrahem1999/escore.git
   cd escore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🛠️ Built With

- **React 18** - Frontend framework
- **React Router** - Navigation and routing
- **CSS3** - Styling with modern features
- **Football API** - Real-time football data
- **Responsive Design** - Mobile-first approach

## 📱 Features Overview

### **Home Dashboard**
- Today's matches overview
- Quick navigation to leagues
- Date navigation for historical matches
- Featured competitions

### **League Pages**
- Individual league routes (`/league/:id/matches`, `/league/:id/standings`)
- Automatic data fetching
- Filter and search capabilities
- Real-time updates

### **Team Pages**
- Comprehensive team profiles
- Player rosters and statistics
- Team history and information
- Performance metrics

### **Player Pages**
- Detailed player profiles
- Statistics and performance data
- Career information
- Team affiliations

## 🎨 Design System

### **Color Scheme**
- **Primary**: Orange gradient (#ed8936 to #dd6b20)
- **Secondary**: Green gradient (#48bb78 to #38a169)
- **Dark Mode**: Deep blues and grays with proper contrast
- **Status Colors**: Green (success), Blue (info), Red (errors), Yellow (warnings)

### **Typography**
- Clean, modern sans-serif fonts
- Proper hierarchy with different font weights
- Optimized for readability across devices

### **Components**
- **Cards**: Modern card design with hover effects
- **Buttons**: Gradient buttons with smooth animations
- **Tables**: Responsive tables with visual indicators
- **Forms**: Clean form design with proper validation

## 📊 API Integration

The application integrates with a football API to provide:
- Real-time match data
- Team and player statistics
- League standings
- Historical data

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_KEY=your_api_key_here
REACT_APP_API_BASE_URL=https://api.football-data.org/v4
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push to main branch

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the setup prompts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hesham Ibrahim**
- GitHub: [@heshamibrahem1999](https://github.com/heshamibrahem1999)

## 🙏 Acknowledgments

- Football API for providing comprehensive football data
- React community for excellent documentation and tools
- All contributors who helped improve this project

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact the author via GitHub
- Check the documentation for common solutions

---

**Made with ❤️ for football fans around the world**
