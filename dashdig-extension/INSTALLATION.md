# 🚀 Dashdig Chrome Extension - Installation Guide

## Quick Start (5 minutes)

### Step 1: Generate Icons

**Option A: Browser-based (Recommended)**
```bash
1. Open: dashdig-extension/icons/generate-icons.html
2. Click: "Generate All Icons" button
3. Download: icon16.png, icon48.png, icon128.png
4. Move files to: dashdig-extension/icons/ folder
```

**Option B: Online Converter**
```bash
1. Go to: https://svg2png.com or https://cloudconvert.com
2. Upload: dashdig-extension/icons/icon.svg
3. Convert to PNG at: 16x16, 48x48, 128x128
4. Save as: icon16.png, icon48.png, icon128.png
5. Place in: dashdig-extension/icons/
```

### Step 2: Load Extension in Chrome

1. **Open Chrome Extensions**:
   - Type in address bar: `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle switch in top right corner
   - Should turn blue when enabled

3. **Load Extension**:
   - Click "Load unpacked" button
   - Navigate to and select: `/path/to/dashdig-extension`
   - Click "Select Folder"

4. **Verify Installation**:
   - Extension should appear in list
   - Look for: "Dashdig - Smart URL Shortener"
   - Status: Enabled ✓

### Step 3: Pin Extension (Optional)

1. **Click** puzzle icon (Extensions) in Chrome toolbar
2. **Find** "Dashdig - Smart URL Shortener"
3. **Click** pin icon to make it always visible

### Step 4: Test Extension

1. **Navigate** to any webpage (e.g., https://www.example.com)
2. **Click** Dashdig extension icon (⚡)
3. **Click** "Create Smart Link" button
4. **Verify** short URL is generated
5. **Click** copy button and paste somewhere

---

## Detailed Installation

### Prerequisites

- ✅ Google Chrome 88+ (or Chromium-based browser)
- ✅ Dashdig backend running (or use production API)
- ✅ Basic terminal/file system knowledge

### File Checklist

Before loading, ensure these files exist:

```
dashdig-extension/
├── ✓ manifest.json
├── ✓ popup.html
├── ✓ popup.js
├── ✓ popup.css
├── ✓ icons/
│   ├── ✓ icon.svg
│   ├── ⚠ icon16.png  (need to generate)
│   ├── ⚠ icon48.png  (need to generate)
│   └── ⚠ icon128.png (need to generate)
└── ✓ README.md
```

### Icon Generation (Detailed)

#### Method 1: Browser-based HTML Tool

1. **Navigate** to extension folder:
   ```bash
   cd dashdig-extension/icons
   ```

2. **Open** the generator:
   ```bash
   open generate-icons.html
   # Or: Right-click → Open with → Chrome
   ```

3. **Generate** icons:
   - You'll see 3 icon previews (16x16, 48x48, 128x128)
   - Click "Generate All Icons" button
   - 3 PNG files will download

4. **Move** downloaded files:
   - From: `~/Downloads/icon16.png`, etc.
   - To: `dashdig-extension/icons/`

5. **Verify** files exist:
   ```bash
   ls -la dashdig-extension/icons/*.png
   ```

#### Method 2: Command Line (Advanced)

If you have ImageMagick or similar:

```bash
cd dashdig-extension/icons

# Using ImageMagick
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png

# Or using rsvg-convert
rsvg-convert -w 16 -h 16 icon.svg > icon16.png
rsvg-convert -w 48 -h 48 icon.svg > icon48.png
rsvg-convert -w 128 -h 128 icon.svg > icon128.png
```

### Loading Extension (Detailed)

#### Step-by-Step with Screenshots

1. **Open Extensions Page**:
   ```
   Method 1: Type chrome://extensions/ in address bar
   Method 2: ⋮ Menu → More Tools → Extensions
   Method 3: Window → Extensions (Mac)
   ```

2. **Enable Developer Mode**:
   ```
   Look for: "Developer mode" toggle (top right)
   Click: Toggle to ON (should be blue)
   Result: New buttons appear (Load unpacked, Pack extension, Update)
   ```

3. **Load Unpacked Extension**:
   ```
   Click: "Load unpacked" button
   Navigate: Browse to /path/to/dashdig-extension
   Select: Click the folder (not any file inside)
   Load: Click "Select Folder" or "Open"
   ```

4. **Extension Loaded**:
   ```
   Card appears with:
   - Extension name: "Dashdig - Smart URL Shortener"
   - Version: 1.0.0
   - Icon: ⚡ lightning bolt in orange circle
   - Status: Enabled (toggle should be ON)
   ```

### Pinning Extension (Detailed)

1. **Locate Extensions Icon**:
   - Look for puzzle piece icon in Chrome toolbar (top right)
   - Next to profile icon

2. **Open Extensions Menu**:
   - Click puzzle piece icon
   - Dropdown shows all installed extensions

3. **Pin Dashdig**:
   - Find "Dashdig - Smart URL Shortener"
   - Click pin icon (📌) next to it
   - Pin icon turns blue
   - Extension icon appears in toolbar

4. **Verify**:
   - ⚡ Dashdig icon visible in toolbar
   - Click to open popup

---

## Testing

### Basic Test

1. **Open** any webpage:
   ```
   https://www.wikipedia.org/wiki/URL_shortening
   ```

2. **Click** Dashdig extension icon (⚡)

3. **Verify** popup shows:
   - Header: "⚡ Dashdig"
   - Current URL displayed
   - "Create Smart Link" button

4. **Click** "Create Smart Link"

5. **Wait** for API call (loading state)

6. **Verify** result:
   - Short URL appears
   - Format: `dashdig.com/Wikipedia.URL.Shortening`
   - Copy button (📋) enabled

7. **Click** copy button

8. **Verify** clipboard:
   - Message: "✓ Copied to clipboard!"
   - Paste somewhere to confirm

### Advanced Test

1. **Test** different URLs:
   - Amazon product page
   - GitHub repository
   - News article
   - Blog post

2. **Verify** smart slugs:
   - Readable and semantic
   - Include brand/product names
   - Under 60 characters

3. **Test** error handling:
   - Try on `chrome://` pages (should show error)
   - Disconnect internet (should show network error)
   - Invalid API endpoint (should show API error)

4. **Test** history:
   - Create multiple links
   - Open Chrome DevTools
   - Console: `chrome.storage.local.get(['history'])`
   - Verify links are stored

---

## Troubleshooting

### Issue: Extension Not Loading

**Symptoms:**
- "Load unpacked" fails
- Error message in extensions page

**Solutions:**
1. Check folder structure (manifest.json must be at root)
2. Verify manifest.json is valid JSON
3. Check file permissions
4. Try different folder location
5. View error details in extensions page

### Issue: Icons Not Showing

**Symptoms:**
- Extension loads but no icon
- Placeholder icon shown

**Solutions:**
1. Generate PNG icons (see step 1 above)
2. Verify files: `icon16.png`, `icon48.png`, `icon128.png`
3. Check file names (case-sensitive)
4. Reload extension
5. Restart Chrome

### Issue: API Calls Failing

**Symptoms:**
- "Create Smart Link" button does nothing
- Error message in popup
- Console shows network errors

**Solutions:**
1. Check backend URL in `popup.js`
2. Verify backend is running
3. Check CORS settings
4. Test API manually with curl
5. Check console logs (Inspect popup)

### Issue: Copy Not Working

**Symptoms:**
- Copy button doesn't copy
- No clipboard access

**Solutions:**
1. Check `clipboardWrite` permission in manifest
2. Verify Chrome clipboard permission
3. Try manual select and Ctrl+C
4. Check browser security settings

### Issue: Developer Mode Disabled

**Symptoms:**
- Can't see "Load unpacked" button
- Developer mode toggle missing

**Solutions:**
1. Check Chrome policies (enterprise)
2. Try Chromium or Chrome Canary
3. Check for Chrome extensions that block dev mode
4. Contact IT admin (if work computer)

---

## Debugging

### View Extension Console

1. **Right-click** extension icon
2. **Select** "Inspect popup"
3. **View** Console tab for logs
4. **Check** Network tab for API calls

### Console Logs

Extension logs useful information:

```javascript
🚀 Dashdig Extension Loaded
📍 Current URL: https://...
🔗 Creating short link for: ...
📤 Sending request to: https://...
📥 Response status: 201
✅ API Response: {...}
🎉 Short URL created: dashdig.com/...
📋 Copied to clipboard: ...
💾 Saved to history
```

### Common Console Errors

```javascript
// CORS Error
Access to fetch at '...' from origin 'chrome-extension://...' 
has been blocked by CORS policy

Solution: Backend needs to allow chrome-extension:// origin

// Network Error
Failed to fetch
TypeError: NetworkError when attempting to fetch resource

Solution: Check backend URL, verify it's running

// Permission Error
DOMException: Document is not focused
Solution: Extension popup needs focus for clipboard
```

---

## Uninstallation

### Remove Extension

1. Go to `chrome://extensions/`
2. Find "Dashdig - Smart URL Shortener"
3. Click "Remove" button
4. Confirm removal

### Clean Up Data

Extension stores history in `chrome.storage.local`. This is automatically removed when extension is uninstalled. No manual cleanup needed.

---

## Next Steps

After installation:

1. ✅ Create your first short link
2. ✅ Visit Dashdig dashboard
3. ✅ Share your smart links
4. ✅ Provide feedback
5. ✅ Star the GitHub repo

---

## Support

- **Issues**: Report in Dashdig GitHub repo
- **Dashboard**: https://dashdig.com/dashboard
- **Docs**: See README.md

---

_Installation guide for Dashdig Chrome Extension v1.0.0_












