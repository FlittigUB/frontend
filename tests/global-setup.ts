// tests/global-setup.ts
import { FullConfig, chromium } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { createTestUser, loginUser } from './test-utils';

async function globalSetup(config: FullConfig) {
  const email = `testuser_${uuidv4()}@example.com`;
  const password = 'Password123!';

  const user = await createTestUser(email, password);
  const token = await loginUser(email, password);

  // Launch a browser manually since config doesn't provide browserType directly
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  await page.evaluate((authToken: string) => {
    localStorage.setItem('token', authToken);
  }, token);

  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();

  process.env.TEST_USER_ID = user.id;
}

export default globalSetup;
