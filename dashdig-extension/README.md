# Dashdig Chrome Extension

Create memorable, human-readable short links with one click using Dashdig's smart URL shortener.

## Features

- ⚡ One-click URL shortening
- 📋 Automatic clipboard copy
- 🎨 Clean, modern UI matching Dashdig branding
- 💾 Local history tracking (last 50 links)
- 🚀 Fast and lightweight (<50KB)

## Installation

### Development Mode (Local Testing)

1. **Download/Clone this repository**
   ```bash
   git clone <repository-url>
   cd dashdig-extension
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `dashdig-extension` folder
   - The extension should now appear in your extensions list

5. **Pin Extension (Optional)**
   - Click the puzzle icon in Chrome toolbar
   - Find "Dashdig - Smart URL Shortener"
   - Click the pin icon to keep it visible

### Chrome Web Store (Coming Soon)

The extension will be published to the Chrome Web Store for easy installation.

## Usage

1. **Open Any Webpage**
   - Navigate to any website you want to shorten

2. **Click Extension Icon**
   - Click the Dashdig icon in your Chrome toolbar
   - The popup will show the current page URL

3. **Create Short Link**
   - Click "⚡ Create Smart Link" button
   - Wait for the smart link to be generated

4. **Copy & Share**
   - Click "📋 Copy" button to copy to clipboard
   - Share your memorable short link!

## Technical Details

### Manifest V3
Built with Chrome's latest Manifest V3 for improved security and performance.

### Permissions
- `activeTab` - To read current page URL
- `storage` - To save link history locally
- `clipboardWrite` - To copy links to clipboard

### API Integration
- **Endpoint**: `https://dashdig-production.up.railway.app/api/urls`
- **Method**: POST
- **Payload**: `{ url: string, customSlug: null }`

### File Structure
```
dashdig-extension/
├── manifest.json       # Extension configuration
├── popup.html         # UI layout
├── popup.js          # Core functionality
├── popup.css         # Styling
└── README.md         # Documentation
```

## Development

### Making Changes

1. Edit files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Dashdig extension card
4. Test your changes

### Debug Console

- Right-click the extension popup
- Select "Inspect"
- View console logs and debug information

## Troubleshooting

### Extension Not Working?

1. **Check Permissions**
   - Make sure all permissions are granted
   - Reload the extension

2. **CORS Issues**
   - Backend must allow extension origin
   - Check console for error messages

3. **Invalid URL**
   - Some URLs cannot be shortened (chrome://, about:, etc.)
   - Try on a regular webpage

4. **API Connection**
   - Verify backend is running
   - Check network tab in DevTools

### Common Errors

- **"Cannot shorten Chrome internal pages"**
  - Chrome extensions cannot shorten chrome:// or about:// pages
  - Navigate to a regular website

- **"API Error: 4xx/5xx"**
  - Backend service might be down
  - Check API endpoint availability

## Support

For issues or feature requests:
- Visit [Dashdig.com](https://dashdig.com)
- Contact support through dashboard

## Version History

### v1.0.0 (Current)
- Initial release
- Basic URL shortening
- Clipboard copy
- Local history tracking
- Manifest V3 implementation

## License

Copyright © 2025 Dashdig. All rights reserved.




