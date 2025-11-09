# Dashdig - Humanize and Shortenize URLs
## Browser Extension Installation Guide

## 🌐 Cross-Browser Installation

Dashdig extension supports all major browsers including Chrome, Firefox, Edge, Brave, Opera, and Safari.

---

## 🔷 Chrome Installation

### Method 1: Chrome Web Store (Coming Soon)
Once published, you'll be able to install directly from the Chrome Web Store.

### Method 2: Developer Mode (Current)

1. **Download the extension files**
   - Clone or download this repository
   - Ensure all files are in the `dashdig-extension` folder

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `dashdig-extension` folder
   - Extension will appear in your extensions list

5. **Pin to Toolbar (Recommended)**
   - Click the puzzle piece icon 🧩 in Chrome toolbar
   - Find "Dashdig - Humanize and Shortenize URLs"
   - Click the pin icon 📌 to keep it visible

---

## 🦊 Firefox Installation

### Method 1: Firefox Add-ons (Coming Soon)
Once published, you'll be able to install from Firefox Add-ons marketplace.

### Method 2: Temporary Installation (Development)

1. **Download the extension files**
   - Clone or download this repository

2. **Open Firefox Debugging Page**
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Or type `about:debugging` in address bar and click "This Firefox"

3. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..."
   - Navigate to the `dashdig-extension` folder
   - Select the `manifest.json` file

4. **Extension is Active**
   - Look for the Dashdig icon in your toolbar
   - Note: Temporary add-ons are removed when Firefox restarts

### Method 3: Permanent Installation (Advanced)

For permanent Firefox installation, you'll need to:
1. Package the extension as an `.xpi` file
2. Sign it through Mozilla's Developer Hub
3. Install the signed `.xpi`

---

## 🔷 Microsoft Edge Installation

Edge uses the same Chromium engine as Chrome, so installation is nearly identical.

1. **Download the extension files**

2. **Open Edge Extensions Page**
   - Navigate to `edge://extensions`
   - Or click Menu (⋯) → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the left sidebar

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `dashdig-extension` folder

5. **Pin Extension**
   - Click the extension icon in toolbar
   - Pin Dashdig for easy access

---

## 🦁 Brave Browser Installation

Brave is Chromium-based and follows the same process as Chrome:

1. Navigate to `brave://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dashdig-extension` folder
5. Pin to toolbar

---

## 🔴 Opera Installation

Opera also uses Chromium:

1. Navigate to `opera://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dashdig-extension` folder
5. Pin to toolbar

---

## 🧭 Safari Installation (macOS)

Safari requires converting the extension using Xcode:

### Prerequisites
- macOS 10.14.6 or later
- Xcode 12 or later
- Apple Developer account (for distribution)

### Steps

1. **Convert Extension**
   ```bash
   xcrun safari-web-extension-converter /path/to/dashdig-extension
   ```

2. **Follow the Prompts**
   - Choose a bundle identifier (e.g., `com.dashdig.extension`)
   - Select app name
   - Xcode project will be created

3. **Open in Xcode**
   - Open the generated `.xcodeproj` file
   - Build and run the project

4. **Enable in Safari**
   - Open Safari → Preferences → Extensions
   - Enable "Dashdig - Humanize and Shortenize URLs"

5. **Grant Permissions**
   - Allow the extension to run on websites

---

## ✅ Post-Installation Setup

### First Launch

1. **Click the Dashdig icon** in your browser toolbar
2. The extension popup will open
3. **No account required** - start shortening immediately!

### Test the Extension

1. Navigate to any website (e.g., amazon.com/long-product-url)
2. Click the Dashdig icon
3. Click "🔗 Shorten Current Tab"
4. Your human-readable short link will be created!

---

## 🎨 Features Overview

**Humanize and Shortenize URLs** with powerful features:

- ⚡ **One-click shortening** - Shorten current tab instantly
- 📝 **Custom URLs** - Paste any URL to shorten
- 📋 **Quick copy** - Copy to clipboard with one click
- 📱 **QR codes** - Generate QR codes for your links
- 🔗 **Recent links** - Access your last 10 shortened links
- 📊 **Click tracking** - See click stats (coming soon)

---

## 🔧 Troubleshooting

### Extension Not Loading?

**Chrome/Edge/Brave:**
- Make sure Developer mode is enabled
- Check that you selected the correct folder
- Look for errors in `chrome://extensions`

**Firefox:**
- Verify `manifest.json` is in the root folder
- Check `about:debugging` for error messages
- Try reloading the temporary add-on

### Extension Icon Not Showing?

- Pin the extension to your toolbar
- Check if extension is enabled in extensions page
- Restart your browser

### "Cannot shorten this page" Error?

Some pages cannot be shortened:
- `chrome://` or `about://` internal pages
- Browser settings pages
- Local file URLs (`file://`)

### API Connection Issues?

- Check your internet connection
- Verify backend is running at: `https://dashdig-backend-production.up.railway.app`
- Check browser console for detailed errors

### Permission Denied?

- Grant necessary permissions in browser settings
- Reload the extension
- Check host permissions in `manifest.json`

---

## 🔄 Updating the Extension

### Development Mode

1. Make changes to extension files
2. Go to your browser's extensions page
3. Click the "Reload" or "↻" button on Dashdig extension
4. Test your changes

### From Store (Future)

Extensions installed from official stores will auto-update.

---

## 🛡️ Permissions Explained

Dashdig requests these permissions:

- **`activeTab`** - Read current page URL (only when you click the icon)
- **`contextMenus`** - Add right-click menu options
- **`storage`** - Save your recent links locally
- **`clipboardWrite`** - Copy links to clipboard
- **`host_permissions`** - Connect to Dashdig API servers

We take privacy seriously:
- ✅ No tracking or analytics
- ✅ No data sold to third parties
- ✅ Recent links stored locally only
- ✅ Minimal permissions required

---

## 📦 Files Structure

```
dashdig-extension/
├── manifest.json         # Extension configuration & permissions
├── popup.html           # Extension UI layout
├── popup.css            # Dashdig brand styling
├── popup.js             # Core functionality & API integration
├── icons/               # Extension icons (16, 32, 48, 128px)
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   ├── icon-128.png
│   └── icon.svg
├── INSTALLATION.md      # This file
└── README.md           # Project documentation
```

---

## 🚀 Next Steps

1. **Start shortening URLs** - Click the icon on any page
2. **Join the community** - Visit [dashdig.com](https://dashdig.com)
3. **Report issues** - Found a bug? Let us know!
4. **Request features** - We'd love to hear your ideas

---

## 📞 Support

Need help?

- 📧 **Email**: support@dashdig.com
- 🌐 **Website**: [dashdig.com](https://dashdig.com)
- 📊 **Dashboard**: [dashdig.com/dashboard](https://dashdig.com/dashboard)
- 📚 **Docs**: [dashdig.com/docs](https://dashdig.com/docs)

---

## 📄 Version

**Current Version**: 1.2.0

**What's New**:
- ✨ Updated tagline: "Humanize and Shortenize URLs"
- 📝 Refined branding messaging across all documentation
- ✨ Complete brand redesign
- ⚡ New "Humanize and Shortenize" tagline
- 🎨 Modern UI with orange lightning bolt theme
- 🌐 Cross-browser compatibility
- 📱 QR code generation
- 🔗 Recent links history

---

**Made with ⚡ by the Dashdig team**
