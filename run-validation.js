const { execSync } = require('child_process');

console.log('🔍 Running validation script...');
execSync('node validation.js', { stdio: 'inherit' });