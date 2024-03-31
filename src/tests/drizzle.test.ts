import { expect, test } from 'bun:test';
import { db } from '../database/client';
import { users } from '../database/schema/users';
import { eq } from 'drizzle-orm';

test("insert into users table, assuming it's been seeded", async () => {
  await db.insert(users).values({ name: 'test1' });
  await db.insert(users).values([{ name: 'test2' }, { name: 'test3' }]);
  const result = await db.select().from(users);
  ['test1', 'test2', 'test3'].map(async (name, index) => {
    const user = result[index];
    expect(name).toBe(user.name);
    await db.delete(users).where(eq(users.id, user.id));
  });
  const emptyUsers = await db.select().from(users);
  expect(emptyUsers.length).toBe(0);
});
