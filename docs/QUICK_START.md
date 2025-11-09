# Dashdig Quick Start Guide ⚡

## Humanize and Shortenize URLs in Minutes

Welcome to Dashdig! This guide will help you start humanizing and shortenizing URLs right away.

---

## 📖 What You'll Learn

- How to humanize your first URL
- How to shortenize long links
- How to track clicks on humanized URLs
- How to generate QR codes
- How to use advanced features

---

## 🎯 Step 1: Create Your Account

1. Visit [dashdig.com](https://dashdig.com)
2. Click "⚡ Start Humanizing URLs Free"
3. Sign up with email or Google
4. Verify your email (check your inbox for verification link)
5. Complete your profile

**Free Plan Includes**:
- 100 humanized URLs per month
- Basic analytics
- QR code generation
- Browser extension access

---

## ⚡ Step 2: Humanize Your First URL

### Using the Web Dashboard

1. **Log in** to your Dashdig dashboard
2. **Click** "⚡ Humanize New URL" button
3. **Paste** your long URL in the input field
4. **Wait** for AI to analyze and create a human-readable slug
5. **Review** the suggested slug (edit if needed)
6. **Click** "Create Humanized URL"

### Example Transformation

**Before (Cryptic)**:
```
https://www.nytimes.com/2025/11/09/technology/artificial-intelligence-breakthrough.html
```

**After (Humanized & Shortenized)**:
```
dashdig.com/NYTimes.AI.Breakthrough.Nov2025
```

### What Happened?

1. **AI Analyzed** the webpage content
2. **Extracted** key information (source, topic, date)
3. **Generated** a human-readable slug
4. **Created** a shortenized URL
5. **Generated** a QR code automatically

---

## 📤 Step 3: Share Your Humanized URL

Your new human-readable link is ready to share:

### Quick Actions

- **📋 Copy**: Click the copy button to copy the humanized URL
- **📱 QR Code**: Download the QR code for print materials
- **📤 Share**: Use built-in share buttons for social media
- **📊 Analytics**: View real-time click statistics
- **🔗 Open**: Test the link in a new tab

### Sharing Tips

1. **Social Media**: Humanized URLs look professional on Twitter, Facebook, LinkedIn
2. **Email**: Recipients trust readable links more than cryptic codes
3. **Print**: QR codes make it easy to share offline
4. **Marketing**: Track campaign performance with analytics

---

## 🎨 Step 4: Install Browser Extension (Optional)

### Chrome / Edge / Brave

1. Visit [dashdig.com/extension](https://dashdig.com/extension)
2. Click "Add to Chrome"
3. Pin the extension to your toolbar
4. Click the ⚡ icon to humanize the current page

### Firefox

1. Visit [dashdig.com/extension/firefox](https://dashdig.com/extension/firefox)
2. Click "Add to Firefox"
3. Grant permissions
4. Click the ⚡ icon to start humanizing

### Extension Features

- ⚡ **One-click humanization** of current tab
- 📝 **Quick paste** any URL
- 📋 **Auto-copy** to clipboard
- 📱 **QR code** generation
- 🔗 **Recent links** history

---

## 🔧 Step 5: Advanced Features

### Custom Slugs

Want to customize your humanized URL?

1. Paste your URL
2. Wait for AI suggestion
3. Click "Edit Slug"
4. Type your custom slug (e.g., `My.Custom.Link`)
5. Click "Update"

**Slug Rules**:
- Use periods (.) to separate words
- No spaces or special characters
- Maximum 100 characters
- Must be unique

### Analytics Dashboard

Track your humanized URLs:

1. Go to **Dashboard > Analytics**
2. View:
   - Total clicks
   - Click-through rate
   - Geographic data
   - Device breakdown
   - Referrer sources
   - Time-series graph

### QR Codes

Generate QR codes for offline sharing:

1. Humanize a URL
2. Click "📱 QR Code" button
3. Choose size (Small, Medium, Large)
4. Download as PNG
5. Print or share digitally

**QR Code Uses**:
- Business cards
- Posters and flyers
- Product packaging
- Conference materials
- Restaurant menus

---

## 🌐 Integration Options

### WordPress Plugin

Humanize URLs directly in WordPress:

```bash
1. Download plugin from dashdig.com/wordpress
2. Upload to WordPress (Plugins > Add New > Upload)
3. Activate plugin
4. Go to Settings > Dashdig
5. Enter your API key
6. Start humanizing URLs in posts!
```

### JavaScript Widget

Add Dashdig to any website:

```html
<!-- Add before closing </body> tag -->
<script src="https://cdn.dashdig.com/widget.js"></script>
<script>
  new DashdigWidget({
    apiKey: 'your-api-key',
    position: 'bottom-right',
    theme: 'light'
  });
</script>
```

### API Integration

Programmatically humanize URLs:

```javascript
const response = await fetch('https://api.dashdig.com/api/shorten', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    originalUrl: 'https://example.com/long-url'
  })
});

const data = await response.json();
console.log(data.shortUrl); // dashdig.com/Example.Long.Url
```

---

## 💡 Pro Tips

### 1. Use Meaningful Slugs
Instead of accepting the first suggestion, customize slugs for your brand:
- `dashdig.com/ProductName.Feature.Update`
- `dashdig.com/CompanyName.Blog.Post.Title`

### 2. Track Campaigns
Use consistent naming for marketing campaigns:
- `dashdig.com/Campaign.Name.Channel.2025`
- `dashdig.com/BlackFriday.Deal.Twitter`

### 3. Bulk Humanization
Humanize multiple URLs at once:
1. Go to Dashboard > Bulk Tools
2. Paste multiple URLs (one per line)
3. Click "Humanize All"
4. Download CSV with all humanized URLs

### 4. Set Expiration
Create time-limited links:
1. Humanize a URL
2. Click "Advanced Options"
3. Set expiration date or click limit
4. Save

### 5. Password Protection
Secure sensitive links:
1. Humanize a URL
2. Enable "Password Protection"
3. Set a password
4. Share password separately

---

## 🆘 Common Issues & Solutions

### Issue: "Invalid URL"
**Solution**: Ensure URL starts with `http://` or `https://`

### Issue: "Slug Already Taken"
**Solution**: Try a different slug or add a number/date

### Issue: "Rate Limit Exceeded"
**Solution**: Wait a few minutes or upgrade your plan

### Issue: "QR Code Not Generating"
**Solution**: Refresh the page and try again

### Issue: "Extension Not Working"
**Solution**: Check if you're logged in and API key is valid

---

## 📊 Example Use Cases

### Blogger
```
Before: https://myblog.com/2025/11/09/how-to-create-engaging-content-for-social-media
After:  dashdig.com/MyBlog.Social.Media.Content.Tips
```

### Marketer
```
Before: https://landingpage.com/campaign?utm_source=facebook&utm_medium=paid&utm_campaign=spring2025
After:  dashdig.com/Spring2025.Campaign.Facebook
```

### E-commerce
```
Before: https://shop.com/products/shoes/running/mens/nike-air-max-2025?color=black&size=10
After:  dashdig.com/Shop.Nike.Air.Max.2025.Black
```

### Event Organizer
```
Before: https://eventbrite.com/e/tech-conference-2025-san-francisco-november-9-11-tickets-123456789
After:  dashdig.com/TechConf2025.SF.Nov9
```

---

## 🚀 What's Next?

Now that you've humanized your first URL, explore more:

### Beginner
- [ ] Create 5 humanized URLs
- [ ] Generate your first QR code
- [ ] Install browser extension
- [ ] View analytics dashboard

### Intermediate
- [ ] Customize slugs with your brand
- [ ] Set up WordPress plugin
- [ ] Create expiring links
- [ ] Use bulk humanization

### Advanced
- [ ] Integrate API into your app
- [ ] Add JavaScript widget to website
- [ ] Set up custom domain (Pro)
- [ ] Create automated workflows

---

## 📚 Additional Resources

- **[API Documentation](./API.md)** - Full API reference
- **[WordPress Guide](./WORDPRESS.md)** - Plugin setup
- **[Extension Guide](./EXTENSION.md)** - Browser extension
- **[Widget Guide](./WIDGET.md)** - JavaScript widget
- **[Advanced Features](./ADVANCED.md)** - Power user tips

---

## 💬 Get Help

Need assistance? We're here to help:

- **Documentation**: [dashdig.com/docs](https://dashdig.com/docs)
- **Video Tutorials**: [dashdig.com/tutorials](https://dashdig.com/tutorials)
- **Support**: [dashdig.com/support](https://dashdig.com/support)
- **Community**: [community.dashdig.com](https://community.dashdig.com)
- **Email**: support@dashdig.com

---

## ⭐ Share Your Success

Loving Dashdig? Help us spread the word:

- Tweet about your experience: [@dashdig](https://twitter.com/dashdig)
- Rate our browser extension
- Review our WordPress plugin
- Refer friends (get bonus URLs!)

---

**🎉 Congratulations! You're now ready to humanize and shortenize URLs like a pro.**

**Start humanizing today! ⚡**

[Dashboard](https://dashdig.com/dashboard) | [API Docs](./API.md) | [Support](https://dashdig.com/support)

