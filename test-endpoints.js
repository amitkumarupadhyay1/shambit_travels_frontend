#!/usr/bin/env node

/**
 * Test script to verify backend API endpoints
 * Run: node test-endpoints.js
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function testEndpoint(name, url) {
  try {
    console.log(`\n🔍 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    console.log(`   ✅ Success: ${response.status}`);
    
    if (data.results) {
      console.log(`   📊 Results: ${data.results.length} items`);
      if (data.results.length > 0) {
        console.log(`   📝 Sample: ${JSON.stringify(data.results[0]).substring(0, 100)}...`);
      }
    } else {
      console.log(`   📝 Data: ${JSON.stringify(data).substring(0, 100)}...`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests');
  console.log(`📍 Base URL: ${API_BASE_URL}`);
  console.log('=' .repeat(60));
  
  const tests = [
    ['Health Check', `${API_BASE_URL.replace('/api', '')}/health/`],
    ['Cities List', `${API_BASE_URL}/cities/`],
    ['City Detail (Ayodhya)', `${API_BASE_URL}/cities/4/`],
    ['Packages (All)', `${API_BASE_URL}/packages/packages/`],
    ['Packages (Ayodhya)', `${API_BASE_URL}/packages/packages/?city=4`],
    ['Articles (All)', `${API_BASE_URL}/articles/`],
    ['Articles (Ayodhya)', `${API_BASE_URL}/articles/?city=4`],
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const [name, url] of tests) {
    const result = await testEndpoint(name, url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is ready.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check backend server.');
  }
}

// Run tests
runTests().catch(console.error);
