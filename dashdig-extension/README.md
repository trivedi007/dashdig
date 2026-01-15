# Dashdig Chrome Extension

> **Humanize and Shortenize** - Transform ugly URLs into human-readable links with AI

[![Version](https://img.shields.io/badge/version-2.0.0-orange.svg)](https://github.com/dashdig/extension)
[![Manifest](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)

---

## Features

- **One-Click Shortening** - Shorten any URL with a single click
- **Current Tab URL** - Instantly grab and shorten the current page
- **Context Menu** - Right-click any link to shorten with Dashdig
- **QR Code Generation** - Generate and download QR codes for your links
- **Recent Links History** - Access your 10 most recent shortened URLs
- **Clipboard Integration** - One-click copy to clipboard with toast notification
- **Badge Counter** - See how many links you've shortened today
- **Before/After Display** - Visual comparison of ugly vs humanized URLs
- **Offline Support** - View cached recent links without internet

---

## Installation

### Load as Unpacked Extension (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/dashdig.git
   cd dashdig/dashdig-extension
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in your browser
   - Or go to Menu > More Tools > Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `dashdig-extension` folder
   - The extension should now appear in your toolbar

5. **Pin the Extension (Recommended)**
   - Click the puzzle piece icon in the toolbar
   - Find "Dashdig" and click the pin icon

### From Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store after review.

---

## Usage

### Basic Shortening
1. Click the Dashdig icon in your toolbar
2. Paste a URL or click "Use Current Tab URL"
3. Click "Dig This!"
4. Copy your shortened URL or view the QR code

### Context Menu
1. Right-click on any link on a webpage
2. Select "Shorten with Dashdig"
3. A notification confirms the shortened URL

### Recent Links
- Your last 10 shortened URLs are saved locally
- Click any recent link to open it in a new tab
- Click "Clear All" to remove history

### QR Code
1. After shortening a URL, click "QR Code"
2. View the generated QR code in the modal
3. Click "Download QR" to save as PNG

---

## File Structure

```
dashdig-extension/
├── manifest.json              # Extension manifest (v3)
├── popup/
│   ├── popup.html             # Main popup UI
│   ├── popup.css              # Branded styles
│   └── popup.js               # Popup logic & QR generation
├── background/
│   └── service-worker.js      # Context menu, badge, background tasks
├── icons/
│   ├── icon-16.png            # Toolbar icon
│   ├── icon-32.png            # Menu icon
│   ├── icon-48.png            # Extensions page
│   ├── icon-128.png           # Chrome Web Store
│   └── icon.svg               # Source SVG
├── README.md                  # This file
└── package.json               # Build configuration
```

---

## API Integration

The extension connects to the Dashdig API:

- **Endpoint**: `POST https://dashdig-production.up.railway.app/api/shorten`
- **Request Body**:
  ```json
  { "url": "https://example.com/very-long-url-here" }
  ```
- **Response**:
  ```json
  {
    "data": {
      "shortUrl": "https://dashdig.com/Human.Readable.Slug",
      "slug": "Human.Readable.Slug"
    }
  }
  ```

---

## Testing Checklist

### Functionality Tests
- [ ] Extension loads without errors
- [ ] Popup opens when clicking icon
- [ ] "Use Current Tab URL" fills input correctly
- [ ] "Dig This!" button shortens URL successfully
- [ ] Copy button copies URL to clipboard
- [ ] Toast notification shows on copy
- [ ] QR code modal opens and displays code
- [ ] QR code can be downloaded as PNG
- [ ] Recent links are saved and displayed
- [ ] Recent links can be clicked to open
- [ ] Clear All removes recent links
- [ ] Context menu appears on right-click link
- [ ] Context menu shortens links successfully
- [ ] Badge shows today's link count
- [ ] Badge resets at midnight

### Error Handling Tests
- [ ] Invalid URL shows error message
- [ ] Network error shows appropriate message
- [ ] Internal browser pages show error
- [ ] Rate limit (429) shows appropriate message
- [ ] Server error (500) shows appropriate message

### UI Tests
- [ ] Dark theme (#1a1a2e) displays correctly
- [ ] Orange accent (#FF6B35) is consistent
- [ ] Animations are smooth (hover, loading)
- [ ] Loading spinner appears during API calls
- [ ] Before/After comparison displays correctly
- [ ] Success green and error red states work

---

## Chrome Web Store Submission Checklist

### Required Assets
- [x] 128x128 PNG icon
- [ ] At least 1 screenshot (1280x800 or 640x400)
- [ ] Promotional tile (440x280) - optional
- [ ] Small promotional tile (96x96) - optional

### Store Listing
- [x] Title: "Dashdig - Humanize and Shortenize" (max 45 chars)
- [x] Summary: "Transform ugly URLs into human-readable links with AI. Dig This!" (max 132 chars)
- [ ] Detailed description with features
- [ ] Category: Productivity
- [ ] Language: English

### Privacy & Permissions Justification

| Permission | Justification |
|-----------|---------------|
| `activeTab` | Read current tab URL when user clicks extension |
| `contextMenus` | Add "Shorten with Dashdig" right-click option |
| `storage` | Save recent links locally in browser |
| `clipboardWrite` | Copy shortened URLs to clipboard |
| `host_permissions` | Communicate with Dashdig API servers |

### Technical Requirements
- [x] Manifest v3 compliant
- [x] No external scripts (all code bundled)
- [x] Content Security Policy defined
- [x] Works offline (shows cached data)
- [x] Fast popup load time (<100ms)

---

## Troubleshooting

### Extension not loading
- Ensure all files are present in the folder structure
- Check for JSON syntax errors in manifest.json
- Look for errors on chrome://extensions/ page
- Try removing and re-adding the extension

### API errors
- Verify internet connection
- Check if API is online: https://dashdig-production.up.railway.app/health
- Ensure URL starts with http:// or https://
- Check browser console for detailed error messages

### Context menu not appearing
- Reload the extension from chrome://extensions/
- Verify contextMenus permission in manifest.json
- Restart Chrome browser

### QR code not generating
- Check browser console for errors
- Ensure canvas element exists in popup.html
- Try reloading the extension

---

## Development

### No Build Required
This extension uses vanilla JavaScript and requires no build step. Simply edit the files and reload the extension in Chrome.

### Reload Changes
1. Go to `chrome://extensions/`
2. Find Dashdig extension
3. Click the reload icon
4. Reopen the popup to see changes

### Debug Console
1. Click the Dashdig extension icon
2. Right-click the popup
3. Select "Inspect"
4. View Console tab for logs

---

## Brand Assets

### Colors
- **Primary Orange**: `#FF6B35`
- **Dark Background**: `#1a1a2e`
- **Card Background**: `#252540`
- **Success Green**: `#4ade80`
- **Error Red**: `#f87171`

### Typography
- **Primary Font**: Inter, system-ui
- **Monospace**: SF Mono, Consolas

---

## Support

- **Website**: https://dashdig.com
- **Documentation**: https://dashdig.com/docs
- **Dashboard**: https://dashdig.com/dashboard
- **Issues**: https://github.com/yourusername/dashdig/issues

---

## Version History

### v2.0.0 (2025-01-15)
- Complete restructure with popup/ and background/ folders
- Added service worker for context menu support
- Added "Shorten with Dashdig" right-click menu
- QR code generation with canvas
- Before/After URL comparison display
- Badge showing daily shortened count
- Toast notifications on copy
- Improved error handling
- Production-ready codebase

### v1.2.5 (2025-01-09)
- Premium glass morphism UI design
- 3D button effects
- Enhanced animations

### v1.2.4 (2025-01-09)
- Fixed client-side slug generation
- Backend AI handles all slugs

### v1.0.0 (2025-01-01)
- Initial release

---

**Made with lightning by the Dashdig team**
