#!/usr/bin/env node

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function testBackend() {
  console.log('🔍 Testing ShamBit Backend Connection...\n');
  
  const endpoints = [
    '/cities/',
    '/articles/',
    '/packages/packages/',
  ];
  
  for (const endpoint of endpoints) {
    const url = `${API_BASE}${endpoint}`;
    console.log(`📡 Testing: ${url}`);
    
    try {
      const response = await fetch(url);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
        console.log(`   ✅ Success\n`);
      } else {
        console.log(`   ❌ Failed\n`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('🏁 Backend test completed!');
  console.log('\n💡 If you see connection errors:');
  console.log('   1. Make sure Django backend is running: python manage.py runserver');
  console.log('   2. Check if the API URL is correct in .env.local');
  console.log('   3. Verify CORS settings in Django allow localhost:3000');
}

testBackend();