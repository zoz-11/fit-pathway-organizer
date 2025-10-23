// Simple test runner to check if the tests pass
const { execSync } = require('child_process');

try {
  console.log('Running tests...');
  execSync('cd apps/web-app && npm test -- --testPathPattern=App-routing.test.tsx --passWithNoTests', { stdio: 'inherit' });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}