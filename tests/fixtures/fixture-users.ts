// fixtures/fixture-users.ts

import { test as baseTest } from '@playwright/test';
import { createTestUser, loginUser, deleteTestUser } from '../test-utils';

type User = {
  access_token: string;
  id: string;
  email: string;
};

type UsersFixture = {
  user1: User;
  user2: User;
};

// Extend the base test with user1 and user2 fixtures
export const test = baseTest.extend<UsersFixture>({
  user1: async ({}, use) => {
    const email = `fixture1+${Date.now()}_${Math.floor(Math.random() * 1000)}@wf.nerskogen.com`;
    const password = 'Password123!';

    // Create user1
    const user = await createTestUser(email, password, 1);
    const access_token = await loginUser(email, password);

    await use({ id: user.id, email, access_token });

    // Cleanup after tests
    await deleteTestUser(user.id);
  },

  user2: async ({}, use) => {
    const email = `fixture2+${Date.now()}_${Math.floor(Math.random() * 1000)}@wf.nerskogen.com`;
    const password = 'Password123!';

    // Create user2
    const user = await createTestUser(email, password, 2);
    const access_token = await loginUser(email, password);

    await use({ id: user.id, email, access_token });

    // Cleanup after tests
    await deleteTestUser(user.id);
  },
});

// Export `expect` for convenience
export { expect } from '@playwright/test';
