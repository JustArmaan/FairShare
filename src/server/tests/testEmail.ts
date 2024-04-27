// this should be a testEmail.test.ts file
import { expect, test } from 'bun:test';
import { validateEmail, validatePassword } from './validation';

test('email validator', () => {
  // test email validator,
  // need more cases, currently a function that always returns true would pass this test
  // need to test false cases as well
  expect(validateEmail('test@gmail.com')).toBe(true); // should be true if pass
});

test('password validator', () => {
  // test email validator,
  // need to test false cases as well, same as above
  expect(validatePassword('Passw0rd!')).toBe(true); // should be true if pass, or fail if fail
});

// can also just run "bun test" to run all tests
// Run bun test ./src/test/testEmail.ts  to test it
