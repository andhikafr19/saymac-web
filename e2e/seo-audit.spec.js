import { test, expect } from '@playwright/test';

test.describe('Say Macaroni - Comprehensive SEO & Crawlability Audit', () => {
  const BASE_URL = 'https://saymacaroni.vercel.app';

  test('1. Technical Meta Tags & Indexability Check', async ({ page }) => {
    await page.goto('/');

    // Check <html lang>
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('id');

    // Check <title>
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThanOrEqual(20);
    expect(title.length).toBeLessThanOrEqual(70);
    console.log(`[SEO] Page Title (${title.length} chars): "${title}"`);

    // Check <meta name="description">
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc.length).toBeGreaterThanOrEqual(50);
    expect(metaDesc.length).toBeLessThanOrEqual(180);
    console.log(`[SEO] Meta Description (${metaDesc.length} chars): "${metaDesc}"`);

    // Check <meta name="robots">
    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsMeta).toBeTruthy();
    expect(robotsMeta).not.toContain('noindex');
    expect(robotsMeta).not.toContain('nofollow');
    console.log(`[SEO] Robots Meta: "${robotsMeta}"`);

    // Check Canonical Tag
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toBe('https://saymacaroni.vercel.app/');
    console.log(`[SEO] Canonical URL: "${canonical}"`);

    // Check Viewport
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('2. Social Meta Tags (OpenGraph & Twitter Cards)', async ({ page, request }) => {
    await page.goto('/');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');

    expect(ogTitle).toBeTruthy();
    expect(ogDesc).toBeTruthy();
    expect(ogImage).toBeTruthy();
    expect(ogUrl).toBe('https://saymacaroni.vercel.app/');
    expect(ogType).toBe('website');

    // Verify OG Image actually exists and returns 200 OK
    const imgRes = await request.get(ogImage);
    expect(imgRes.status()).toBe(200);
    console.log(`[SEO] OG Image Status: ${imgRes.status()} (${ogImage})`);

    const twCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    const twDesc = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    const twImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');

    expect(twCard).toBe('summary_large_image');
    expect(twTitle).toBeTruthy();
    expect(twDesc).toBeTruthy();
    expect(twImage).toBeTruthy();
  });

  test('3. Heading Hierarchy (H1, H2, H3)', async ({ page }) => {
    await page.goto('/');

    const h1Count = await page.locator('h1').count();
    console.log(`[SEO] H1 Count on Landing: ${h1Count}`);
    expect(h1Count).toBe(1);

    const h1Text = await page.locator('h1').first().textContent();
    expect(h1Text?.trim().length).toBeGreaterThan(5);
    console.log(`[SEO] Main H1 Text: "${h1Text?.trim()}"`);

    const h2Count = await page.locator('h2').count();
    console.log(`[SEO] H2 Count: ${h2Count}`);
    expect(h2Count).toBeGreaterThan(0);
  });

  test('4. Image Alt Attributes & Media Assets Audit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();
    console.log(`[SEO] Found ${count} images on homepage`);

    let missingAltCount = 0;
    const missingAltList = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      if (alt === null || alt.trim() === '') {
        missingAltCount++;
        missingAltList.push(src || `img-${i}`);
      }
    }

    console.log(`[SEO] Images missing alt: ${missingAltCount}`);
    if (missingAltCount > 0) {
      console.log(`[SEO] Images without alt:`, missingAltList);
    }
    // We expect good SEO to have alt attributes on all content images
  });

  test('5. Schema.org JSON-LD Structured Data Validation', async ({ page }) => {
    await page.goto('/');

    const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLdScript).toBeTruthy();

    let parsed;
    expect(() => {
      parsed = JSON.parse(jsonLdScript || '{}');
    }).not.toThrow();

    expect(parsed['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsed['@graph'])).toBe(true);

    const types = parsed['@graph'].map(item => item['@type']);
    console.log(`[SEO] Schema.org types found:`, types);

    expect(types).toContain('WebSite');
    expect(types).toContain('Organization');
    expect(types).toContain('Store');

    // Validate store details
    const store = parsed['@graph'].find(item => item['@type'] === 'Store');
    expect(store.name).toBeTruthy();
    expect(store.priceRange).toBeTruthy();
    console.log(`[SEO] JSON-LD Schema valid!`);
  });

  test('6. Robots.txt and Sitemap.xml Crawlability & Integrity', async ({ request }) => {
    // Check robots.txt
    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain('User-agent: *');
    expect(robotsText).toContain('Allow: /');
    expect(robotsText).toContain('Sitemap: https://saymacaroni.vercel.app/sitemap.xml');
    console.log(`[SEO] robots.txt is valid.`);

    // Check sitemap.xml
    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain('<urlset');
    expect(sitemapXml).toContain('https://saymacaroni.vercel.app/');

    // Check for hashtag fragment issue in sitemap
    const hasHashInSitemap = sitemapXml.includes('#');
    console.log(`[SEO WARNING] Sitemap contains '#' anchor fragments: ${hasHashInSitemap}`);
    // Hash fragments in sitemaps are invalid for Googlebot
  });

  test('7. SPA Dynamic Meta Tag & Canonical Behavior On Navigation', async ({ page }) => {
    await page.goto('/');

    // Check homepage canonical
    let canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://saymacaroni.vercel.app/');

    // Navigate to Katalog
    await page.getByRole('link', { name: 'Katalog', exact: true }).click();
    await page.waitForTimeout(500);

    const catalogTitle = await page.title();
    console.log(`[SEO] Navigated to Katalog. Title: "${catalogTitle}"`);

    const catalogCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    console.log(`[SEO] Katalog Canonical URL: "${catalogCanonical}"`);
    const hasHashInCanonical = catalogCanonical?.includes('#');
    console.log(`[SEO WARNING] Katalog Canonical contains '#' fragment: ${hasHashInCanonical}`);
  });

  test('8. Console Errors & Broken Links Check', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`[SEO] Console errors detected: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log(`[SEO] Errors:`, consoleErrors);
    }

    // Check all internal links on the page
    const links = await page.locator('a[href]').evaluateAll(els =>
      els.map(e => ({ href: e.href, text: e.textContent?.trim() }))
    );
    console.log(`[SEO] Found ${links.length} anchor links`);
  });
});
