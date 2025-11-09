# ⚡ Dashdig - Humanize and Shortenize URLs
## Extension Quick Start Guide

**Get up and running in 2 minutes!**

---

## 🚀 Installation (30 seconds)

### Chrome / Edge / Brave

1. Open your browser
2. Type in address bar:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`  
   - Brave: `brave://extensions`
3. Toggle **"Developer mode"** (top-right)
4. Click **"Load unpacked"**
5. Navigate to and select: `/Users/narendra/AI-ML/Business-Ideas/Dashdig/dashdig-extension`
6. Done! Look for the orange ⚡ icon

### Firefox

1. Type in address bar: `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on..."**
3. Navigate to: `/Users/narendra/AI-ML/Business-Ideas/Dashdig/dashdig-extension`
4. Select the `manifest.json` file
5. Done! Look for the orange ⚡ icon

---

## 🎯 First Test (30 seconds)

### Test 1: Shorten Current Tab

1. Open any website (e.g., amazon.com)
2. Click the **Dashdig ⚡** icon in your toolbar
3. Click **"🔗 Shorten Current Tab"**
4. Watch the magic happen! ✨
5. Result: See the transformation from cryptic to human-readable URL

### Test 2: Manual URL

1. Click the **Dashdig ⚡** icon
2. Paste this URL in the input:
   ```
   https://www.amazon.com/dp/B08N5WRWNW/ref=sr_1_3?keywords=laptop
   ```
3. Click **"⚡ Dig This!"**
4. Your short link appears!
5. Click **"📋 Copy"** to copy it

### Test 3: Recent Links

1. Create 2-3 short links
2. Scroll to **"Recent Links"** section at bottom
3. Click any recent link to open it
4. Click **"Clear All"** to remove history

---

## ✅ Visual Checklist

Open the extension and verify you see:

- [ ] **Header**: Orange gradient background
- [ ] **Logo**: "Dashdig ⚡" text at top
- [ ] **Tagline**: "Humanize and Shortenize URLs" in italic
- [ ] **Input**: Text field with placeholder "Paste long URL here..."
- [ ] **Primary Button**: Orange "⚡ Dig This!" button
- [ ] **Secondary Button**: "🔗 Shorten Current Tab" button
- [ ] **Footer**: Links to Dashboard • Docs • Support

After shortening a URL:

- [ ] **Before Box**: Red/pink box showing original (cryptic) URL
- [ ] **Arrow**: Orange arrow pointing right
- [ ] **After Box**: Green box showing new (human) URL  
- [ ] **Action Buttons**: 4 buttons - Copy, QR Code, Open, Share
- [ ] **Stats**: Shows "0 clicks" and "Just now"
- [ ] **Recent Links**: New link appears in list

---

## 🎨 Brand Check

Verify these brand elements:

- **Colors**:
  - [ ] Orange (#FF6B35) - Header, buttons, links
  - [ ] Deep Orange (#FF4500) - Gradient, hovers
  - [ ] White - Text on orange
  - [ ] Dark Gray (#2C3E50) - Body text, footer

- **Typography**:
  - [ ] Inter font (clean, modern)
  - [ ] JetBrains Mono (for URLs)

- **Icon**:
  - [ ] Orange lightning bolt ⚡
  - [ ] Visible in toolbar
  - [ ] Matches brand

---

## 🧪 Feature Tests

### ✅ Test All Actions

1. **Copy Button**
   - Click "📋 Copy"
   - Should show "Copied!" briefly
   - Paste somewhere to verify

2. **QR Code Button**
   - Click "📱 QR Code"
   - New tab should open with QR code
   - (Note: Requires backend API)

3. **Open Button**
   - Click "🔗 Open"
   - New tab opens with short URL
   - Should redirect to original URL

4. **Share Button**
   - Click "📤 Share"
   - Native share dialog (or copies)

---

## 🐛 Common Issues

### Extension won't load?
```bash
# Check the folder structure
ls /Users/narendra/AI-ML/Business-Ideas/Dashdig/dashdig-extension/

# Should see:
# manifest.json, popup.html, popup.css, popup.js, icons/, ...
```

### Orange icon not showing?
- Pin the extension: Click puzzle icon 🧩 → find Dashdig → click pin 📌
- Or reload extension: Go to extensions page → click ↻ reload

### API errors?
- Check backend is running:
  ```bash
  curl https://dashdig-backend-production.up.railway.app/health
  ```
- Check your internet connection
- Look at browser console for details:
  - Right-click extension popup → Inspect → Console tab

### UI looks wrong?
- Hard refresh: Close popup and reopen
- Check CSS loaded: Inspect → Network tab → look for popup.css
- Reload extension in extensions page

---

## 🔍 Debug Mode

### View Console Logs

1. Open extension popup
2. Right-click anywhere in popup
3. Select **"Inspect"**
4. Go to **Console** tab
5. You'll see logs like:
   ```
   🚀 Dashdig extension loaded
   🎯 Generating slug: Amazon.Product.xxxx
   📤 Sending to API: https://dashdig-backend...
   ✅ Link created successfully: https://dashdig.com/...
   ```

### Check Storage

In the console, run:
```javascript
chrome.storage.local.get(['recentLinks'], (data) => console.log(data))
```

### Clear Storage

In the console, run:
```javascript
chrome.storage.local.clear(() => console.log('Storage cleared'))
```

---

## 📊 Performance Check

Extension should be:
- **Fast**: Popup opens in <100ms
- **Light**: Uses <15MB memory
- **Smooth**: Animations at 60fps
- **Responsive**: Buttons react instantly

Check memory usage:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Find Dashdig → Click "Inspect views: popup.html"
4. Go to Memory tab

---

## 🎉 Success!

If all tests pass, you now have:

✅ Fully rebranded Dashdig extension  
✅ "Humanize and Shortenize" theme  
✅ Orange lightning bolt icon ⚡  
✅ Modern, beautiful UI  
✅ Cross-browser compatibility  
✅ All features working  

---

## 📞 Need Help?

**Extension not working?**
1. Check REBRANDING_COMPLETE.md for detailed testing checklist
2. Check INSTALLATION.md for installation guides
3. Check console logs for error messages
4. Contact: support@dashdig.com

**Want to improve it?**
1. Edit files in `/dashdig-extension/`
2. Reload extension (click ↻ in extensions page)
3. Test your changes
4. Repeat

---

## 🚀 Next Steps

1. ✅ **Test thoroughly** - Try all features
2. ✅ **Share with team** - Get feedback
3. ⏭️ **Take screenshots** - For store listing
4. ⏭️ **Prepare for launch** - Chrome Web Store, Firefox Add-ons
5. ⏭️ **Celebrate** 🎉 - You've rebranded!

---

**Ready to ship? See REBRANDING_COMPLETE.md for deployment checklist.**

⚡ **Made with Dashdig energy**

