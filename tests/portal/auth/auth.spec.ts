import { test, expect } from '@playwright/test';

test.describe('MultiStepRegisterPage E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page
    await page.goto('/portal/registrer-deg');
  });

  test('should complete the multi-step registration successfully', async ({
    page,
  }) => {
    // Step 1: Role selection
    await expect(page.locator('text=Velkommen! 🎉')).toBeVisible();
    await page.locator('button:has-text("Arbeidsgiver")').click();

    // Step 2: Personal info form is displayed
    await expect(page.locator('text=Personlig Informasjon 📝')).toBeVisible();

    const uniqueEmail = `testuser+${Date.now()}@wf.nerskogen.com`;
    await page.fill('input[placeholder="Epost"]', uniqueEmail);
    await page.fill('input[placeholder="Ola Normann"]', 'Test User');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.fill(
      'input[id="mobile"]',
      Math.floor(Math.random() * 100000000).toString(),
    );
    await page.fill('input[placeholder="Passord"]', 'TestPassword123!');
    await page.fill('input[placeholder="Bekreft passord"]', 'TestPassword123!');

    await page.locator('button:has-text("Neste")').click();

    // Step 3: Profile details
    await expect(page.locator('text=Profil Detaljer 🎨')).toBeVisible();

    // Fill bio
    await page.fill('#bio', 'This is a test bio for the new user.');

    // Upload an image from local fixtures
    await page.setInputFiles(
      'input[type="file"]',
      'tests/fixtures/sample-image.png',
    );

    // Click "Registrer"
    const [registerResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/auth/register') && res.ok(),
      ),
      page.locator('button:has-text("Registrer")').click(),
    ]);

    expect(registerResponse.status()).toBe(201);

    // Expect success message
    await expect(
      page.locator('text=Registrering vellykket! Logger inn...').nth(1),
    ).toBeVisible();

    // Wait for navigation to /portal after login
    await page.waitForURL('/portal');

    // Verify that the portal page loaded successfully (adjust selector as needed)
    // For example, look for some element that only appears in /portal
    await expect(page.locator('text=Velkommen til Flittig')).toBeVisible();
  });
});
