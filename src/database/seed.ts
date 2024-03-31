import { faker } from '@faker-js/faker';
import { db } from './client';
import { users } from './schema/users';

// seeding for users

await db.delete(users);

await db
  .insert(users)
  .values([
    { name: 'bob' },
    { name: 'gilgamesh devourer of worlds' },
    { name: 'steve' },
    { name: 'gragnoroth, cousin of gilgamesh' },
    { name: 'joe 2' },
    { name: faker.person.firstName() },
    { name: faker.person.firstName() },
    { name: faker.person.firstName() },
    { name: faker.person.firstName() },
    { name: faker.person.firstName() },
    { name: faker.person.firstName() },
  ]);
