// Test script to verify datetime formatting
import { formatToISO, isValidISO } from './src/utils/datetimeUtils.js';

console.log('Testing datetime formatting...');

// Test cases
const testCases = [
  new Date('2024-01-15T09:00:00Z'),
  '2024-01-15T09:00:00Z',
  '2024-01-15T09:00:00.000Z',
  '2024-01-15 09:00:00',
  '2024-01-15',
  Date.now(),
  null,
  undefined,
  'invalid-date'
];

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}:`, testCase);
  const formatted = formatToISO(testCase);
  console.log('Formatted:', formatted);
  console.log('Valid ISO:', isValidISO(formatted));
});

console.log('\n✅ Datetime formatting test completed!');
