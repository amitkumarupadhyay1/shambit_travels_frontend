#!/usr/bin/env node

/**
 * Health check script for ShamBit Frontend
 * Verifies the application is running correctly after deployment
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');
const https = require('https');

const config = {
  timeout: 10000,
  retries: 3,
  retryDelay: 2000,
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout: config.timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkEndpoint(url, expectedStatus = 200) {
  log(`🔍 Checking: ${url}`, colors.blue);
  
  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      const response = await makeRequest(url);
      
      if (response.statusCode === expectedStatus) {
        log(`✅ ${url} - Status: ${response.statusCode}`, colors.green);
        return true;
      } else {
        log(`❌ ${url} - Expected: ${expectedStatus}, Got: ${response.statusCode}`, colors.red);
        return false;
      }
    } catch (error) {
      log(`⚠️  Attempt ${attempt}/${config.retries} failed: ${error.message}`, colors.yellow);
      
      if (attempt < config.retries) {
        log(`⏳ Retrying in ${config.retryDelay}ms...`, colors.yellow);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    }
  }
  
  log(`❌ ${url} - All attempts failed`, colors.red);
  return false;
}

async function runHealthChecks() {
  log('🏥 Starting health checks...', colors.blue);
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  const checks = [
    { url: baseUrl, name: 'Homepage' },
    { url: `${baseUrl}/test`, name: 'Test page' },
    { url: `${apiUrl}/cities/`, name: 'API - Cities' },
    { url: `${apiUrl}/articles/`, name: 'API - Articles' },
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const passed = await checkEndpoint(check.url);
    if (!passed) {
      allPassed = false;
    }
  }
  
  log('', colors.reset);
  
  if (allPassed) {
    log('🎉 All health checks passed!', colors.green);
    process.exit(0);
  } else {
    log('💥 Some health checks failed!', colors.red);
    process.exit(1);
  }
}

// Run health checks
runHealthChecks().catch((error) => {
  log(`💥 Health check script failed: ${error.message}`, colors.red);
  process.exit(1);
});