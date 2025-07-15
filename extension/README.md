# GMAT Study Tracker - Chrome Extension

A Chrome browser extension for quick GMAT study session logging with seamless integration to the main PWA dashboard.

## Features

- **Quick Session Logging**: One-click buttons for common study sessions
  - Quantitative: 30 minutes
  - Verbal: 45 minutes  
  - Integrated Reasoning: 20 minutes
- **Custom Session Entry**: Detailed form for specific topics and scores
- **Streak Tracking**: Visual streak counter displayed on extension badge
- **Dashboard Access**: Direct link to the full PWA dashboard
- **Chrome Storage Sync**: Automatic data synchronization across devices

## Installation

### Development Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this `extension` folder
4. The GMAT Study Tracker extension will appear in your browser toolbar

### Production Installation
1. Download the `.crx` file from releases
2. Drag and drop it into Chrome extensions page
3. Click "Add Extension" when prompted

## Usage

### Quick Logging
Click the extension icon and use the preset buttons:
- **Quant 30min**: Logs a 30-minute Quantitative session
- **Verbal 45min**: Logs a 45-minute Verbal session  
- **IR 20min**: Logs a 20-minute Integrated Reasoning session

### Custom Sessions
1. Click "Custom Session" in the popup
2. Fill in the detailed form:
   - Subject (dropdown)
   - Duration in minutes
   - Topic (optional)
   - Score (optional)
   - Notes (optional)
3. Click "Save Session"

### Viewing Progress
- Current streak is always visible in the popup
- Click "Open Dashboard" to view detailed analytics in the PWA
- Badge shows current streak count

## Technical Details

### Files Structure
- `manifest.json`: Extension configuration and permissions
- `popup.html`: Extension popup interface
- `popup.js`: Core extension logic and Chrome API integration
- `styles.css`: Popup styling and responsive design

### Permissions
- `storage`: For saving session data locally and syncing across devices
- `notifications`: For study reminders and streak notifications

### Storage Format
Sessions are stored using Chrome Storage API with this structure:
```javascript
{
  subject: 'Quantitative',
  duration: 30,
  topic: 'Algebra',
  score: 85,
  notes: 'Focused on quadratic equations',
  date: '2025-07-14T10:30:00.000Z',
  timestamp: 1721819400000
}
```

## Development

### Testing Changes
1. Make your code changes
2. Go to `chrome://extensions/`
3. Click the refresh icon on the GMAT Study Tracker extension
4. Test the updated functionality

### Adding New Features
- **New quick-add buttons**: Modify the `quickAdd` function in `popup.js`
- **Additional form fields**: Update both `popup.html` and the form handling in `popup.js`
- **UI changes**: Edit `styles.css` and `popup.html`

### Chrome API Usage
The extension uses:
- `chrome.storage.local`: For session data persistence
- `chrome.action.setBadgeText`: For displaying streak count
- `chrome.tabs.create`: For opening the PWA dashboard

## Troubleshooting

### Extension Not Loading
1. Ensure "Developer mode" is enabled
2. Check the console for error messages
3. Verify all files are in the correct directory structure

### Data Not Syncing
1. Check Chrome sync is enabled in browser settings
2. Verify storage permissions in `manifest.json`
3. Clear extension data and reload if needed

### Badge Not Updating
1. The badge shows current study streak
2. Streak resets if you miss a day of studying
3. Refresh the extension if the count seems incorrect

## Privacy

- All data is stored locally using Chrome Storage API
- No data is sent to external servers
- Sync is handled through your Chrome browser account
- You can export/clear all data through the PWA dashboard

## Support

For issues or feature requests:
1. Check the browser console for error messages
2. Try refreshing the extension
3. Clear browser cache if needed
4. Report issues in the main project repository
