# ⚡ Dashdig Chrome Extension

Create memorable, human-readable short links with one click!

## Features

- 🚀 **One-Click Shortening** - Create smart links instantly from any page
- 🧠 **AI-Powered Slugs** - Backend generates human-readable URLs automatically
- 📋 **Quick Copy** - Copy short links to clipboard with one click
- 💾 **History** - Stores last 50 created links locally
- 🎨 **Clean Design** - Matches Dashdig brand with modern UI
- ⚡ **Lightweight** - < 50KB total size, no external dependencies

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Generate Icons** (First Time Only):
   ```bash
   cd dashdig-extension/icons
   open generate-icons.html
   # Click "Generate All Icons" button
   ```

2. **Open Chrome Extensions Page**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load Extension**:
   - Click "Load unpacked"
   - Select the `dashdig-extension` folder
   - Extension icon should appear in toolbar

4. **Pin Extension** (Optional):
   - Click puzzle icon in Chrome toolbar
   - Find "Dashdig - Smart URL Shortener"
   - Click pin icon

### Method 2: Chrome Web Store (Future)

Once published to Chrome Web Store:
1. Visit extension page
2. Click "Add to Chrome"
3. Confirm installation

## Usage

### Creating a Short Link

1. **Navigate** to any webpage you want to shorten
2. **Click** the Dashdig extension icon (⚡)
3. **Click** "Create Smart Link" button
4. **Copy** the generated short URL
5. **Share** your memorable link!

### Example

```
Original URL:
https://www.amazon.com/Apple-AirPods-Pro-2nd-Generation/dp/B0CHWRXH8B?keywords=airpods+pro...

Generated Short URL:
https://dashdig.com/Amazon.AirPods.Pro.2ndGen
```

## Features & Screenshots

### Main Popup

```
┌──────────────────────────────────┐
│ ⚡ Dashdig      [Dashboard]      │
├──────────────────────────────────┤
│ Current Page:                    │
│ https://example.com/long-url...  │
├──────────────────────────────────┤
│   🚀 Create Smart Link           │
├──────────────────────────────────┤
│ Your Smart Link:                 │
│ dashdig.com/Example.Page  [📋]   │
│ ✓ Copied to clipboard!           │
└──────────────────────────────────┘
```

### Features

- **Current Page Display**: Shows URL of active tab
- **Smart Link Generation**: AI-powered backend creates readable slugs
- **Copy Button**: One-click clipboard copy
- **Dashboard Link**: Quick access to full Dashdig dashboard
- **Error Handling**: Clear error messages if something goes wrong
- **Loading States**: Visual feedback during API calls

## Technical Details

### Manifest V3

Uses latest Chrome Extension Manifest V3 for security and performance.

### Permissions

- `activeTab` - Get URL of current tab
- `storage` - Save history locally
- `clipboardWrite` - Copy to clipboard
- `host_permissions` - Call Dashdig API

### API Integration

**Endpoint**: `https://dashdig-backend-production-8e12.up.railway.app/api/urls`

**Request**:
```json
POST /api/urls
{
  "url": "https://example.com/page",
  "customSlug": null,
  "keywords": []
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "shortUrl": "https://dashdig.com/Example.Page",
    "slug": "Example.Page",
    "qrCode": "data:image/png;base64,...",
    "metadata": {...}
  }
}
```

### File Structure

```
dashdig-extension/
├── manifest.json       # Extension config (Manifest V3)
├── popup.html          # Extension popup UI
├── popup.js            # Main logic and API calls
├── popup.css           # Styling (Dashdig brand)
├── icons/
│   ├── icon.svg        # Source SVG icon
│   ├── icon16.png      # 16x16 toolbar icon
│   ├── icon48.png      # 48x48 extension management
│   ├── icon128.png     # 128x128 Chrome Web Store
│   └── generate-icons.html  # Icon generator tool
├── generate-icons.js   # Icon generation helper
└── README.md           # This file
```

### Size & Performance

- **Total Size**: < 50KB
- **Dependencies**: None (vanilla JS)
- **Load Time**: < 100ms
- **API Call**: ~500-1000ms (network dependent)

## Development

### Prerequisites

- Google Chrome browser
- Dashdig backend running
- Basic knowledge of JavaScript

### Local Development

1. **Clone/Download** the extension folder

2. **Edit Files**:
   - `popup.html` - Modify UI structure
   - `popup.css` - Change styles
   - `popup.js` - Update logic/API calls
   - `manifest.json` - Change permissions/config

3. **Test Changes**:
   - Go to `chrome://extensions/`
   - Click reload icon on Dashdig extension
   - Test by clicking extension icon

4. **Debug**:
   - Right-click extension icon → "Inspect popup"
   - View console logs and network requests

### Configuration

To change API endpoint, edit `popup.js`:

```javascript
const API_BASE = 'https://your-backend-url.com';
const API_ENDPOINT = `${API_BASE}/api/urls`;
```

## Browser Support

- ✅ **Chrome** 88+ (Manifest V3 support)
- ✅ **Edge** 88+ (Chromium-based)
- ✅ **Brave** (Chromium-based)
- ✅ **Opera** (Chromium-based)
- ❌ Firefox (requires Manifest V2 conversion)
- ❌ Safari (requires different format)

## Troubleshooting

### Extension Not Loading

1. Check Chrome version (need 88+)
2. Enable Developer mode in `chrome://extensions/`
3. Check console for errors

### API Calls Failing

1. Check `popup.js` console logs
2. Verify backend URL is correct
3. Check CORS settings on backend
4. Ensure backend is running

### Icons Not Showing

1. Generate icons using `generate-icons.html`
2. Place PNG files in `icons/` folder
3. Reload extension
4. Clear Chrome cache if needed

### Copy Not Working

1. Check `clipboardWrite` permission in manifest
2. Try fallback (select and Ctrl+C)
3. Check browser clipboard permissions

## Roadmap

### v1.1 (Next)
- [ ] History page (view last 50 links)
- [ ] Custom slug input option
- [ ] Dark mode support
- [ ] Keyboard shortcuts

### v1.2 (Future)
- [ ] QR code display
- [ ] Analytics preview
- [ ] Bulk link creation
- [ ] Export history

### v2.0 (Later)
- [ ] Firefox support (Manifest V2)
- [ ] Safari support
- [ ] Context menu integration
- [ ] Omnibox integration (`dashdig <url>`)

## Contributing

This extension is part of the Dashdig URL shortener project.

To contribute:
1. Test thoroughly
2. Follow existing code style
3. Keep bundle size small
4. Document changes

## License

Part of the Dashdig project - see main repository for license.

## Support

- **Dashboard**: https://dashdig.com/dashboard
- **API Docs**: See main Dashdig repository
- **Issues**: Report in main Dashdig repo

## Changelog

### v1.0.0 (October 2025)
- ✅ Initial release
- ✅ One-click link shortening
- ✅ Smart URL generation
- ✅ Copy to clipboard
- ✅ History storage (last 50 links)
- ✅ Dashboard link
- ✅ Error handling
- ✅ Loading states
- ✅ Manifest V3

---

**Made with ⚡ by Dashdig**



