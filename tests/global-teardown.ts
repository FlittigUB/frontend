// global-teardown.ts
import { deleteTestUser } from './test-utils';

async function globalTeardown() {
  const userId = process.env.TEST_USER_ID;
  if (userId) {
    await deleteTestUser(userId);
  }
}

export default globalTeardown;
