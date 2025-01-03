// tests/application-page.spec.ts

import { test, expect } from '@playwright/test';
import { BrowserContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid'; // For generating unique job IDs if needed

test.describe('Application Page E2E Tests', () => {
  let context1: BrowserContext;
  let context2: BrowserContext;
  let jobId: string; // Will hold the ID of the job to be tested

  test.beforeAll(async ({ browser, api }) => {
    // Create a test job via the API if possible
    // This step depends on your backend API allowing job creation for tests
    // If not, use a pre-existing job ID
    jobId = uuidv4(); // Replace with actual job creation logic if available
    await api.createJob({
      id: jobId,
      title: 'Test Job',
      description: 'This is a test job.',
      place: 'Test Location',
      date_accessible: new Date().toISOString(),
      status: 'open',
      user: 'employer-id', // Replace with a valid employer user ID
      categories: [],
    });
  });

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

  test.afterAll(async ({ api }) => {
    // Clean up the test job after all tests have run
    await api.deleteJob(jobId);
  });

  test('User can view job details and see the application form when not applied', async () => {
    const page = await context1.newPage();

    // Navigate to the Application Page
    await page.goto(`/portal/soknader/${jobId}`);
    await page.waitForLoadState('networkidle');

    // Verify Job Details
    await expect(page.locator('text=Test Job')).toBeVisible();
    await expect(page.locator('text=This is a test job.')).toBeVisible();
    await expect(page.locator('text=Test Location')).toBeVisible();

    // Verify Application Form is visible
    const applyButton = page.locator('button', {
      hasText: 'Søk på denne jobben',
    });
    await expect(applyButton).toBeVisible();

    await page.close();
  });

  test('User can submit an application successfully', async () => {
    const page = await context1.newPage();

    // Navigate to the Application Page
    await page.goto(`/portal/soknader/${jobId}`);
    await page.waitForLoadState('networkidle');

    // Submit the Application Form
    const applyButton = page.locator('button', {
      hasText: 'Søk på denne jobben',
    });
    await applyButton.click();

    // Verify Success Message
    await expect(page.locator('text=Søknaden har blitt sendt!')).toBeVisible();

    // Verify that the application status is now displayed
    await expect(page.locator('text=Din Søknad')).toBeVisible();
    await expect(page.locator('strong>Status:')).toContainText(
      'Under vurdering',
    );

    await page.close();
  });

  test('User sees their application status after applying', async () => {
    const page = await context1.newPage();

    // Navigate to the Application Page
    await page.goto(`/portal/soknader/${jobId}`);
    await page.waitForLoadState('networkidle');

    // Verify Application Status is displayed
    await expect(page.locator('text=Din Søknad')).toBeVisible();
    await expect(page.locator('strong>Status:')).toContainText(
      'Under vurdering',
    );

    await page.close();
  });

  test('User sees conditional colors and translated status', async () => {
    const page = await context1.newPage();

    // Navigate to the Application Page
    await page.goto(`/portal/soknader/${jobId}`);
    await page.waitForLoadState('networkidle');

    // Locate the status element
    const statusElement = page
      .locator('strong', { hasText: 'Status:' })
      .nextSibling();

    // Verify the translated text and color
    await expect(statusElement).toHaveText('Under vurdering');
    await expect(statusElement).toHaveCSS('color', 'rgb(234, 179, 8)'); // Tailwind text-yellow-600

    await page.close();
  });

  test('Chat button is visible and navigates correctly when application is approved', async () => {
    // First, update the application status to 'approved' via the API
    await test.step('Update application status to approved', async () => {
      await api.updateApplicationStatus(jobId, 'approved', 'user1-id'); // Replace 'user1-id' with actual user ID
    });

    const page = await context1.newPage();

    // Navigate to the Application Page
    await page.goto(`/portal/soknader/${jobId}`);
    await page.waitForLoadState('networkidle');

    // Verify the status is 'Akseptert' with green color
    const statusElement = page
      .locator('strong', { hasText: 'Status:' })
      .nextSibling();
    await expect(statusElement).toHaveText('Akseptert');
    await expect(statusElement).toHaveCSS('color', 'rgb(34, 197, 94)'); // Tailwind text-green-600

    // Verify Chat Button is visible
    const chatButton = page.locator('text=Chat med arbeidsgiver');
    await expect(chatButton).toBeVisible();

    // Click the Chat Button and verify navigation
    await chatButton.click();
    await page.waitForURL(`/portal/meldinger/employer-id`); // Replace 'employer-id' with actual employer ID
    await expect(page).toHaveURL(`/portal/meldinger/employer-id`);

    await page.close();
  });

  test('User cannot access the application page without logging in', async () => {
    // Create a new browser context without authentication
    const unauthenticatedContext = await test
      .info()
      .project.browser.newContext();
    const page = await unauthenticatedContext.newPage();

    // Navigate to the Application Page
    await page.goto(`/portal/soknader/${jobId}`);
    await page.waitForLoadState('networkidle');

    // Verify that an error message is displayed
    await expect(
      page.locator('text=Du må være logget inn for å søke på jobber.'),
    ).toBeVisible();

    await page.close();
    await unauthenticatedContext.close();
  });

  test('User sees error message for invalid job ID', async () => {
    const invalidJobId = 'invalid-job-id';
    const page = await context1.newPage();

    // Navigate to the Application Page with invalid job ID
    await page.goto(`/portal/soknader/${invalidJobId}`);
    await page.waitForLoadState('networkidle');

    // Verify that an error message is displayed
    await expect(page.locator('text=Ugyldig jobb-ID.')).toBeVisible();

    await page.close();
  });

  test('Multiple users can apply to the same job independently', async () => {
    // User1 applies to the job
    const page1 = await context1.newPage();
    await page1.goto(`/portal/soknader/${jobId}`);
    await page1.waitForLoadState('networkidle');
    const applyButton1 = page1.locator('button', {
      hasText: 'Søk på denne jobben',
    });
    await applyButton1.click();
    await expect(page1.locator('text=Søknaden har blitt sendt!')).toBeVisible();
    await page1.close();

    // User2 applies to the same job
    const page2 = await context2.newPage();
    await page2.goto(`/portal/soknader/${jobId}`);
    await page2.waitForLoadState('networkidle');
    const applyButton2 = page2.locator('button', {
      hasText: 'Søk på denne jobben',
    });
    await applyButton2.click();
    await expect(page2.locator('text=Søknaden har blitt sendt!')).toBeVisible();
    await page2.close();

    // Verify both applications exist via the API or by checking the UI
    const applications = await api.getApplicationsByJob(jobId);
    expect(applications.length).toBeGreaterThanOrEqual(2);
    const user1App = applications.find((app) => app.user === 'user1-id'); // Replace with actual user1 ID
    const user2App = applications.find((app) => app.user === 'user2-id'); // Replace with actual user2 ID
    expect(user1App).toBeDefined();
    expect(user2App).toBeDefined();
  });
});
