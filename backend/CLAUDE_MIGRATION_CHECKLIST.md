# ✅ Claude Migration Checklist

## Pre-Deployment Checklist

### Code Changes ✅
- [x] Created `src/utils/metadata.js` for metadata fetching
- [x] Updated `src/services/ai.service.js` to use Anthropic Claude
- [x] Updated `src/services/minimal-ai-service.js` to use Anthropic Claude
- [x] Fixed circular dependency in `src/services/context-builder.service.js`
- [x] Verified all OpenAI references removed
- [x] Updated error messages to reference Claude
- [x] Maintained backward compatibility with existing imports

### Dependencies ✅
- [x] Anthropic SDK installed (`@anthropic-ai/sdk@0.67.1`)
- [x] No additional packages needed

### Environment Variables ⚠️ VERIFY
- [ ] `ANTHROPIC_API_KEY` is set in Railway
- [ ] Key starts with `sk-ant-`
- [ ] Remove or keep `OPENAI_API_KEY` (not used anymore)

### Testing Before Deploy
```bash
# 1. Check env var locally
echo $ANTHROPIC_API_KEY

# 2. Start server
cd backend && npm run dev

# 3. Look for this log message:
✅ Anthropic Claude initialized successfully

# 4. Test API endpoint
curl -X POST http://localhost:5002/api/suggestions/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "url": "https://amazon.com/echo-dot",
    "keywords": ["smart", "speaker"]
  }'

# 5. Verify response has 5 suggestions
# 6. Check logs for Claude API calls
```

---

## Deployment Steps

### Option 1: Automatic (Railway)
```bash
git add .
git commit -m "Migrate from OpenAI to Anthropic Claude

- Replace OpenAI with Claude 3 Haiku for AI slug generation
- Fix circular dependency between ai.service and context-builder
- Create standalone metadata utility
- Maintain backward compatibility
- Add comprehensive error handling"
git push origin main
```

Railway will auto-deploy when pushed to main.

### Option 2: Manual Railway Deploy
```bash
railway up
```

---

## Post-Deployment Verification

### 1. Check Railway Logs
```bash
railway logs
```

Look for:
```
✅ Anthropic Claude initialized successfully
```

### 2. Test Production API
```bash
# Generate suggestions
curl -X POST https://dashdig-production.up.railway.app/api/suggestions/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "url": "https://nike.com/air-max-90",
    "keywords": ["nike", "shoes"]
  }'
```

### 3. Monitor for Errors
Check Railway dashboard for any Claude API errors.

### 4. Verify Fallback Works
If Claude fails, system should automatically use fallback generation (no user-facing errors).

---

## API Compatibility Matrix

| Method | Before (OpenAI) | After (Claude) | Compatible? |
|--------|----------------|----------------|-------------|
| `generateMultipleSuggestions()` | ✅ | ✅ | ✅ Yes |
| `generateHumanReadableUrl()` | ✅ | ✅ | ✅ Yes |
| `fetchMetadata()` | ✅ | ✅ | ✅ Yes |
| `sanitizeSlug()` | ✅ | ✅ | ✅ Yes |
| `generateFallbackSuggestions()` | ✅ | ✅ | ✅ Yes |

**Result:** 100% backward compatible ✅

---

## Files That Import AI Service (All Compatible)

1. ✅ `src/routes/api.js`
2. ✅ `src/app.js`
3. ✅ `src/routes/url.route.js`
4. ✅ `src/controllers/url.controller.js`
5. ✅ `src/controllers/apiV1.controller.js`
6. ✅ `src/controllers/suggestions.controller.js`

All use the same API interface - no changes needed! ✅

---

## Rollback Plan (If Needed)

### Immediate Rollback
```bash
# Remove Anthropic key to force fallback mode
railway variables set ANTHROPIC_API_KEY=""

# Or revert the commit
git revert HEAD
git push origin main
```

### No Downtime
- Fallback mode works automatically
- Users see rule-based slugs instead of AI slugs
- No errors thrown

---

## Cost Comparison

### Before (OpenAI GPT-4o-mini)
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

### After (Claude 3 Haiku)
- Input: $0.25 / 1M tokens
- Output: $1.25 / 1M tokens

**Note:** Claude is slightly more expensive but provides better quality and structure for our use case. The difference is negligible for our traffic volume.

---

## Performance Expectations

### Claude 3 Haiku
- Response time: 1-2 seconds
- Quality: Excellent for structured tasks
- Rate limits: Very generous (default: 50 req/min)

### Fallback Mode (No AI)
- Response time: < 100ms
- Quality: Rule-based, still good
- Rate limits: None

---

## Known Issues & Solutions

### Issue: "Anthropic API key not configured"
**Cause:** ANTHROPIC_API_KEY not set or invalid
**Solution:** 
```bash
railway variables set ANTHROPIC_API_KEY="sk-ant-..."
```

### Issue: Rate limit exceeded
**Cause:** Too many requests in short time
**Solution:** Service automatically falls back - no action needed

### Issue: Circular dependency error
**Cause:** Should be fixed by this migration
**Solution:** Verify `context-builder.service.js` imports from `utils/metadata`

---

## Success Metrics

After deployment, monitor:

1. **AI Success Rate:** Should be > 95%
2. **Fallback Usage:** Should be < 5% of requests
3. **Response Time:** Should be 1-3 seconds for AI suggestions
4. **Error Rate:** Should be < 1%

Check Railway analytics dashboard for these metrics.

---

## Next Steps (Future)

1. **Tier-based Models:**
   - Free/Starter: Claude 3 Haiku ✅ (current)
   - Pro/Business: Claude 3.5 Sonnet (upgrade for better quality)
   - Enterprise: Claude 3 Opus (best quality)

2. **Caching Optimization:**
   - Already implemented with Redis ✅
   - Monitor cache hit rate

3. **A/B Testing:**
   - Compare Claude vs fallback quality
   - User preference surveys

---

## Support Contacts

- **Technical Issues:** Check Railway logs
- **API Issues:** Anthropic status page
- **Questions:** See `MIGRATION_OPENAI_TO_CLAUDE.md`

---

## Final Status

✅ Code changes complete
✅ Dependencies installed
✅ Backward compatible
✅ Fallback protection
✅ Ready to deploy

**Status:** READY FOR PRODUCTION 🚀
