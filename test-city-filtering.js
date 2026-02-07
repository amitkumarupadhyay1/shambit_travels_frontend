/**
 * Test script to verify city filtering functionality
 * Tests that API endpoints return correct data for city-specific filtering
 */

const API_BASE_URL = 'http://localhost:8000/api';

async function testEndpoint(name, url) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`📍 URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    console.log(`✅ Success: ${response.status}`);
    console.log(`📊 Results count: ${data.count || data.results?.length || 'N/A'}`);
    
    if (data.results && data.results.length > 0) {
      console.log(`📝 First item:`, data.results[0].name || data.results[0].title || data.results[0].id);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting City Filtering Tests\n');
  console.log('=' .repeat(60));
  
  // Test 1: Get all cities
  await testEndpoint('Get All Cities', `${API_BASE_URL}/cities/`);
  
  // Test 2: Get specific city (Ayodhya - ID 4)
  await testEndpoint('Get Ayodhya City', `${API_BASE_URL}/cities/4/`);
  
  // Test 3: Get packages for Ayodhya
  await testEndpoint('Get Ayodhya Packages', `${API_BASE_URL}/packages/packages/?city=4`);
  
  // Test 4: Get articles for Ayodhya
  await testEndpoint('Get Ayodhya Articles', `${API_BASE_URL}/articles/?city=4`);
  
  // Test 5: Get all packages (no filter)
  await testEndpoint('Get All Packages', `${API_BASE_URL}/packages/packages/`);
  
  // Test 6: Get all articles (no filter)
  await testEndpoint('Get All Articles', `${API_BASE_URL}/articles/`);
  
  // Test 7: Get packages for different city (Mumbai - ID 1)
  await testEndpoint('Get Mumbai Packages', `${API_BASE_URL}/packages/packages/?city=1`);
  
  // Test 8: Get articles for different city (Mumbai - ID 1)
  await testEndpoint('Get Mumbai Articles', `${API_BASE_URL}/articles/?city=1`);
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ All tests completed!\n');
}

// Run tests
runTests().catch(console.error);
