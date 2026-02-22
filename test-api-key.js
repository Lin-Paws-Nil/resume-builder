// Test script to verify OpenAI API key
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let apiKey = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^OPENAI_API_KEY=(.+)$/);
    if (match) {
      apiKey = match[1].trim();
      break;
    }
  }
}

console.log('\n=== OpenAI API Key Verification ===\n');

if (!apiKey) {
  console.error('❌ ERROR: OPENAI_API_KEY is not set in .env.local');
  process.exit(1);
}

console.log('✅ API Key found in .env.local');
console.log('   Key starts with:', apiKey.substring(0, 10) + '...');
console.log('   Key length:', apiKey.length, 'characters');
console.log('   Key type:', apiKey.startsWith('sk-proj-') ? 'Project-scoped key ✅' : 'Standard key');

// Test API key by making a simple request
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: apiKey,
});

console.log('\n🔍 Testing API key connectivity...\n');

openai.models.list()
  .then(() => {
    console.log('✅ SUCCESS: API key is valid and working!');
    console.log('   The connection test passed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ ERROR: API key test failed');
    console.error('\nError details:');
    console.error('   Message:', error.message);
    console.error('   Status:', error.status);
    console.error('   Code:', error.code);
    
    if (error.message?.includes('401') || error.message?.includes('Invalid')) {
      console.error('\n💡 Solution: The API key is invalid or expired.');
      console.error('   Please check your OpenAI dashboard and generate a new key.');
    } else if (error.message?.includes('Connection') || error.message?.includes('ECONNREFUSED')) {
      console.error('\n💡 Solution: Cannot connect to OpenAI API.');
      console.error('   Check your internet connection and firewall settings.');
    } else {
      console.error('\n💡 Check the error message above for specific issues.');
    }
    
    process.exit(1);
  });

