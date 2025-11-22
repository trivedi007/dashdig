# Verify API Implementation

## Quick Verification Steps

### Step 1: Verify Backend is Running
```bash
curl http://localhost:5001/health
```
Expected: `{"status":"ok",...}`

---

### Step 2: Test API Key Endpoint
```bash
curl -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/api-keys
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "ddig_test_[40 hex characters]",
    "createdAt": "2025-10-10T18:23:36.954Z",
    "type": "test"
  }
}
```

✅ **What to check:**
- API key starts with `ddig_test_`
- API key is 50+ characters total
- Response includes creation date
- Success is `true`

---

### Step 3: Test URL Management Endpoint
```bash
curl -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/urls-management
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "shortCode": "development.coding.github",
      "shortUrl": "http://localhost:5001/development.coding.github",
      "originalUrl": "https://github.com",
      "clicks": 1,
      "createdAt": "..."
    },
    ...
  ],
  "count": 2
}
```

✅ **What to check:**
- Returns array of URLs
- Each URL has `shortCode`, `originalUrl`, `clicks`
- `count` matches number of URLs

---

### Step 4: Test Widget Page in Browser

1. **Open browser:**
   ```
   http://localhost:3000/bypass
   ```

2. **Click "Bypass Authentication"**

3. **Go to Widget page:**
   ```
   http://localhost:3000/dashboard/widget
   ```

4. **Verify:**
   - ✅ Real API key is displayed (starts with `ddig_test_`)
   - ✅ No "your-api-key-here" placeholder
   - ✅ Copy button works
   - ✅ Code snippets show the real API key

---

### Step 5: Test Regenerate API Key (Optional)

```bash
curl -X POST \
  -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/api-keys/regenerate
```

**Expected:**
- New API key generated
- Different from previous key
- Old key is no longer valid

---

### Step 6: Test URL Details Endpoint

```bash
curl -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/urls-management/development.coding.github
```

**Expected:**
- Returns detailed info about specific URL
- Includes QR code, metadata, clicks

---

### Step 7: Test Delete URL

```bash
# Don't actually run this unless you want to delete!
curl -X DELETE \
  -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/urls-management/search.engine
```

**Expected:**
```json
{
  "success": true,
  "message": "URL deleted successfully",
  "data": {
    "shortCode": "search.engine",
    "deletedAt": "2025-11-02T..."
  }
}
```

---

## 🎯 All Systems Check

Run this complete test:

```bash
#!/bin/bash

echo "=== Dashdig API Implementation Test ==="
echo ""

echo "1. Testing health endpoint..."
curl -s http://localhost:5001/health | jq .status
echo ""

echo "2. Testing API key endpoint..."
curl -s -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/api-keys | jq .data.apiKey
echo ""

echo "3. Testing URL management endpoint..."
curl -s -H "Authorization: Bearer test-token-test-signature" \
  http://localhost:5001/api/urls-management | jq .count
echo ""

echo "=== All tests passed! ✅ ==="
```

Save this as `test-api.sh`, make it executable with `chmod +x test-api.sh`, and run `./test-api.sh`

---

## 🐛 Troubleshooting

### API Key Shows "Loading..."
- Check browser console for errors
- Verify token exists: `localStorage.getItem('token')`
- Go to `/bypass` page to authenticate again

### API Key Shows "Error loading API key"
- Check backend is running on port 5001
- Check backend logs for errors
- Verify authentication middleware is working

### URL Management Returns Empty Array
- Check if you have URLs in the database
- Verify you're authenticated as the correct user
- Check MongoDB connection

### 401 Unauthorized Errors
- Token might be expired or invalid
- Go to `/bypass` page to get new token
- Check Authorization header is being sent

---

## ✅ Success Criteria

Your implementation is working correctly if:

1. ✅ Backend responds to `/api/api-keys` with real API key
2. ✅ API key starts with `ddig_test_` (in development)
3. ✅ Widget page displays the real API key
4. ✅ URL management endpoints return data
5. ✅ All endpoints require authentication
6. ✅ No placeholder text remains on widget page

---

## 📸 Expected Widget Page Appearance

Before (Placeholder):
```
🔑 Your API Key
your-api-key-here
```

After (Real API Key):
```
🔑 Your API Key
ddig_test_9a5eb696949164786560a437a672c3b844797d64
```

The key should be:
- 50+ characters long
- Start with `ddig_test_` or `ddig_live_`
- Different for each user
- Copyable via the Copy button

---

## 🎉 You're Done!

If all the above checks pass, your API implementation is complete and working correctly!

Next steps:
- Share your API key with client applications
- Use the URL management endpoints to build admin features
- Implement rate limiting for production
- Add API key usage analytics

