# Dashdig User Guide

Welcome to Dashdig! This guide will help you get started with creating memorable, human-readable short URLs.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Short URLs](#creating-short-urls)
3. [Managing Your Links](#managing-your-links)
4. [Understanding Analytics](#understanding-analytics)
5. [Best Practices](#best-practices)
6. [FAQ](#faq)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is Dashdig?

Dashdig transforms long, unmemorable URLs into human-readable, shareable links. Instead of sharing `bit.ly/x8K2p9`, you can share `dashdig.com/nike.vaporfly.running`.

### Why Use Dashdig?

✅ **Memorable** - Human-readable URLs people actually remember  
✅ **Trustworthy** - No random characters, clear destination  
✅ **Professional** - Perfect for business and personal branding  
✅ **AI-Powered** - Automatically generates contextual slugs  
✅ **Analytics** - Track clicks and engagement  

### Quick Start

1. Visit [dashdig.com](https://dashdig.com)
2. Paste your long URL
3. Add keywords (optional)
4. Click "Dig This!"
5. Share your new memorable link!

---

## Creating Short URLs

### Method 1: Homepage Demo (No Sign-up Required)

1. **Go to the Homepage**
   - Visit https://dashdig.com

2. **Enter Your URL**
   ```
   Original URL: https://www.nike.com/w/nike-vaporfly-running-shoes
   Keywords: nike, vaporfly, running
   ```

3. **Generate Link**
   - Click the "Dig This!" button
   - Wait for AI to generate a contextual slug

4. **Get Your Link**
   ```
   Result: dashdig.com/nike.vaporfly.running
   ```

### Method 2: Dashboard (Full Features)

1. **Sign In**
   - Click "Start Free" or "Sign In"
   - Enter your email
   - Verify with magic link

2. **Access Dashboard**
   - Navigate to `/dashboard`
   - See all your created links

3. **Create New Link**
   - Fill in the form:
     - **Original URL** (required)
     - **Custom Slug** (optional)
     - **Keywords** (optional)
   - Click "Dig This!"

---

## Managing Your Links

### Dashboard Overview

Your dashboard shows:
- **Total Links**: Number of URLs you've created
- **Total Clicks**: Aggregate click count
- **Average Clicks**: Average per link

### Link Actions

Each link card provides:

📋 **Copy** - Copy short URL to clipboard  
📊 **Analytics** - View detailed click statistics  
🔗 **Visit** - Go to original destination  

### Viewing Link Details

Click on any link to see:
- **Short Code**: Your memorable URL
- **Original URL**: Destination
- **Click Count**: Total clicks
- **Created Date**: When it was created

---

## Understanding Analytics

### Click Tracking

Every time someone clicks your short URL, we track:
- **Time**: When the click occurred
- **Count**: Running total
- **Last Clicked**: Most recent click

### Performance Metrics

Monitor your links:
- **High Performers**: Most clicked links
- **Recent Activity**: Latest clicks
- **Engagement Rate**: Clicks over time

---

## Best Practices

### Creating Effective Short URLs

#### ✅ DO:
- Use descriptive keywords
- Keep it short and memorable
- Match your brand voice
- Test the link before sharing

#### ❌ DON'T:
- Use random characters
- Make it too long
- Include special characters
- Forget to test

### Keyword Tips

**Good Keywords:**
```
nike, running, shoes
target, vitamins, mens
chewy, cat, litter
```

**What Happens:**
- AI analyzes URL content
- Combines with your keywords
- Generates contextual slug
- Ensures uniqueness

### Example Transformations

| Original URL | Keywords | Result |
|--------------|----------|--------|
| nike.com/vaporfly-3-mens | nike, running, shoes | nike.vaporfly.running |
| target.com/centrum-silver | target, vitamins, mens | target.centrum.mens |
| chewy.com/tidy-cats | chewy, cat, litter | chewy.tidy.cats |

---

## FAQ

### General Questions

**Q: Is Dashdig free?**  
A: Yes! Basic usage is free forever. Premium plans offer custom domains and advanced analytics.

**Q: How many links can I create?**  
A: Free users: 100/month. Premium users: Unlimited.

**Q: Do links expire?**  
A: Free links don't expire. You can set expiration on premium plans.

**Q: Can I edit a link after creating it?**  
A: Currently, links can't be edited. Create a new one if needed.

### Technical Questions

**Q: What URL formats are supported?**  
A: Any valid HTTP/HTTPS URL.

**Q: How does the AI slug generation work?**  
A: We analyze the URL content and combine it with your keywords to create memorable, contextual slugs.

**Q: What if my desired slug is taken?**  
A: The system automatically adds a unique suffix (e.g., `.2024` or `.abc`).

**Q: How fast is the redirect?**  
A: Redirects happen in <100ms on average.

### Privacy & Security

**Q: Do you track click locations?**  
A: We only track click counts, not user information or locations.

**Q: Are my links secure?**  
A: Yes, all links use HTTPS and are protected.

**Q: Can I delete a link?**  
A: Yes, from your dashboard. Deleted links stop working immediately.

---

## Troubleshooting

### Link Not Working

**Problem**: "URL not found" error

**Solutions**:
1. Check if link was created successfully
2. Verify spelling of slug
3. Wait 30 seconds for database propagation
4. Try creating again if issue persists

### Creation Failed

**Problem**: Can't create new link

**Solutions**:
1. Verify URL is valid (includes http:// or https://)
2. Check you haven't hit rate limit (100 requests/15 min)
3. Try without custom slug
4. Clear browser cache

### Dashboard Not Loading

**Problem**: Dashboard page won't load

**Solutions**:
1. Clear browser cache
2. Try incognito/private mode
3. Check internet connection
4. Verify you're signed in

### Redirect Too Slow

**Problem**: Link takes long to redirect

**Solutions**:
1. Check original URL is accessible
2. Clear browser cache
3. Test from different network
4. Report if consistently slow

---

## Support

### Getting Help

📧 **Email**: support@dashdig.com  
💬 **Chat**: Available on dashboard  
📚 **Docs**: https://docs.dashdig.com  
🐛 **Bug Reports**: Use `/reportbug` in chat  

### Response Times

- Critical Issues: < 2 hours
- General Support: < 24 hours
- Feature Requests: < 48 hours

---

## What's Next?

### Premium Features (Coming Soon)

🎯 **Custom Domains** - Use your own domain  
📊 **Advanced Analytics** - Detailed click data  
🔒 **Link Protection** - Password-protect links  
⏰ **Link Scheduling** - Auto-expire links  
👥 **Team Collaboration** - Share link management  

### Stay Updated

Follow us for updates:
- Twitter: @dashdig
- Blog: blog.dashdig.com
- Changelog: dashdig.com/changelog

---

## Tips for Power Users

### API Access (Coming Soon)

Programmatically create links:
```bash
curl -X POST https://dashdig-backend-production.up.railway.app/api/urls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","keywords":["example"]}'
```

### Bulk Creation

Need to create many links? Contact us for:
- CSV import
- API access
- Bulk pricing

### Integration

Integrate with:
- Social media schedulers
- Marketing automation
- CMS platforms
- Email campaigns

---

Thank you for using Dashdig! 🎉

*Last updated: October 2025*
