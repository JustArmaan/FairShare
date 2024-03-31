import { expect, test } from "bun:test";
import { validateEmail, validatePassword } from "./validation";

test("email validator", () => { // test email validator, 
  expect(validateEmail("test@gmail.com")).toBe(true); // should be true if pass
});

test("password validator", () => { // test email validator, 
  expect(validatePassword("Passw0rd!")).toBe(true); // should be true if pass, or fail if fail
});

// Run bun test ./src/test/testEmail.ts  to test it 
