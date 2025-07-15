# GMAT Study Tracker

A comprehensive GMAT preparation tracking system combining a Chrome browser extension with a Progressive Web App (PWA) for seamless study session management and progress analytics.

## 🎯 Features

### Browser Extension
- **Quick Session Logging**: One-click buttons for common study sessions (Quant 30min, Verbal 45min, IR 20min)
- **Custom Session Entry**: Detailed form for logging specific topics, scores, and notes
- **Streak Tracking**: Visual streak counter displayed on extension badge
- **Dashboard Access**: Direct link to the full PWA dashboard

### Progressive Web App (PWA)
- **Comprehensive Dashboard**: Overview of study statistics and progress
- **Interactive Charts**: Visual progress tracking with Chart.js
- **AI-Powered Insights**: Personalized recommendations based on study patterns
- **Session Management**: Add, view, and analyze study sessions
- **Offline Support**: Continue tracking even without internet connection
- **Data Export/Import**: Backup and restore your study data

### Smart Analytics
- **Streak Calculation**: Automatic daily study streak tracking
- **Subject Balance**: Analysis of time distribution across GMAT sections
- **Performance Trends**: Score improvement tracking over time
- **Weekly Progress**: Visual representation of study consistency
- **Personalized Recommendations**: AI-generated study suggestions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Chrome browser for extension testing
- Modern web browser for PWA

### Quick Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd GMATStudyTrackerProject

# Install all dependencies
npm run install:deps

# Start the PWA
npm run dev

# Install the extension (opens Chrome with instructions)
npm run extension:install
```

### Manual Installation

1. **Set up the PWA**
   ```bash
   cd pwa
   npm install
   npm run dev
   ```

2. **Install the Browser Extension**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `extension` folder
   - The GMAT Study Tracker extension should now appear in your browser

3. **Access the PWA**
   - Open your browser and go to `http://localhost:5173`
   - For production, build with `npm run build` and serve the `dist` folder

## 📁 Project Structure

```
GMATStudyTrackerProject/
├── README.md                    # Main documentation
├── package.json                 # Root package manager
├── extension/                   # Chrome Extension
│   ├── manifest.json           # Extension configuration
│   ├── popup.html              # Extension popup UI
│   ├── popup.js                # Extension logic
│   ├── styles.css              # Extension styles
│   └── README.md               # Extension docs
├── pwa/                        # Progressive Web App
│   ├── package.json            # PWA dependencies
│   ├── vite.config.js          # Build configuration
│   ├── index.html              # PWA entry point
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── components/         # React components
│   │   │   ├── Dashboard.jsx   # Analytics dashboard
│   │   │   ├── SessionForm.jsx # Log sessions
│   │   │   ├── ProgressChart.jsx # Study charts
│   │   │   └── AIInsights.jsx  # AI-powered insights
│   │   └── utils/              # Utility functions
│   │       ├── storage.js      # Data management
│   │       └── analytics.js    # Insights generation
├── shared/                     # Shared utilities
│   ├── storage.js              # Cross-platform storage
│   ├── types.js                # Data structures
│   └── config.js               # App configuration
└── scripts/                    # Build scripts
    ├── build-extension.js      # Extension builder
    └── install-extension.js    # Installation helper
```

## 💾 Data Storage

The application uses a hybrid storage approach:
- **Extension**: Chrome Storage API for quick access and sync
- **PWA**: localStorage with Chrome Storage sync when available
- **Cross-platform**: Automatic sync between extension and PWA
- **Export/Import**: JSON-based backup system

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Start PWA dev server
npm run dev:pwa          # Same as above

# Building
npm run build            # Build both PWA and extension
npm run build:pwa        # Build PWA only
npm run build:extension  # Build extension only

# Extension
npm run extension:install   # Get installation help
npm run extension:package   # Package as .zip for store

# Dependencies
npm run install:deps     # Install all project dependencies
```

### Extension Development
The extension uses vanilla JavaScript and can be loaded directly into Chrome for testing. Refresh the extension in `chrome://extensions/` after making changes.

### Adding New Features
1. **Extension**: Modify `popup.js` for new extension functionality
2. **PWA**: Add new components in `src/components/`
3. **Analytics**: Extend `utils/analytics.js` for new insights
4. **Storage**: Update `shared/storage.js` for new data structures

## 📊 Analytics Features

### Insights Generated
- Study activity trends (weekly comparison)
- Subject balance analysis
- Session length optimization
- Performance improvement tracking
- Consistency streak monitoring

### Recommendations Provided
- Subject focus balancing
- Study frequency optimization
- Session length suggestions
- Practice test timing
- Difficulty level adjustments

## 🎨 Customization

### Themes
The app uses CSS custom properties for easy theming. Modify the `:root` variables in `pwa/src/index.css`:

```css
:root {
  --primary-color: #0066cc;
  --secondary-color: #004499;
  /* ... other theme variables */
}
```

### Adding New Study Subjects
Update the `subjects` array in `SessionForm.jsx`:

```javascript
const subjects = [
  'Quantitative',
  'Verbal',
  'Integrated Reasoning',
  'Analytical Writing',
  'Full Practice Test',
  'Your New Subject'  // Add here
]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test both extension and PWA functionality
5. Commit your changes: `git commit -m 'Add feature-name'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 🚀 Deployment

### PWA Deployment
```bash
# Build for production
cd pwa
npm run build

# Deploy dist/ folder to your hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Extension Publishing
```bash
# Package extension
npm run extension:package

# Upload gmat-study-tracker-extension.zip to Chrome Web Store
```

## 🛠️ Troubleshooting

### Common Issues
- **Extension not loading**: Enable Developer mode in Chrome
- **Data not syncing**: Check Chrome sync settings
- **PWA not installing**: Ensure HTTPS in production
- **Charts not displaying**: Check Chart.js dependencies

### Getting Help
1. Check the browser console for error messages
2. Ensure both extension and PWA are properly installed
3. Try refreshing the extension in Chrome settings
4. Clear browser cache if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chart.js for beautiful data visualization
- React team for the excellent framework
- Chrome Extensions documentation
- GMAT prep community for inspiration

## 📞 Support

For issues or feature requests:
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Open a discussion on GitHub
- 📧 **Email**: support@your-domain.com
- 📚 **Documentation**: Check the `/extension/README.md` for extension-specific help

Happy studying! 🎓
