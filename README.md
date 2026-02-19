# Ramadan Worship Tracker

A beautiful, mobile-first web application to track your daily Ramadan worship goals. Built with React and optimized for all devices from mobile phones to desktop screens.

## Features

### Daily Tracker
- 📅 Current Hijri date and day number display
- ✅ 6 interactive worship goals with checkboxes:
  - Praying all 5 prayers in mosque
  - Praying 12 Sunnah rakah
  - Reading 20 pages of Quran
  - Reading 20 pages during Tarawih
  - Making Dua (supplication)
  - Reading morning & evening Athkar
- 📊 Real-time progress bar with percentage
- 👆 Swipe gestures to navigate between days
- 🎉 Visual celebration when all goals completed

### Progress Overview
- 📈 Calendar view of all 30 days of Ramadan
- 🎯 Color-coded progress indicators:
  - 🔴 0-33%: Low progress (red)
  - 🟡 34-66%: Medium progress (yellow)
  - 🟢 67-100%: Good progress (green)
- 📊 Statistics dashboard:
  - Overall completion percentage
  - Current streak
  - Best streak
  - Number of perfect days
  - Best day
- 💾 Export/Import data functionality

### Design
- 🕌 Islamic aesthetic with calming colors (green, gold, deep blue)
- 🌙 Crescent moon and mosque motifs
- ✨ Beautiful animations and transitions
- 📱 Mobile-first, fully responsive design
- 👆 Touch-friendly interface (44px minimum tap targets)
- 🎨 Gradient backgrounds and glassmorphism effects

## Technical Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Custom CSS with CSS variables
- **State Management**: React hooks + localStorage
- **Icons**: Custom SVG icons
- **Typography**: Amiri (Arabic) + Inter (English)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

4. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

### Daily Tracking
- Check off goals as you complete them throughout the day
- Use arrow buttons or swipe to navigate between days
- View your daily progress percentage
- Edit previous days if needed

### Viewing Progress
- Go to the Progress tab to see all 30 days
- Click on any day to jump to it
- View your statistics and streaks
- Export your data for backup

### Data Management
- **Export**: Download your progress as a JSON file
- **Import**: Restore from a previous backup
- **Reset**: Clear all data and start fresh

## Mobile Optimizations

- ✅ Mobile-first responsive design
- ✅ Bottom navigation bar for easy thumb access
- ✅ Swipe gestures for day navigation
- ✅ Touch-friendly buttons (minimum 44px)
- ✅ No horizontal scrolling
- ✅ Smooth animations optimized for mobile
- ✅ Safe area support for notched devices
- ✅ PWA-ready with manifest.json

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (12+)
- Chrome for Android

## Customization

The app uses CSS variables for easy theming. Key colors:
- Primary: `#0d4a3a` (Deep green)
- Accent: `#d4af37` (Gold)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Yellow/Orange)
- Danger: `#e74c3c` (Red)

## Ramadan 2025 Dates

The app is pre-configured for Ramadan 2025 (starting approximately March 1, 2025). The Hijri date display is simplified - for production use, consider integrating a proper Hijri date library like `moment-hijri`.

## License

MIT License - feel free to use and modify as needed.

## Credits

Built with ❤️ for the Muslim community. May Allah accept your worship during Ramadan.
