const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Find all test files in the repository
function findTestFiles(dir, testFiles = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTestFiles(fullPath, testFiles);
    } else if (item.includes('test') && (item.endsWith('.py') || item.endsWith('.tsx') || item.endsWith('.ts'))) {
      testFiles.push(fullPath);
    }
  }
  
  return testFiles;
}

console.log('Searching for test files...');
const testFiles = findTestFiles('.');

console.log(`Found ${testFiles.length} test files:`);
testFiles.forEach(file => console.log(`  - ${file}`));

// Try to run Python tests
console.log('\n=== Running Python Tests ===');
try {
  const pythonTestFiles = testFiles.filter(f => f.endsWith('.py'));
  for (const testFile of pythonTestFiles) {
    console.log(`\nRunning: ${testFile}`);
    try {
      const result = execSync(`python3 ${testFile}`, { encoding: 'utf8', cwd: path.dirname(testFile) });
      console.log('✓ Passed');
    } catch (error) {
      console.log('✗ Failed:', error.message);
    }
  }
} catch (error) {
  console.log('Error running Python tests:', error.message);
}

// Try to run React tests
console.log('\n=== Running React Tests ===');
try {
  const reactTestFiles = testFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  console.log(`Found ${reactTestFiles.length} React test files`);
  
  // Try running npm test
  console.log('\nTrying npm test...');
  try {
    const result = execSync('npm test -- --passWithNoTests --watchAll=false', { encoding: 'utf8' });
    console.log('npm test result:', result);
  } catch (error) {
    console.log('npm test failed:', error.message);
  }
  
} catch (error) {
  console.log('Error running React tests:', error.message);
}