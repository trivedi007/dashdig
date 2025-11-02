<template>
  <div class="dashdig-test">
    <h2>🚀 DashDig URL Shortener</h2>
    
    <div class="input-group">
      <input 
        v-model="url" 
        type="text" 
        placeholder="Enter URL to shorten"
        @keyup.enter="shortenUrl"
      />
      <button @click="shortenUrl" :disabled="isLoading">
        {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
      </button>
    </div>

    <div v-if="error" class="error">
      ❌ {{ error }}
    </div>

    <div v-if="result" class="result">
      <strong>✅ Success!</strong><br><br>
      <strong>Short URL:</strong> <a :href="result.shortUrl" target="_blank">{{ result.shortUrl }}</a><br>
      <strong>Slug:</strong> <code>{{ result.slug }}</code>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const url = ref('https://example.com/vue-test')
const result = ref(null)
const error = ref(null)
const isLoading = ref(false)
const urlObj = new URL(url.value);
const pathParts = urlObj.pathname.split('/').filter(p => p);
const keywords = pathParts.slice(0, 3); // Use path segments as keywords

async function shortenUrl() {
  if (!url.value) {
    error.value = 'Please enter a URL'
    return
  }

  try {
    isLoading.value = true
    error.value = null
    result.value = null

    const response = await fetch('https://dashdig-production.up.railway.app/demo-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url.value,
        keywords: keywords
    })
    })

    if (!response.ok) {
      throw new Error('HTTP ' + response.status)
    }

    const data = await response.json()
    
    if (data.success && data.data) {
      result.value = {
        shortUrl: data.data.shortUrl,
        slug: data.data.slug
      }
    } else {
      throw new Error('Invalid response')
    }
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.dashdig-test {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  color: #1F2937;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 6px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4F46E5;
}

button {
  padding: 12px 24px;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #4338CA;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 16px;
  background: #D1FAE5;
  border: 2px solid #A7F3D0;
  border-radius: 8px;
  color: #065F46;
}

.result a {
  color: #059669;
  font-weight: 600;
  word-break: break-all;
}

.result code {
  background: #ECFDF5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.error {
  margin-top: 20px;
  padding: 16px;
  background: #FEE2E2;
  border: 2px solid #FECACA;
  border-radius: 8px;
  color: #991B1B;
  font-weight: 600;
}
</style>
