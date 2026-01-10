require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function test() {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say "Dashdig AI is ready!" in exactly 5 words.' }],
    });
    console.log('✅ API works:', response.content[0].text);
  } catch (error) {
    console.error('❌ API error:', error.message);
  }
}

test();
