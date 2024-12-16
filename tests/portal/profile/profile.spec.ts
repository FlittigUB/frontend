// tests/portal/profil/profile.spec.ts

import { test, expect } from '../../fixtures/fixture-users'; // Updated fixture import
import { BrowserContext, Page } from '@playwright/test';
import path from 'path';

test.describe('Profile Page E2E Tests', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeEach(async ({ browser, user1 }) => {
    // Initialize browser context for User1
    context = await browser.newContext({
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

    // Open a new page
    page = await context.newPage();
  });

  test.afterEach(async () => {
    // Close the browser context after each test
    await context.close();
  });

  /**
   * Helper function to navigate to the profile page
   */
  async function navigateToProfile(page: Page): Promise<void> {
    await page.goto('/portal/profil');
    await page.waitForLoadState('networkidle');
  }

  /**
   * Helper function to update profile information
   */
  async function updateProfile(
    page: Page,
    {
      name,
      bio,
      mobile,
      email,
      guardian,
      imagePath,
    }: {
      name?: string;
      bio?: string;
      mobile?: string;
      email?: string;
      guardian?: string;
      imagePath?: string;
    },
  ): Promise<void> {
    if (name !== undefined) {
      await page.fill('input[id="name"]', name);
    }

    if (bio !== undefined) {
      await page.fill('textarea[id="bio"]', bio);
    }

    if (mobile !== undefined) {
      await page.fill('input[id="mobile"]', mobile);
    }

    if (email !== undefined) {
      await page.fill('input[id="email"]', email);
    }

    if (guardian !== undefined) {
      await page.fill('input[id="guardian"]', guardian);
    }

    if (imagePath !== undefined) {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('label[for="image-upload"]'), // Ensure the label is correctly associated
      ]);
      await fileChooser.setFiles(imagePath);
    }

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for form submission to complete
    await page.waitForLoadState('networkidle');

    // Verify success message
    await expect(
      page.locator('div:has-text("Profilen din er oppdatert!")'),
    ).toBeVisible();
  }

  test('Load profile page and verify user data', async () => {
    await navigateToProfile(page);

    // Verify that user data is populated correctly
    await expect(page.locator('input[id="name"]')).toHaveValue(/.+/); // Name should not be empty
    await expect(page.locator('textarea[id="bio"]')).toHaveValue(/.*./); // Bio can be empty or not
    await expect(page.locator('input[id="email"]')).toHaveValue(/.+@.+\..+/); // Valid email format
    await expect(page.locator('input[id="mobile"]')).toHaveValue(
      /^\+?\d{8,15}$/,
    ); // Mobile number format

    // Verify profile image
    const profileImage = page.locator('img[alt="Profile Picture"]');
    await expect(profileImage).toHaveAttribute('src', /\/uploads\/.+/); // Adjust regex based on your image URL pattern
  });

  test('Update profile information and verify changes', async () => {
    await navigateToProfile(page);

    // Define new profile data
    const newProfileData = {
      name: 'Test User Updated',
      bio: 'This is an updated bio.',
      mobile: '+4798765432',
      email: 'testuser.updated@example.com',
    };

    // Update profile
    await updateProfile(page, newProfileData);

    // Reload the profile page to verify changes
    await navigateToProfile(page);

    // Verify that the changes are reflected
    await expect(page.locator('input[id="name"]')).toHaveValue(
      newProfileData.name,
    );
    await expect(page.locator('textarea[id="bio"]')).toHaveValue(
      newProfileData.bio,
    );
    await expect(page.locator('input[id="mobile"]')).toHaveValue(
      newProfileData.mobile,
    );
    await expect(page.locator('input[id="email"]')).toHaveValue(
      newProfileData.email,
    );
  });

  test('Upload a new profile picture and verify update', async () => {
    await navigateToProfile(page);

    // Path to the new profile picture
    const imagePath = path.join(
      __dirname,
      '../../fixtures',
      'sample-image.png',
    ); // Ensure this path is correct

    // Upload new profile picture
    await updateProfile(page, { imagePath });

    // Reload the profile page to verify the new image
    await navigateToProfile(page);

    // Verify that the profile image has changed
    const profileImage = page.locator('img[alt="Profile Picture"]');
    await expect(profileImage).toHaveAttribute(
      'src',
      /\/uploads\/new-profile-pic\.jpg$/,
    );
  });

  test('Conditional guardian field is displayed and can be updated', async () => {
    // Assuming user1.needs_guardian is true
    // Update the fixture or mock data accordingly

    await navigateToProfile(page);

    // Verify that the guardian field is visible
    await expect(page.locator('input[id="guardian"]')).toBeVisible();

    // Update guardian information
    const newGuardian = 'Guardian Name Updated';
    await updateProfile(page, { guardian: newGuardian });

    // Reload the profile page to verify changes
    await navigateToProfile(page);

    // Verify that the guardian information is updated
    await expect(page.locator('input[id="guardian"]')).toHaveValue(newGuardian);
  });

  test('Logout functionality works correctly', async () => {
    await navigateToProfile(page);

    // Click the logout button
    await page.click('button:has-text("Logg ut")');

    // Verify that the user is redirected to the login page
    await expect(page).toHaveURL(/\/portal\/logg-inn$/);

    // Optionally, verify that the token is removed from localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('Attempt to submit invalid mobile number and verify error message', async () => {
    await navigateToProfile(page);

    // Define invalid mobile number
    const invalidMobile = 'dhf'; // Invalid format

    // Attempt to update mobile number
    await updateProfile(page, { mobile: invalidMobile });

    // Verify that an error message is displayed
    await expect(
      page.locator('div:has-text("Mobilnummer er ugyldig")'),
    ).toBeVisible();
  });
});
