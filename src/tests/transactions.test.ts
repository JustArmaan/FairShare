import { test, expect } from 'bun:test';
import type { Transaction } from '../interface/interface';

test('POST /test should handle request body correctly', async () => {
  const body = {
    username: 1,
    password: 'strongpassword',
  };

  const response = await fetch('http://localhost:3000/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  await response.text();

  expect(response.status).toBe(200);
});

test('Each transaction should have id, type, and amount', async () => {
  const response = await fetch('http://localhost:3000/transactions');
  // should cast this to be "as Transaction[]" to get rid of type error
  // likely came up after we migrated to express
  const transactions = await response.json();

  expect(response.status).toBe(200);
  transactions.forEach((transaction: Transaction) => {
    expect(transaction).toHaveProperty('id');
    expect(transaction).toHaveProperty('type');
    expect(transaction).toHaveProperty('amount');
    expect(typeof transaction.id).toBe('number');
    expect(['deposit', 'withdrawal']).toContain(transaction.type);
    expect(typeof transaction.amount).toBe('number');
  });
});

test('Should return 404 for a non-existent endpoint', async () => {
  const response = await fetch('http://localhost:3000/nonexistent');
  expect(response.status).toBe(404);
});

test('Should respond quickly to not slow down the client', async () => {
  const startTime = Date.now();
  await fetch('http://localhost:3000/transactions');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(1000);
});
