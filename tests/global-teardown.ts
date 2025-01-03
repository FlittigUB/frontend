// global-teardown.ts
import { deleteTestUser } from './test-utils';

async function globalTeardown() {
  const userId = process.env.TEST_USER_ID;
  const user2Id = process.env.TEST_USER2_ID;
  if (userId) await deleteTestUser(userId);
  if (user2Id) await deleteTestUser(user2Id);
}

export default globalTeardown;
