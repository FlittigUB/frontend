// tests/portal/meldinger/conversations.spec.ts

import { test, expect } from '../../fixtures/fixture-users'; // Updated fixture import
import { BrowserContext, Page } from '@playwright/test';

test.describe('Conversations Page E2E Tests', () => {
  let context1: BrowserContext;
  let context2: BrowserContext;

  test.beforeEach(async ({ browser, user1, user2 }) => {
    // Initialize browser context for User1
    context1 = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            localStorage: [
              {
                name: 'token', // Ensure this matches your app's token key
                value: user1.access_token,
              },
            ],
          },
        ],
      },
    });

    // Initialize browser context for User2
    context2 = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            localStorage: [
              {
                name: 'token', // Ensure this matches your app's token key
                value: user2.access_token,
              },
            ],
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

  /**
   * Helper function to navigate to a conversation and send a message
   * @param page - Page instance of the user
   * @param receiverId - ID of the receiver
   * @param message - The message content to send
   */
  async function navigateAndSendMessage(
    page: Page,
    receiverId: string,
    message: string,
  ): Promise<void> {
    // Navigate directly to the conversation URL
    await page.goto(`/portal/meldinger/${receiverId}`);
    await page.waitForLoadState('networkidle');

    // Ensure that the conversation page has loaded correctly
    await expect(page.locator('a', { hasText: 'Tilbake' })).toBeVisible();

    // Send the message
    await page.fill('input[aria-label="Message Input"]', message);
    await page.click('button[aria-label="Send Message"]'); // Update selector as per your app

    // Verify that the message appears in the sender's chat
    await expect(page.locator(`text=${message}`)).toBeVisible();

    // Click the "Tilbake" (Go Back) button to return to the conversations list
    await page.click('a:has-text("Tilbake")'); // Use Playwright's selector syntax

    // Verify that the conversation appears in the conversations list
    await expect(
      page.locator(`a[href="/portal/meldinger/${receiverId}"]`),
    ).toBeVisible();
  }

  test('User1 sends a message to User2 and User1 sees the conversation in conversations list; User2 sees the message', async ({
    user1,
    user2,
  }) => {
    const page1: Page = await context1.newPage();
    const page2: Page = await context2.newPage();

    // User1 navigates to User2's conversation page and sends a message
    const messageContent = 'Hello User2, this is User1!';
    await navigateAndSendMessage(page1, user2.id, messageContent);

    // User1 verifies that the conversation appears in their conversations list
    // This is already handled in the helper function by checking after clicking "Tilbake"

    // Verify that the conversation with User1 appears in User2's conversations list
    await expect(
      page2.locator(`a[href="/portal/meldinger/${user1.id}"]`),
    ).toBeVisible();

    // User2 navigates to the conversation with User1
    await page2.click(`a[href="/portal/meldinger/${user1.id}"]`);
    await page2.waitForLoadState('networkidle');

    // Ensure that the conversation page has loaded correctly for User2
    await expect(page2.locator('h1', { hasText: 'Meldinger' })).toBeVisible(); // Update selector/text as needed

    // Verify that User2 sees the message from User1
    await expect(page2.locator(`text=${messageContent}`)).toBeVisible();

    // Cleanup: Close pages
    await page1.close();
    await page2.close();
  });

  test('User2 replies to User1 and User1 sees the reply', async ({
    user1,
    user2,
  }) => {
    const page1: Page = await context1.newPage();
    const page2: Page = await context2.newPage();

    // Step 1: User1 sends an initial message to User2 to ensure the conversation exists
    const initialMessage = 'Initial message from User1 to User2!';
    await navigateAndSendMessage(page1, user2.id, initialMessage);

    // Step 2: User2 navigates to their conversation with User1 and sends a reply
    // Reuse the helper function for User2
    const replyContent = 'Hello User1, nice to hear from you!';
    await navigateAndSendMessage(page2, user1.id, replyContent);

    // Step 3: User2 verifies that the conversation appears in their conversations list
    // This is already handled in the helper function by checking after clicking "Tilbake"

    // Step 4: User1 navigates back to their conversation with User2 to verify the reply
    await page1.goto(`/portal/meldinger/${user2.id}`);
    await page1.waitForLoadState('networkidle');

    // Verify that User1 sees the reply from User2
    await expect(page1.locator(`text=${replyContent}`)).toBeVisible();

    // Cleanup: Close pages
    await page1.close();
    await page2.close();
  });
});
