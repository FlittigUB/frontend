import { test, expect } from '@playwright/test';

test.describe('Om Oss Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/info/om-oss');
  });

  test('Should display BeaverHero with correct title', async ({ page }) => {
    const heroTitle = page.locator('h1', { hasText: 'Om Oss' });
    await expect(heroTitle).toBeVisible();
  });

  test('Should display team information correctly', async ({ page }) => {
    const teamHeading = page.locator('h2', { hasText: 'Gjengen i Flittig UB' });
    const teamLogo = page.getByAltText('Flittig UB maskott'); // More specific
    const teamDetails = page.locator('h2 + img + h2', {
      hasText: /Flittig er en ungdomsbedrift/,
    });

    await expect(teamHeading).toBeVisible();
    await expect(teamLogo).toBeVisible();
    await expect(teamDetails).toBeVisible();
  });

  test('Should fetch and display cooperation partners from backend', async ({
    page,
  }) => {
    const partners = page.getByTestId('cooperation-partner');
    expect(await partners.count()).toBeGreaterThan(0); // Using a custom matcher or alternative

    // Optionally, verify specific partner details if known
    // Example:
    // await expect(page.getByText('Partner A')).toBeVisible();
  });

  test('Should display all cooperation partner details correctly', async ({
    page,
  }) => {
    const partnerContainers = page.locator(
      'div[data-testid="cooperation-partner"]',
    );
    const count = await partnerContainers.count();

    for (let i = 0; i < count; i++) {
      const container = partnerContainers.nth(i);
      const title = container.locator('h2');
      const description = container.locator('p');
      const logo = container.getByRole('img', {
        name: /Samarbeidspartner|Utvikler/i,
      });
      const links = container.locator('a');

      await expect(title).toBeVisible();
      await expect(description).toBeVisible();
      await expect(logo).toBeVisible();
      expect(await links.count()).toBeGreaterThan(0);

      // Verify link URLs if necessary
      const href = await links.first().getAttribute('href');
      expect(href).toMatch(/^https?:\/\//); // Simple URL validation
    }
  });

  test('Should display address section correctly', async ({ page }) => {
    const addressTitle = page.locator('h2', { hasText: '"Kontoret"' });
    const addressContent = page.locator('p', {
      hasText: 'Lund, Jegersbergveien 1, 4630 Kristiansand',
    });
    const mapImage = page.getByAltText('Google Maps Plassering for kontoret');

    await expect(addressTitle).toBeVisible();
    await expect(addressContent).toBeVisible();
    await expect(mapImage).toBeVisible();
  });

  test('Should display Google Maps image correctly', async ({ page }) => {
    const mapImage = page.getByAltText('Google Maps Plassering for kontoret');
    await expect(mapImage).toBeVisible();
  });

  test('Should navigate to partner links correctly', async ({ page }) => {
    const partnerLinks = page.locator(
      'div[data-testid="cooperation-partner"] a',
    );

    const count = await partnerLinks.count();
    console.log(`Number of partner links: ${count}`);
    for (let i = 0; i < count; i++) {
      const link = partnerLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^https?:\/\//); // Ensure it's an external link

      // Click the link and wait for navigation in the same tab
      if (href) {
        await Promise.all([page.waitForURL(href), link.click()]);
      } else {
        throw new Error('Could not navigate to partner links');
      }

      const url = page.url();
      expect(url).toMatch(/^https?:\/\//);

      // Navigate back to the original page for the next iteration
      await page.goBack();
    }
  });
});
