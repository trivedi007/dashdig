# Chrome Web Store Submission Guide - Dashdig Extension

Complete checklist and guide for submitting the Dashdig extension to Chrome Web Store, Firefox Add-ons, and Edge Add-ons.

---

## 📋 Overview

**Extension Name:** Dashdig - Humanize and Shortenize URLs
**Version:** 1.2.5
**Manifest:** V3
**Category:** Productivity
**Target Stores:** Chrome, Firefox, Edge

---

## 🎯 Pre-Submission Checklist

### ✅ Extension Ready

Before submitting, verify:

- [x] Manifest V3 compliant
- [x] All icons present (16px, 32px, 48px, 128px)
- [x] Extension tested in all target browsers
- [x] No console errors or warnings
- [x] API endpoints working (https://dashdig-production.up.railway.app)
- [x] Privacy policy URL ready
- [x] Support email configured (hello@dashdig.com)

### 📸 Assets Required

#### 1. **Screenshots (Required - 5 images)**

Recommended sizes: **1280x800** or **640x400**

**Screenshot 1: Main Popup**
- Show the extension popup with URL input
- Highlight "Humanize New URL" feature
- Before/after URL comparison visible
- Filename: `screenshot-1-main-popup.png`

**Screenshot 2: URL Shortening in Action**
- Show URL being shortened
- Display progress/loading state
- Show successful result
- Filename: `screenshot-2-shortening-action.png`

**Screenshot 3: Recent Links**
- Show the recent links list (last 10)
- Highlight copy, open, QR features
- Demonstrate history feature
- Filename: `screenshot-3-recent-links.png`

**Screenshot 4: QR Code Feature**
- Show QR code generation
- Demonstrate sharing capability
- Mobile-friendly display
- Filename: `screenshot-4-qr-code.png`

**Screenshot 5: Browser Integration**
- Show extension icon in toolbar
- Demonstrate one-click access
- Show context in real browsing
- Filename: `screenshot-5-browser-integration.png`

**How to capture:**
```bash
# 1. Load extension in browser
# 2. Open extension popup
# 3. Use browser screenshot tool (Cmd/Ctrl + Shift + 4 on Mac)
# 4. Crop to 1280x800px
# 5. Save as PNG
```

#### 2. **Promotional Images**

**Small Tile (440x280px) - Required**
- Orange gradient background (#FF6B35)
- Dashdig logo centered
- Tagline: "Humanize and Shortenize URLs"
- Lightning bolt icon ⚡
- Filename: `promo-small-440x280.png`

**Large Tile (920x680px) - Optional but recommended**
- Similar to small tile but more detailed
- Show before/after URL example
- Highlight key features
- Filename: `promo-large-920x680.png`

**Marquee (1400x560px) - Optional**
- Hero banner for store listing
- Eye-catching design
- Feature highlights
- Filename: `promo-marquee-1400x560.png`

**Design templates:**
- Use Figma/Canva with brand colors
- Orange primary: #FF6B35
- Orange accent: #FF4500
- Dark background: #1a1a1a
- White text for contrast

#### 3. **Extension Package**

Create distributable ZIP:
```bash
cd dashdig-extension
zip -r dashdig-extension-v1.2.5.zip \
  manifest.json \
  popup.html \
  popup.css \
  popup.js \
  icons/ \
  -x "*.DS_Store" \
  -x "__MACOSX"
```

Verify ZIP contents:
```bash
unzip -l dashdig-extension-v1.2.5.zip
```

---

## 🌐 Chrome Web Store Submission

### Step 1: Developer Account Setup

**One-time setup:**

1. Go to: https://chrome.google.com/webstore/devconsole
2. Sign in with Google account
3. Pay **$5 one-time registration fee**
4. Accept Developer Agreement
5. Set up developer account details

### Step 2: Create New Item

1. Click **"New Item"** button
2. Upload `dashdig-extension-v1.2.5.zip`
3. Click **"Upload"**
4. Wait for automatic checks to complete

### Step 3: Fill Store Listing

#### Product Details

**Extension Name:**
```
Dashdig - Humanize and Shortenize URLs
```

**Summary (132 characters max):**
```
Transform cryptic URLs into human-readable links instantly. AI-powered URL shortening with smart, memorable slugs.
```

**Description (Detailed):**
```
# Transform Your URLs with AI-Powered Humanization 🚀

Stop sharing cryptic, forgettable links like `bit.ly/3xK9mP2`. Start sharing beautiful, human-readable URLs like `dashdig.com/Best.Coffee.In.Seattle`.

## 🎯 What Makes Dashdig Different?

**Humanize Your Links**
Our AI doesn't just shorten URLs—it makes them meaningful. Using Claude Sonnet 4.5, we analyze your destination and create memorable slugs that describe what you're sharing.

**Example Transformations:**
- `amazon.com/dp/B08N5WRWNW...` → `dashdig.com/Apple.AirPods.Pro.2nd.Gen`
- `nytimes.com/2024/01/15/business/...` → `dashdig.com/NYT.Tech.Startup.News`
- `youtube.com/watch?v=dQw4w9WgXcQ` → `dashdig.com/Never.Gonna.Give.You.Up`

## ✨ Key Features

**⚡ One-Click Shortening**
- Click the extension icon
- Instantly shorten current tab's URL
- Or paste any URL manually

**🎨 Smart, Semantic Slugs**
- AI-powered context understanding
- Memorable, descriptive short links
- No random characters

**📋 Recent Links History**
- View last 10 shortened URLs
- Quick access to your links
- Copy with one click

**🔗 QR Code Generation**
- Instant QR codes for any short URL
- Perfect for print materials
- Mobile-friendly sharing

**🚀 Lightweight & Fast**
- Minimal permissions required
- No background processes
- < 100KB total size
- Zero tracking or analytics on the extension itself

## 🔐 Privacy First

- No data collection by extension
- No tracking scripts
- Only communicates with Dashdig API
- Your URLs are your business

## 💡 Perfect For

- **Content Creators**: Share beautiful links on social media
- **Marketers**: Track campaigns with readable URLs
- **Students**: Organize research with descriptive links
- **Professionals**: Share resources with colleagues
- **Anyone**: Who's tired of ugly URLs

## 🌟 How It Works

1. Install the extension
2. Click the Dashdig icon in your toolbar
3. Shorten the current page or paste any URL
4. Get a humanized short link instantly
5. Copy, share, or generate QR code

## 📊 Analytics Dashboard

Access detailed analytics at dashdig.com:
- Click tracking
- Geographic data
- Device breakdown
- Referral sources
- AI-powered insights

## 🆓 Free to Start

- Unlimited URL shortening
- Full analytics
- No credit card required
- Premium features available

## 🔗 About Dashdig

Dashdig is the next-generation URL shortener that puts humans first. We believe links should be readable, memorable, and meaningful—not random strings of characters.

Built with modern AI and a focus on user experience, Dashdig makes every link you share better.

## 📞 Support

- Email: hello@dashdig.com
- Website: https://dashdig.com
- Docs: https://dashdig.com/docs

Transform your URLs today! 🎉
```

**Category:**
```
Productivity
```

**Language:**
```
English (United States)
```

#### Graphics

1. **Icon**: Upload 128x128px icon (auto-extracted from ZIP)
2. **Screenshots**: Upload all 5 screenshots in order
3. **Promotional Images**:
   - Small tile (440x280px) - **Required**
   - Large tile (920x680px) - Optional
   - Marquee (1400x560px) - Optional

#### Additional Fields

**Website:**
```
https://dashdig.com
```

**Support URL:**
```
https://dashdig.com/support
```

**Privacy Policy URL:** (Create this first!)
```
https://dashdig.com/privacy
```

### Step 4: Privacy Practices

**Data Usage Disclosure:**

Select these:
- [ ] Personally identifiable information: **NO**
- [ ] Health information: **NO**
- [ ] Financial information: **NO**
- [ ] Location: **NO**
- [ ] Web history: **NO**
- [ ] User activity: **NO**
- [ ] Website content: **YES** (URLs being shortened)

**Justification for website content:**
```
Dashdig collects URLs that users choose to shorten through the extension.
These URLs are sent to our API (https://dashdig-production.up.railway.app)
to generate short, human-readable links. URLs are stored to enable analytics
and link management features. Users can delete their data at any time.

Data is:
- Encrypted in transit (HTTPS)
- Stored securely on MongoDB Atlas
- Never sold to third parties
- Used only for the shortening service

Extension itself does not collect, store, or track any user data beyond the
URLs explicitly submitted for shortening.
```

### Step 5: Distribution

**Visibility:**
- [x] Public
- [ ] Unlisted

**Regions:**
- [x] All regions (or select specific countries)

**Pricing:**
```
Free
```

### Step 6: Submit for Review

1. Review all information
2. Click **"Submit for Review"**
3. Wait for automated checks (5-10 minutes)
4. Wait for manual review **(1-3 business days)**

**What reviewers check:**
- Extension does what description says
- No malicious code
- Privacy policy accurate
- Permissions justified
- No trademark violations

---

## 🦊 Firefox Add-ons Submission

### Step 1: Developer Account

1. Go to: https://addons.mozilla.org/developers/
2. Sign in with Firefox Account (or create one)
3. No registration fee (FREE!)
4. Accept Developer Agreement

### Step 2: Submit Extension

1. Click **"Submit a New Add-on"**
2. Choose **"On this site"** (not self-hosted)
3. Upload `dashdig-extension-v1.2.5.zip`

### Step 3: Fill Listing

**Name:**
```
Dashdig - Humanize and Shortenize URLs
```

**Summary (250 characters max):**
```
Transform cryptic URLs into human-readable links with AI. Create memorable short links like dashdig.com/Best.Coffee.In.Seattle instead of random characters. Free, fast, and privacy-focused.
```

**Description:**
```
[Use the same description as Chrome, but add Firefox-specific benefits]

## 🦊 Firefox Benefits

- Native Firefox integration
- Respects Firefox privacy settings
- Open-source friendly
- No Google tracking

[Rest of description same as Chrome]
```

**Categories:**
- [x] Productivity
- [x] Web Development

**Tags:**
```
url-shortener, link-management, productivity, ai, seo
```

**License:**
```
MIT License (or your chosen license)
```

**Privacy Policy URL:**
```
https://dashdig.com/privacy
```

**Homepage:**
```
https://dashdig.com
```

**Support Email:**
```
hello@dashdig.com
```

### Step 4: Version Details

**Version:** `1.2.5`

**Release Notes:**
```
## Version 1.2.5 - November 2025

### ✨ New Features
- Premium orange design with modern UI
- Enhanced QR code generation
- Recent links history (last 10)
- Native share API support

### 🎨 Design Improvements
- Refreshed brand identity
- "Humanize and Shortenize URLs" messaging
- Improved mobile responsiveness
- Better error messages

### 🐛 Bug Fixes
- Fixed API endpoint connectivity
- Improved error handling
- Better loading states

### 🔧 Technical Updates
- Manifest V3 compliant
- Cross-browser compatibility
- Reduced bundle size
- Performance optimizations
```

**Compatible with:**
```
Firefox 109 and later
```

### Step 5: Submit

1. Click **"Submit Version"**
2. Automated validation runs immediately
3. Manual review: **1-7 days** (usually faster than Chrome)

---

## 🌐 Microsoft Edge Add-ons

### Step 1: Partner Center

1. Go to: https://partner.microsoft.com/dashboard/microsoftedge/
2. Sign in with Microsoft account
3. Register as Edge Add-ons developer
4. **$9 one-time fee** (credit card required)

### Step 2: Submit

1. Click **"New Extension"**
2. Upload `dashdig-extension-v1.2.5.zip`
3. Extension is automatically analyzed

### Step 3: Properties

**Display Name:**
```
Dashdig - Humanize and Shortenize URLs
```

**Short Description:**
```
AI-powered URL shortener that creates human-readable links
```

**Detailed Description:**
```
[Same as Chrome description, but emphasize Edge integration]

## 🌐 Optimized for Edge

- Native Microsoft Edge integration
- Syncs with Edge account
- Works on Windows, Mac, Linux
- Edge Collections compatible

[Rest of description same as Chrome]
```

**Category:**
```
Productivity > Other
```

**Tags:**
```
url shortener, link management, productivity, ai
```

### Step 4: Availability

**Markets:**
- [x] All markets

**Visibility:**
- [x] Visible in Microsoft Edge Add-ons store

**Pricing:**
```
Free
```

### Step 5: Submit

1. Review all details
2. Click **"Submit"**
3. Certification process: **2-5 business days**

---

## 📊 Post-Submission Tracking

### Monitor Review Status

**Chrome:**
- Dashboard: https://chrome.google.com/webstore/devconsole
- Status shows: Pending → In Review → Published
- Email notifications sent on status changes

**Firefox:**
- Dashboard: https://addons.mozilla.org/developers/addons
- Track validation and review progress
- Detailed review notes provided

**Edge:**
- Partner Center: https://partner.microsoft.com/dashboard
- Status tracking: Draft → In review → In the Store
- Email updates on certification status

### Expected Timeline

| Store | Automated Check | Manual Review | Total Time |
|-------|----------------|---------------|------------|
| **Chrome** | 5-10 minutes | 1-3 days | ~2-3 days |
| **Firefox** | Immediate | 1-7 days | ~1-5 days |
| **Edge** | 10-15 minutes | 2-5 days | ~3-5 days |

---

## ✅ Pre-Launch Checklist

### Code Quality
- [x] No console errors in popup
- [x] All features tested manually
- [x] API endpoints verified working
- [x] Icons display correctly in all sizes
- [x] Permissions are minimal and justified

### Assets Prepared
- [ ] 5 screenshots captured (1280x800px)
- [ ] Small promo tile created (440x280px)
- [ ] Large promo tile created (920x680px) [optional]
- [ ] Marquee image created (1400x560px) [optional]
- [ ] Extension ZIP packaged

### Documentation
- [ ] Privacy policy published at dashdig.com/privacy
- [ ] Support page created at dashdig.com/support
- [ ] FAQ page available
- [ ] Installation instructions ready

### Store Listings
- [ ] Description written and spell-checked
- [ ] Category selected appropriately
- [ ] Tags/keywords optimized for search
- [ ] Support email configured
- [ ] Website URL verified working

### Legal
- [ ] Privacy policy compliant with store requirements
- [ ] No trademark violations
- [ ] No copyrighted content used without permission
- [ ] Developer agreement accepted

---

## 🎨 Creating Promotional Images

### Using Figma (Recommended)

**Template:**
```
1. Create new Figma file
2. Set artboard sizes:
   - Small: 440x280px
   - Large: 920x680px
   - Marquee: 1400x560px

3. Design elements:
   - Background: Linear gradient (#FF6B35 to #FF4500)
   - Logo: Dashdig wordmark + ⚡
   - Tagline: "Humanize and Shortenize URLs"
   - Feature highlights (icons + text)
   - Before/after URL example

4. Export as PNG @ 2x resolution
```

**Quick Canva Alternative:**
1. Go to canva.com
2. Create custom size (440x280px)
3. Use brand colors (#FF6B35)
4. Add Dashdig logo and text
5. Download as PNG

### Screenshot Tips

**Best Practices:**
- Use clean, real examples (no lorem ipsum)
- Show actual functionality
- Highlight key features with annotations
- Use consistent branding
- High resolution (Retina quality)
- No pixelation or artifacts

**Tools:**
- macOS: Cmd + Shift + 4 → Select area
- Windows: Snipping Tool or Win + Shift + S
- Chrome DevTools: Device emulation for consistent sizes

---

## 🔄 Update Process (Future Versions)

When releasing v1.2.6, v1.3.0, etc.:

1. **Update manifest.json version:**
```json
{
  "version": "1.3.0"
}
```

2. **Create ZIP with new version**

3. **Submit update to each store:**
   - Chrome: Upload new ZIP, add release notes
   - Firefox: Create new version, upload ZIP
   - Edge: Upload new package

4. **Faster review for updates** (usually 24-48 hours)

---

## 🆘 If Submission Rejected

### Common Rejection Reasons

**1. Privacy Policy Issues**
- Solution: Ensure policy covers all data collection
- Must be accessible at provided URL
- Must be specific to your extension

**2. Permissions Not Justified**
- Solution: Explain why each permission is needed
- Remove unnecessary permissions

**3. Misleading Description**
- Solution: Ensure description matches actual functionality
- Remove exaggerated claims
- Provide accurate feature list

**4. Broken Functionality**
- Solution: Test thoroughly before resubmission
- Fix all console errors
- Verify API endpoints work

**5. Trademark Violations**
- Solution: Don't use brand names in title
- Change screenshots if showing other brands
- Use generic examples

### Appeal Process

If you disagree with rejection:

**Chrome:**
- Reply to rejection email
- Explain your case clearly
- Provide evidence if needed

**Firefox:**
- Respond on the review page
- Address each concern raised
- Resubmit with changes

**Edge:**
- Contact Partner Center support
- Provide detailed explanation
- Request re-review

---

## 📈 Post-Launch Marketing

Once approved:

### Promote Extension

1. **Website:** Add "Install Extension" button
2. **Blog Post:** Announce launch
3. **Social Media:** Share on Twitter, LinkedIn, Reddit
4. **Product Hunt:** Launch on Product Hunt
5. **Email:** Notify existing users

### Track Metrics

- **Install count**: Monitor in each store dashboard
- **Ratings**: Encourage happy users to review
- **User feedback**: Read reviews and respond
- **Bug reports**: Monitor support email

### Respond to Reviews

- Thank positive reviewers
- Address negative feedback constructively
- Fix reported issues in updates
- Build community trust

---

## ✅ Final Checklist

Before clicking "Submit":

- [ ] Extension tested in all target browsers
- [ ] Screenshots captured (5 minimum)
- [ ] Promotional images created
- [ ] Privacy policy published
- [ ] Support page ready
- [ ] Description is compelling and accurate
- [ ] Pricing set to "Free"
- [ ] All URLs verified working
- [ ] ZIP package created correctly
- [ ] Developer account registered
- [ ] Payment processed (Chrome $5, Edge $9, Firefox FREE)
- [ ] Terms and conditions accepted
- [ ] Team notified about submission

---

**Estimated Total Time:**
- **Assets Creation**: 2-3 hours
- **Submission Process**: 30 minutes per store
- **Review Wait Time**: 2-7 days

**Total Cost:**
- Chrome: $5 one-time
- Firefox: FREE
- Edge: $9 one-time
- **Total: $14 one-time**

---

**Good luck with your submission! 🚀**

Your extension is ready to help thousands of users humanize their URLs!

---

**Last Updated:** November 13, 2025
**Extension Version:** 1.2.5
**Status:** ✅ Ready to Submit
