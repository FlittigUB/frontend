// tests/faq.spec.ts
import { test, expect } from '@playwright/test';

test.describe('FAQ Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/info/ofte-stilte-sporsmal');
  });

  test('Should display BeaverHero with correct title and subtitle', async ({
    page,
  }) => {
    const heroTitle = page.locator('h1', { hasText: 'Ofte stilte spørsmål' });
    const heroSubtitle = page.locator('p', {
      hasText: 'For deg som ikke har alle svarene',
    });

    await expect(heroTitle).toBeVisible();
    await expect(heroSubtitle).toBeVisible();
  });

  test('Should fetch and display FAQs from backend', async ({ page }) => {
    // Assuming FAQs are rendered as buttons with question text
    const faqItems = page.getByTestId('faq-item-button');

    // Wait for FAQs to load (assuming there's a loading state)
    expect(await faqItems.count()).toBeGreaterThan(0);

    // Optionally, you can verify specific FAQ items if known
    // Example:
    // await expect(page.locator('button', { hasText: 'Hvordan registrerer jeg meg?' })).toBeVisible();
  });

  test('Should expand and collapse FAQ items on click', async ({ page }) => {
    const faqButtons = page.locator('[data-testid="faq-item-button"]');

    const count = await faqButtons.count();
    for (let i = 0; i < count; i++) {
      const button = faqButtons.nth(i);

      // Log the button text for debugging
      const questionText = await button.textContent();
      console.log(`Testing button ${i + 1}: ${questionText}`);

      // Ensure the button is visible
      await expect(button).toBeVisible();

      // Click to expand the FAQ
      await button.click();

      // Locate the collapsible container
      const answerContainer = button
        .locator('..')
        .locator('[data-testid="faq-answer-container"]');

      // Click again to collapse the FAQ
      await button.click();

      // Ensure hidden
      await expect(answerContainer).toBeHidden({ timeout: 5000 });
    }
  });

  //
  // test('Should handle empty FAQ list gracefully', async ({ page }) => {
  //   // Similar to error handling, this requires the backend to return an empty list
  //   // If your test environment allows, set the backend to return an empty list temporarily
  //
  //   // Placeholder
  //   test.skip('Empty FAQ list test requires backend manipulation', async () => {});
  // });
});
