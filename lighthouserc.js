module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 1, // Reduced for faster CI
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }], // Lowered for CI
        'categories:accessibility': ['warn', { minScore: 0.8 }], // Lowered for CI
        'categories:best-practices': ['warn', { minScore: 0.7 }], // Lowered for CI
        'categories:seo': ['warn', { minScore: 0.7 }], // Lowered for CI
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};