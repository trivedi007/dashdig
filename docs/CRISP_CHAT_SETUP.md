# Crisp Chat Widget Setup Guide

## ✅ Integration Complete

The Crisp chat widget has been fully integrated with user personalization!

---

## 🚀 Quick Setup

### 1. Get Your Crisp Website ID

1. Go to [Crisp.chat](https://app.crisp.chat/)
2. Sign up or log in
3. Create a new website or select existing one
4. Go to **Settings** → **Website Settings** → **Setup Instructions**
5. Copy your Website ID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 2. Add to Environment Variables

Create or update `/frontend/.env.local`:

```bash
# Crisp Chat Widget
NEXT_PUBLIC_CRISP_WEBSITE_ID=your-crisp-website-id-here
```

### 3. Restart Development Server

```bash
cd frontend
npm run dev
```

---

## 🎯 Features Implemented

### ✅ User Personalization

When a user signs in with Google, Crisp automatically receives:

- **Email**: `session.user.email`
- **Full Name**: `session.user.name` (e.g., "Narendra Trivedi")
- **First Name**: Extracted from full name (e.g., "Narendra")
- **Avatar**: Google profile image if available
- **Authentication Status**: Marked as authenticated
- **User Plan**: Current subscription plan

### ✅ Personalized Greetings

Crisp can now address users by their first name in automated messages:

```
👋 Hi Narendra! How can I help you today?
```

### ✅ Session Management

- User data is pushed to Crisp on login
- Session is reset on logout
- Data persists across page navigation

---

## 📝 Using First Name in Crisp Triggers

In your Crisp dashboard, you can create triggers that use the user's first name:

1. Go to **Chatbox** → **Triggers**
2. Create a new trigger
3. In the message, use: `Hello {{firstName}}! 👋`
4. Crisp will automatically replace `{{firstName}}` with the actual first name

### Example Triggers

**Welcome Message:**
```
Hi {{firstName}}! Welcome to Dashdig. I'm here to help you create amazing short links. 😊
```

**Help Trigger (when user is idle):**
```
{{firstName}}, need any help with link creation or analytics?
```

---

## 🔧 Code Implementation

### Component: `/frontend/components/CrispChat.tsx`

The component:
1. Loads Crisp script on mount
2. Pushes user data when session is available
3. Resets session on logout
4. Runs globally across the entire app

### Integration: `/frontend/app/layout.tsx`

Crisp is added to the root layout:

```tsx
<SessionProvider>
  {children}
  <CrispChat />
</SessionProvider>
```

This ensures the chat widget is available on:
- ✅ Landing pages
- ✅ Auth pages (signin/signup)
- ✅ Dashboard
- ✅ All sub-pages

---

## 🎨 Customization

### In Crisp Dashboard

1. **Appearance**: Settings → Chatbox → Appearance
   - Change colors to match brand (orange: `#ea580c`)
   - Customize position (bottom right)
   - Add your logo

2. **Welcome Message**: Chatbox → Chat
   - Set first message visitors see
   - Use `{{firstName}}` for personalization

3. **Operators**: Settings → Team
   - Add team members
   - Set availability hours
   - Configure notifications

---

## 🧪 Testing

### Test User Personalization

1. Sign in with Google
2. Open browser console
3. Look for logs:
   ```
   🗨️ Crisp chat widget initialized
   🗨️ Personalizing Crisp with user data: {name: "Narendra Trivedi", email: "..."}
   ✅ Crisp personalized with first name: Narendra
   ```

4. Open Crisp chat widget (bottom right)
5. Send a test message
6. In Crisp dashboard, verify user info appears

### Test Session Reset

1. Click logout
2. Console should show: `🗨️ Resetting Crisp session data`
3. Crisp chat should reset to guest mode

---

## 🔒 Privacy & GDPR Compliance

Crisp is GDPR compliant. Data sent:
- Email (for support responses)
- Name (for personalization)
- Authentication status (for context)
- No sensitive data like passwords

Users can:
- Request data deletion through Crisp
- Opt out of tracking
- See what data is stored

---

## 🆘 Troubleshooting

### Widget Not Appearing

1. Check console for errors
2. Verify `NEXT_PUBLIC_CRISP_WEBSITE_ID` is set
3. Restart dev server after adding env variable
4. Check Crisp dashboard → Website Settings → Installation

### User Data Not Showing

1. Ensure user is signed in (check session in console)
2. Look for "Personalizing Crisp" log
3. Verify Website ID is correct
4. Check Crisp dashboard → Live → Conversations

### Widget Appears But Doesn't Respond

1. Check Crisp dashboard → Availability
2. Make sure you're "Available" in dashboard
3. Check notification settings
4. Try from a different browser

---

## 📚 Resources

- [Crisp Documentation](https://docs.crisp.chat/)
- [Crisp JavaScript SDK](https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/)
- [Crisp Triggers Guide](https://docs.crisp.chat/guides/chatbox/triggers/)

---

## 🎉 Done!

Your Crisp chat widget is now:
- ✅ Integrated across all pages
- ✅ Personalized with user names
- ✅ Session-aware
- ✅ Ready for customer support

Just add your `NEXT_PUBLIC_CRISP_WEBSITE_ID` and you're good to go! 🚀





