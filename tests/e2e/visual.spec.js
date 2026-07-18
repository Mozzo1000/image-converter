import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE_IMAGE = path.join(__dirname, 'fixtures', 'sample.png');

for (const colorScheme of ['light', 'dark']) {
	test.describe(`${colorScheme} mode`, () => {
		test.use({ colorScheme });

		test('empty dropzone', async ({ page }) => {
			await page.goto('/');
			await expect(page.getByText('Upload Images')).toBeVisible();

			await expect(page).toHaveScreenshot(`empty-${colorScheme}.png`, { maxDiffPixelRatio: 0.02 });
		});

		test('queue with a pending and a completed file', async ({ page }) => {
			await page.goto('/');
			await page.setInputFiles('input[type="file"]', [SAMPLE_IMAGE, SAMPLE_IMAGE]);
			await expect(page.getByText('Queue (2)')).toBeVisible();

			// Convert only the first card so the screenshot captures both a pending
			// and a completed state at once.
			await page.getByRole('button', { name: /^Convert/ }).click();
			await expect(page.getByText('completed')).toBeVisible();

			await expect(page).toHaveScreenshot(`queue-${colorScheme}.png`, { maxDiffPixelRatio: 0.02 });
		});
	});
}
