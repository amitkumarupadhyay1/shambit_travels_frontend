#!/usr/bin/env node

/**
 * Implementation Testing Script
 * Tests all backend endpoints required for the booking flow
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const TEST_PACKAGE_SLUG = 'varanasi-spiritual-journey';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  log(`\n📍 Testing: ${name}`, 'cyan');
  log(`   URL: ${url}`, 'blue');
  
  try {
    const response = await makeRequest(url, options);
    
    if (response.status >= 200 && response.status < 300) {
      log(`   ✓ Status: ${response.status}`, 'green');
      return { success: true, response };
    } else {
      log(`   ✗ Status: ${response.status}`, 'red');
      log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      return { success: false, response };
    }
  } catch (error) {
    log(`   ✗ Error: ${error.message}`, 'red');
    return { success: false, error };
  }
}

async function runTests() {
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║     ShamBit Implementation Testing Suite              ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Get Package Details
  log('\n\n═══ Phase 1: Package Retrieval ═══', 'yellow');
  const packageTest = await testEndpoint(
    'Get Package Details',
    `${API_BASE_URL}/api/packages/packages/${TEST_PACKAGE_SLUG}/`
  );
  
  if (packageTest.success) {
    results.passed++;
    const pkg = packageTest.response.data;
    log(`   Package Name: ${pkg.name}`, 'green');
    log(`   Experiences: ${pkg.experiences?.length || 0}`, 'green');
    log(`   Hotel Tiers: ${pkg.hotel_tiers?.length || 0}`, 'green');
    log(`   Transport Options: ${pkg.transport_options?.length || 0}`, 'green');
  } else {
    results.failed++;
  }
  results.tests.push({ name: 'Get Package Details', ...packageTest });

  // Test 2: Calculate Price
  log('\n\n═══ Phase 2: Price Calculation ═══', 'yellow');
  
  // First, get package to extract IDs
  let experienceIds = [1, 2];
  let hotelTierId = 1;
  let transportOptionId = 1;
  
  if (packageTest.success) {
    const pkg = packageTest.response.data;
    experienceIds = pkg.experiences?.slice(0, 2).map(e => e.id) || [1, 2];
    hotelTierId = pkg.hotel_tiers?.[0]?.id || 1;
    transportOptionId = pkg.transport_options?.[0]?.id || 1;
  }

  const priceTest = await testEndpoint(
    'Calculate Price',
    `${API_BASE_URL}/api/packages/packages/${TEST_PACKAGE_SLUG}/calculate_price/`,
    {
      method: 'POST',
      body: {
        experience_ids: experienceIds,
        hotel_tier_id: hotelTierId,
        transport_option_id: transportOptionId,
      },
    }
  );

  if (priceTest.success) {
    results.passed++;
    const price = priceTest.response.data;
    log(`   Total Price: ${price.total_price} ${price.currency}`, 'green');
    log(`   Pricing Note: ${price.pricing_note || 'N/A'}`, 'green');
    
    // Check for required fields
    const checks = [
      { field: 'total_price', exists: !!price.total_price },
      { field: 'currency', exists: !!price.currency },
      { field: 'breakdown', exists: !!price.breakdown },
      { field: 'breakdown.experiences', exists: !!price.breakdown?.experiences },
      { field: 'breakdown.hotel_tier', exists: !!price.breakdown?.hotel_tier },
      { field: 'breakdown.transport', exists: !!price.breakdown?.transport },
    ];
    
    log('\n   Field Checks:', 'cyan');
    checks.forEach(check => {
      const symbol = check.exists ? '✓' : '✗';
      const color = check.exists ? 'green' : 'red';
      log(`     ${symbol} ${check.field}`, color);
    });

    // Check for tax breakdown
    if (price.breakdown?.applied_rules) {
      log(`\n   Tax Breakdown Available: ✓`, 'green');
      log(`   Applied Rules: ${price.breakdown.applied_rules.length}`, 'green');
      price.breakdown.applied_rules.forEach(rule => {
        log(`     - ${rule.name}: ${rule.amount_applied}`, 'blue');
      });
    } else if (price.breakdown?.subtotal && price.breakdown?.gst) {
      log(`\n   Tax Breakdown Available: ✓`, 'green');
      log(`   Subtotal: ${price.breakdown.subtotal}`, 'blue');
      log(`   GST: ${price.breakdown.gst}`, 'blue');
    } else {
      log(`\n   Tax Breakdown Available: ✗`, 'yellow');
      log(`   Note: Frontend will show "All taxes included"`, 'yellow');
    }
  } else {
    results.failed++;
  }
  results.tests.push({ name: 'Calculate Price', ...priceTest });

  // Test 3: List Packages (for browsing without login)
  log('\n\n═══ Phase 3: Browse Without Login ═══', 'yellow');
  const listTest = await testEndpoint(
    'List All Packages',
    `${API_BASE_URL}/api/packages/packages/`
  );

  if (listTest.success) {
    results.passed++;
    const packages = listTest.response.data;
    const count = Array.isArray(packages) ? packages.length : packages.count || 0;
    log(`   Total Packages: ${count}`, 'green');
  } else {
    results.failed++;
  }
  results.tests.push({ name: 'List All Packages', ...listTest });

  // Test 4: Swagger Documentation
  log('\n\n═══ Phase 4: API Documentation ═══', 'yellow');
  const swaggerTest = await testEndpoint(
    'Swagger UI',
    `${API_BASE_URL}/api/docs/`
  );

  if (swaggerTest.success) {
    results.passed++;
    log(`   Swagger UI is accessible`, 'green');
  } else {
    results.failed++;
  }
  results.tests.push({ name: 'Swagger UI', ...swaggerTest });

  // Summary
  log('\n\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    Test Summary                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\n✓ Passed: ${results.passed}`, 'green');
  log(`✗ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Total: ${results.tests.length}\n`, 'blue');

  // Recommendations
  if (results.failed > 0) {
    log('\n⚠️  Recommendations:', 'yellow');
    log('   1. Ensure backend server is running', 'yellow');
    log('   2. Check NEXT_PUBLIC_API_URL environment variable', 'yellow');
    log('   3. Verify database is seeded with test data', 'yellow');
    log('   4. Check backend logs for errors\n', 'yellow');
  } else {
    log('\n🎉 All tests passed! Backend is ready for frontend integration.\n', 'green');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n✗ Fatal Error: ${error.message}`, 'red');
  process.exit(1);
});
