# Migration: OpenAI to Anthropic Claude

## Summary
Successfully migrated from OpenAI to Anthropic Claude for AI-powered URL slug generation.

## Changes Made

### 1. Created Metadata Utility (`src/utils/metadata.js`)
**Purpose:** Fix circular dependency between `ai.service.js` and `context-builder.service.js`

**What it does:**
- Extracts metadata fetching logic into a standalone utility
- Fetches page title and description from URLs
- Supports OpenGraph meta tags
- Has 5-second timeout to prevent hanging

**Benefits:**
- Eliminates circular dependency
- Single responsibility principle
- Reusable across services

---

### 2. Updated `src/services/ai.service.js` (Main AI Service)

**Changes:**
- ✅ Replaced `openai` with `anthropic` 
- ✅ Changed from OpenAI SDK to `@anthropic-ai/sdk`
- ✅ Updated API calls to use Claude 3 Haiku (`claude-3-haiku-20240307`)
- ✅ Fixed API format: `messages.create()` instead of `chat.completions.create()`
- ✅ Updated response parsing: `completion.content[0].text` instead of `completion.choices[0].message.content`
- ✅ Moved system prompt to separate parameter (Claude format)
- ✅ Imported `fetchMetadata` from new utility
- ✅ Updated error messages to reference "Claude AI" instead of "OpenAI"

**API Key Check:**
```javascript
if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-'))
```

**Claude API Call Format:**
```javascript
const completion = await this.anthropic.messages.create({
  model: 'claude-3-haiku-20240307',
  max_tokens: 1000,
  system: systemPrompt, // Separate system parameter
  messages: [{
    role: 'user',
    content: userPrompt
  }],
  temperature: 0.8,
});
```

---

### 3. Updated `src/services/minimal-ai-service.js`

**Changes:**
- ✅ Replaced OpenAI with Anthropic
- ✅ Updated API calls to use Claude 3 Haiku
- ✅ Fixed response parsing
- ✅ Updated error messages

---

### 4. Updated `src/services/context-builder.service.js`

**Changes:**
- ✅ Removed circular dependency on `ai.service.js`
- ✅ Now imports `fetchMetadata` from `../utils/metadata`
- ✅ Updated `fetchPageMetadata()` to use standalone utility

**Before (Circular Dependency):**
```javascript
const aiService = require('./ai.service'); // ❌ Circular!
await aiService.fetchMetadata(url);
```

**After (No Circular Dependency):**
```javascript
const { fetchMetadata } = require('../utils/metadata'); // ✅ Clean!
await fetchMetadata(url);
```

---

## Environment Variables

### Required Environment Variable
```bash
ANTHROPIC_API_KEY=sk-ant-api03-... # Your Anthropic API key
```

### Railway Configuration
The `ANTHROPIC_API_KEY` should already be set in Railway. Verify with:
```bash
railway variables
```

---

## Benefits of Migration

### 1. **Cost Savings**
- Claude 3 Haiku is cheaper than GPT-4o-mini
- More tokens per dollar

### 2. **Better Quality**
- Claude is excellent at following structured output instructions
- Better at JSON formatting
- More reliable for slug generation

### 3. **No Circular Dependencies**
- Fixed circular dependency issue between services
- Cleaner architecture
- Easier to maintain

### 4. **Free Tier Support**
- Claude 3 Haiku is perfect for free tier users
- Fast response times
- Low cost per request

---

## Model Selection

### Current: Claude 3 Haiku
- **Speed:** Very fast (~1-2 seconds)
- **Cost:** Low ($0.25/MTok input, $1.25/MTok output)
- **Quality:** Good for structured tasks like slug generation
- **Use case:** Free tier, Starter, Pro plans

### Future Options:
- **Claude 3.5 Sonnet:** For Pro/Business plans (better quality)
- **Claude 3 Opus:** For Enterprise plans (highest quality)

---

## Testing

### Test the Migration

1. **Restart the backend server:**
```bash
npm run dev
```

2. **Check logs for:**
```
✅ Anthropic Claude initialized successfully
```

3. **Test URL shortening:**
```bash
curl -X POST http://localhost:5002/api/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://amazon.com/echo-dot-5th-gen",
    "keywords": ["amazon", "echo", "dot"]
  }'
```

4. **Expected behavior:**
- Should generate AI-powered slugs using Claude
- If Claude fails, falls back to rule-based generation
- No circular dependency errors

---

## Rollback Plan

If issues occur, temporarily revert by:

1. Set fallback mode in Railway:
```bash
railway variables set ANTHROPIC_API_KEY=""
```

2. Service will automatically use fallback URL generation
3. No downtime required

---

## Files Changed

1. ✅ `backend/src/utils/metadata.js` (NEW)
2. ✅ `backend/src/services/ai.service.js` (UPDATED)
3. ✅ `backend/src/services/minimal-ai-service.js` (UPDATED)
4. ✅ `backend/src/services/context-builder.service.js` (UPDATED)

---

## Dependencies

### Already Installed
```json
{
  "@anthropic-ai/sdk": "^0.67.1"
}
```

No additional installation needed! ✅

---

## Next Steps

1. ✅ **Verify ANTHROPIC_API_KEY is set in Railway**
2. ✅ **Deploy to Railway** (automatic on push)
3. ✅ **Monitor logs** for successful Claude initialization
4. ✅ **Test URL generation** in production
5. ⏳ **Consider upgrading to Claude 3.5 Sonnet** for paid tiers

---

## Support

### If AI Generation Fails
- Service automatically falls back to rule-based generation
- No user-facing errors
- Logs will show fallback mode

### Common Issues

**Issue:** "Anthropic API key not configured"
**Solution:** Verify `ANTHROPIC_API_KEY` is set and starts with `sk-ant-`

**Issue:** Rate limits
**Solution:** Claude has generous rate limits. If exceeded, fallback mode activates.

---

## Conclusion

✅ Successfully migrated from OpenAI to Anthropic Claude
✅ Fixed circular dependency issue
✅ Better cost-efficiency
✅ No breaking changes for users
✅ Automatic fallback if AI fails

**Status:** READY FOR DEPLOYMENT 🚀
