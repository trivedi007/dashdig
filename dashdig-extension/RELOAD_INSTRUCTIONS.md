# How to Reload Dashdig Extension 🔄

**Updated**: January 9, 2025  
**Version**: 1.2.3  
**Change**: Added `short_name` field to manifest

---

## ✅ Extension Name Updated

The manifest.json now includes:
```json
{
  "name": "Dashdig - Humanize and Shortenize URLs",
  "short_name": "Dashdig",
  ...
}
```

---

## 🔄 How to Reload Extension in Chrome

### Method 1: Quick Reload (Recommended)

1. **Open Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Find Dashdig Extension**
   - Scroll to find "Dashdig - Humanize and Shortenize URLs"

3. **Click Reload Button**
   - Click the circular arrow icon (🔄)
   - Extension will reload with updated name

4. **Verify**
   - Name should show: "Dashdig - Humanize and Shortenize URLs"
   - Short name used in toolbar: "Dashdig"

---

### Method 2: Remove and Reload (If Quick Reload Doesn't Work)

1. **Remove Extension**
   ```
   chrome://extensions/
   ```
   - Find "Dashdig" extension
   - Click "Remove" button
   - Confirm removal

2. **Enable Developer Mode**
   - Toggle "Developer mode" in top-right (if not already on)

3. **Load Unpacked**
   - Click "Load unpacked" button
   - Navigate to: `/Users/narendra/AI-ML/Business-Ideas/Dashdig/dashdig-extension/`
   - Click "Select Folder"

4. **Verify**
   - Extension should appear with full name
   - Icon should show in toolbar

---

## 🌐 Other Browsers

### Firefox
```
about:debugging#/runtime/this-firefox
```
1. Find Dashdig extension
2. Click "Reload" button
3. Name updates automatically

### Edge
```
edge://extensions/
```
1. Same as Chrome instructions
2. Click reload icon
3. Verify name update

### Brave
```
brave://extensions/
```
1. Same as Chrome instructions
2. Click reload icon
3. Verify name update

---

## ✅ What Changed

### Before
```json
{
  "name": "Dashdig - Humanize and Shortenize URLs",
  "version": "1.2.3",
  ...
}
```

### After
```json
{
  "name": "Dashdig - Humanize and Shortenize URLs",
  "short_name": "Dashdig",
  "version": "1.2.3",
  ...
}
```

### Benefits
- ✅ **Full name** in extensions list: "Dashdig - Humanize and Shortenize URLs"
- ✅ **Short name** in toolbar: "Dashdig"
- ✅ **Better UX** for users with many extensions
- ✅ **Chrome Web Store** ready (short_name required)

---

## 🎯 Where Names Appear

### Long Name ("Dashdig - Humanize and Shortenize URLs")
- Extensions management page (`chrome://extensions/`)
- Extension details page
- Chrome Web Store listing
- Installation confirmation dialog
- Extension permissions page

### Short Name ("Dashdig")
- Browser toolbar (limited space)
- Extension popup title bar
- Extension icon tooltip (some contexts)
- Mobile browser (when space is limited)

---

## 🧪 Verification Checklist

After reloading:

- [ ] Go to `chrome://extensions/`
- [ ] Find extension in list
- [ ] Verify name shows: "Dashdig - Humanize and Shortenize URLs"
- [ ] Check toolbar icon
- [ ] Hover over icon - tooltip may show short name
- [ ] Click extension icon
- [ ] Popup should open normally
- [ ] Test URL shortening
- [ ] Verify all features work

---

## 🚨 Troubleshooting

### Extension Name Doesn't Update
**Solution**: Try Method 2 (Remove and Reload)

### Extension Not Loading
**Check**:
1. Developer mode is enabled
2. Folder path is correct
3. manifest.json is valid JSON
4. All required files present

### Console Errors
**Steps**:
1. Right-click extension icon
2. Click "Inspect"
3. Check Console tab for errors
4. Share errors for support

---

## 📞 Need Help?

If you encounter issues:

1. **Check manifest.json**
   ```bash
   cat dashdig-extension/manifest.json | jq
   ```

2. **Verify file structure**
   ```bash
   ls -la dashdig-extension/
   ```

3. **Review Chrome errors**
   - `chrome://extensions/` → Click "Errors" button

4. **Contact Support**
   - Email: support@dashdig.com
   - Docs: https://dashdig.com/docs
   - GitHub: https://github.com/dashdig/extension

---

**Built with ⚡ and ❤️ by the Dashdig team**

*Humanize and Shortenize URLs*

