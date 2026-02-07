#!/usr/bin/env node

/**
 * Test script to check what image URLs the backend API is returning
 * and verify they are accessible
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require('https');

const API_URL = 'https://shambit.up.railway.app/api/cities/';

console.log('🧪 Testing City Images from API\n');
console.log(`API URL: ${API_URL}\n`);

// Fetch cities from API
https.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const cities = response.results || [];

      console.log(`Found ${cities.length} cities\n`);

      cities.forEach((city, index) => {
        console.log(`\n${index + 1}. ${city.name}`);
        console.log(`   Slug: ${city.slug}`);
        console.log(`   Hero Image: ${city.hero_image || 'No image'}`);

        if (city.hero_image) {
          // Test if image is accessible
          const imageUrl = city.hero_image.startsWith('http')
            ? city.hero_image
            : `https://shambit.up.railway.app${city.hero_image}`;

          console.log(`   Full URL: ${imageUrl}`);
          console.log(`   Testing accessibility...`);

          https.get(imageUrl, (imgRes) => {
            if (imgRes.statusCode === 200) {
              console.log(`   ✅ Image accessible (${imgRes.statusCode})`);
              console.log(`   Content-Type: ${imgRes.headers['content-type']}`);
              console.log(`   CORS: ${imgRes.headers['access-control-allow-origin'] || 'Not set'}`);
            } else {
              console.log(`   ❌ Image not accessible (${imgRes.statusCode})`);
            }
            imgRes.resume();
          }).on('error', (err) => {
            console.log(`   ❌ Error: ${err.message}`);
          });
        }
      });

      // Summary
      const citiesWithImages = cities.filter(c => c.hero_image).length;
      const citiesWithoutImages = cities.length - citiesWithImages;

      console.log('\n\n📊 Summary:');
      console.log(`   Total cities: ${cities.length}`);
      console.log(`   With images: ${citiesWithImages}`);
      console.log(`   Without images: ${citiesWithoutImages}`);

    } catch (error) {
      console.error('❌ Error parsing API response:', error.message);
    }
  });
}).on('error', (err) => {
  console.error('❌ Error fetching cities:', err.message);
});
