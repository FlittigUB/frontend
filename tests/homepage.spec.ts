// tests/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Should display BeaverHero with correct title and subtitle', async ({
    page,
  }) => {
    const heroTitle = page.getByRole('heading', {
      name: 'En enklere hverdag!',
    });
    const heroSubtitle = page.getByText(
      'Plattformen som gjør det lett å få hjelp til småjobber.',
    );

    await expect(heroTitle).toBeVisible();
    await expect(heroSubtitle).toBeVisible();
  });

  test('Should display "Hvordan fungerer Flittig?" section correctly', async ({
    page,
  }) => {
    const sectionTitle = page.getByRole('heading', {
      name: 'Hvordan fungerer Flittig?',
    });
    const sectionText = page.getByText(
      /I Flittig legger du enkelt ut annonser/,
    );

    await expect(sectionTitle).toBeVisible();
    await expect(sectionText).toBeVisible();
  });

  test('Should display "Hverdagen skal være enkel" section correctly', async ({
    page,
  }) => {
    const sectionTitle = page.getByRole('heading', {
      name: 'Hverdagen skal være enkel',
    });
    const sectionText = page.getByText(
      /... og med flittig er du bare få tastetrykk unna/,
    );

    await expect(sectionTitle).toBeVisible();
    await expect(sectionText).toBeVisible();
  });

  test('Should display "Vasking, flytting eller handlehjelp?" section correctly', async ({
    page,
  }) => {
    const sectionTitle = page.getByRole('heading', {
      name: 'Vasking, flytting eller handlehjelp?',
    });
    const sectionText = page.getByText(
      /Med Flittig løser du små og mellomstore jobber/,
    );

    await expect(sectionTitle).toBeVisible();
    await expect(sectionText).toBeVisible();
  });

  test('Should navigate to FAQ page when clicking on FAQ link', async ({
    page,
  }) => {
    const faqLink = page.getByRole('link', { name: 'Ofte Stilte Spørsmål' });
    await expect(faqLink).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/info\/ofte-stilte-sporsmal$/),
      faqLink.click(),
    ]);

    const faqTitle = page.getByRole('heading', {
      name: 'Ofte stilte spørsmål',
    });
    await expect(faqTitle).toBeVisible();
  });

  test('Should navigate to Om Oss page when clicking on Om Oss link', async ({
    page,
  }) => {
    const omOssLink = page.getByRole('link', { name: 'Om Oss' });
    await expect(omOssLink).toBeVisible();

    await Promise.all([page.waitForURL(/\/info\/om-oss$/), omOssLink.click()]);

    const omOssTitle = page.getByRole('heading', { name: 'Om Oss' });
    await expect(omOssTitle).toBeVisible();
  });

  test('Should display Register button and navigate correctly', async ({
    page,
  }) => {
    const registerButton = page.getByRole('link', { name: 'Registrer deg' });
    await expect(registerButton).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/registrer-deg$/),
      registerButton.click(),
    ]);

    await expect(page).toHaveURL(/.*\/registrer-deg$/);
  });

  test('Should display all main sections on the homepage', async ({ page }) => {
    const sections = [
      'Hvordan fungerer Flittig?',
      'Hverdagen skal være enkel',
      'Vasking, flytting eller handlehjelp?',
    ];

    for (const section of sections) {
      const sectionHeading = page.getByRole('heading', { name: section });
      await expect(sectionHeading).toBeVisible();
    }
  });

  test('Should display images correctly', async ({ page }) => {
    const flittigLogo = page.getByTestId('flittig-logo');
    const treBevereImage = page.getByAltText(
      'Tre bevere som representerer vasking, flytting og handlehjelp',
    );
    const beaverMyntBgImage = page
      .locator('section')
      .filter({
        hasText: 'Bli flittig du også!Registrer',
      })
      .getByRole('img', {
        name: 'Flittig UB Logo',
      });

    await expect(flittigLogo).toBeVisible();
    await expect(treBevereImage).toBeVisible();
    await expect(beaverMyntBgImage).toBeVisible();
  });
});
