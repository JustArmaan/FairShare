import { expect, test } from 'bun:test';
import { db } from '../database/client';
import { users } from '../database/schema/users';
import { eq } from 'drizzle-orm';

test("insert into users table, assuming it's been migrated", async () => {
  await db.insert(users).values({ name: 'test1' });
  await db.insert(users).values([{ name: 'test2' }, { name: 'test3' }]);

  const result = await db.select().from(users);
  ['test3', 'test2', 'test1'].map(async (name, index) => {
    const user = result[result.length - index - 1];
    expect(name).toBe(user.name);
    await db.delete(users).where(eq(users.id, user.id));
  });

  const emptyUsers = await db.select().from(users);
  expect(emptyUsers.length).toBe(result.length - 3);
});
