// tests/chat-page.spec.ts

import { test, expect } from '../../fixtures/fixture-users';
import { BrowserContext } from '@playwright/test';

test.describe('Chat Page E2E Tests', () => {
  let context1: BrowserContext;
  let context2: BrowserContext;

  test.beforeEach(async ({ browser, user1, user2 }) => {
    // Initialize contexts with respective user tokens
    context1 = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            localStorage: [{ name: 'token', value: user1.access_token }],
          },
        ],
      },
    });

    context2 = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            localStorage: [{ name: 'token', value: user2.access_token }],
          },
        ],
      },
    });
  });

  test.afterEach(async () => {
    // Close the browser contexts after each test
    await context1.close();
    await context2.close();
  });

  test('User1 and User2 can exchange messages in real-time', async ({
    user1,
    user2,
  }) => {
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto(`/portal/meldinger/${user2.id}`);
    await page1.waitForLoadState('networkidle');

    await page2.goto(`/portal/meldinger/${user1.id}`);
    await page2.waitForLoadState('networkidle');

    const messages = [
      { sender: 'User1', content: 'Hello User2!' },
      { sender: 'User2', content: 'Hi User1! How are you?' },
    ];

    for (const msg of messages) {
      if (msg.sender === 'User1') {
        await page1.fill('input[aria-label="Message Input"]', msg.content);
        await page1.click('button[aria-label="Send Message"]');
        await expect(page1.locator(`text=${msg.content}`)).toBeVisible({
          timeout: 10000,
        });
        await expect(page2.locator(`text=${msg.content}`)).toBeVisible({
          timeout: 10000,
        });
      } else {
        await page2.fill('input[aria-label="Message Input"]', msg.content);
        await page2.click('button[aria-label="Send Message"]');
        await expect(page2.locator(`text=${msg.content}`)).toBeVisible({
          timeout: 10000,
        });
        await expect(page1.locator(`text=${msg.content}`)).toBeVisible({
          timeout: 10000,
        });
      }
    }

    await page1.close();
    await page2.close();
  });
});
