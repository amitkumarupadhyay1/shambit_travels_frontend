#!/usr/bin/env node

/**
 * Test script to verify backend media endpoint is working correctly
 * and returns proper CORS headers for Next.js Image Optimization
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require('https');

const BACKEND_URL = 'https://shambit.up.railway.app';
const TEST_IMAGE = '/media/city_ayodhya_hero.jpg';

console.log('🧪 Testing Backend Media Endpoint\n');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Test Image: ${TEST_IMAGE}\n`);

// Test 1: Check if image exists
console.log('Test 1: Checking if image exists...');
const imageUrl = `${BACKEND_URL}${TEST_IMAGE}`;

https.get(imageUrl, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:');
  console.log(`  Content-Type: ${res.headers['content-type']}`);
  console.log(`  Content-Length: ${res.headers['content-length']}`);
  console.log(`  Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
  console.log(`  Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
  console.log(`  Cache-Control: ${res.headers['cache-control']}`);
  
  if (res.statusCode === 200) {
    console.log('\n✅ Image endpoint is working!');
    
    // Check CORS headers
    if (res.headers['access-control-allow-origin']) {
      console.log('✅ CORS headers are present');
    } else {
      console.log('❌ CORS headers are missing - Next.js Image Optimization may fail');
    }
    
    // Check content type
    if (res.headers['content-type']?.startsWith('image/')) {
      console.log('✅ Content-Type is correct');
    } else {
      console.log('⚠️  Content-Type is not an image type');
    }
  } else {
    console.log(`\n❌ Image endpoint returned ${res.statusCode}`);
  }
  
  res.resume(); // Consume response data to free up memory
}).on('error', (err) => {
  console.error(`\n❌ Error: ${err.message}`);
});

// Test 2: Check OPTIONS request (CORS preflight)
console.log('\n\nTest 2: Checking CORS preflight (OPTIONS)...');
const options = {
  hostname: 'shambit.up.railway.app',
  path: TEST_IMAGE,
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://shambittravels.up.railway.app',
    'Access-Control-Request-Method': 'GET',
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:');
  console.log(`  Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
  console.log(`  Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
  console.log(`  Access-Control-Max-Age: ${res.headers['access-control-max-age']}`);
  
  if (res.statusCode === 200 && res.headers['access-control-allow-origin']) {
    console.log('\n✅ CORS preflight is working correctly!');
  } else {
    console.log('\n❌ CORS preflight failed');
  }
  
  res.resume();
});

req.on('error', (err) => {
  console.error(`\n❌ Error: ${err.message}`);
});

req.end();
