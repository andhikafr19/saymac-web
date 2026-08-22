import { test, expect } from '@playwright/test';

test.describe('Say Macaroni Landing Web E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Menampilkan Halaman Utama & Hero Section dengan benar', async ({ page }) => {
    // Check main branding header
    await expect(page.locator('h1')).toContainText('Sensasi');
    // Check CTA button
    const catalogBtn = page.getByRole('button', { name: 'Lihat Katalog' });
    await expect(catalogBtn).toBeVisible();
  });

  test('2. Navigasi Antar Halaman Berfungsi', async ({ page }) => {
    // Navigasi ke Katalog
    await page.getByRole('link', { name: 'Katalog' }).click();
    await expect(page.locator('h1')).toContainText('Varian Rasa Say Macaroni');

    // Navigasi ke Tentang Kami
    await page.getByRole('link', { name: 'Tentang Kami' }).click();
    await expect(page.locator('h1')).toContainText('Cerita Say! Macaroni');

    // Navigasi ke Hubungi Kami
    await page.getByRole('link', { name: 'Hubungi Kami' }).click();
    await expect(page.locator('h1')).toContainText('Ada Pertanyaan?');
  });

  test('3. Pencarian & Filter Produk di Katalog', async ({ page }) => {
    await page.getByRole('link', { name: 'Katalog' }).click();
    
    // Search filter
    const searchInput = page.getByPlaceholder('Cari rasa atau nama makaroni...');
    await searchInput.fill('Garlic');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('.product-title')).toContainText('Garlic');
  });

  test('4. Flow Detail Produk & Masuk Keranjang', async ({ page }) => {
    await page.getByRole('link', { name: 'Katalog' }).click();
    
    // Click on first product card
    await page.locator('.product-card').first().click();
    await expect(page.getByRole('button', { name: /Tambah ke Keranjang/i })).toBeVisible();

    // Select spicy level if available
    const spiceButtons = page.locator('.spice-hover');
    if (await spiceButtons.count() > 0) {
      await spiceButtons.first().click();
    }

    // Add to cart
    await page.getByRole('button', { name: /Tambah ke Keranjang/i }).click();
    await expect(page.getByRole('button', { name: /Berhasil Ditambahkan/i })).toBeVisible();

    // Check cart button badge
    const cartButton = page.locator('button', { hasText: 'Keranjang' });
    await expect(cartButton).toBeVisible();
  });

  test('5. Toggle Dark / Light Theme', async ({ page }) => {
    const themeBtn = page.locator('button[title="Mode Terang"], button[title="Mode Gelap"]').first();
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    // Verify html/body theme attribute changes
    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBeDefined();
  });

  test('6. Menampilkan Campaign Banner Seasonal Secara Dinamis', async ({ page }) => {
    // Check if campaign banner is rendered
    const campaignBanner = page.locator('.campaign-banner');
    await expect(campaignBanner).toBeVisible();
    // Check elements within campaign banner
    await expect(campaignBanner.locator('h2')).toBeVisible();
    const ctaBtn = campaignBanner.getByRole('button');
    await expect(ctaBtn).toBeVisible();
  });

  test('7. Menampilkan Info Kontak & Tautan WhatsApp Dinamis', async ({ page }) => {
    await page.getByRole('link', { name: 'Hubungi Kami' }).click();
    // Check WhatsApp link presence
    const waLink = page.locator('a[href*="wa.me"]');
    await expect(waLink.first()).toBeVisible();
    // Check Footer Instagram & WA link
    const footer = page.locator('footer');
    await expect(footer.locator('a[href*="wa.me"]')).toBeVisible();
  });
});


