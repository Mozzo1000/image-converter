import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE_IMAGE = path.join(__dirname, 'fixtures', 'sample.png');

test.beforeEach(async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Image Converter' })).toBeVisible();
});

test('loads the app with an empty dropzone and no queue', async ({ page }) => {
	await expect(page.getByText('Upload Images')).toBeVisible();
	await expect(page.getByText(/Queue \(\d+\)/)).not.toBeVisible();
});

test('uploading a file adds a pending card to the queue', async ({ page }) => {
	await page.setInputFiles('input[type="file"]', SAMPLE_IMAGE);

	await expect(page.getByText('Queue (1)')).toBeVisible();
	await expect(page.getByText('sample.png')).toBeVisible();
	await expect(page.getByText('pending')).toBeVisible();
	await expect(page.getByRole('button', { name: /^Convert/ })).toBeEnabled();
});

test('changing the output format updates the selector and resets queued files to pending', async ({ page }) => {
	await page.setInputFiles('input[type="file"]', SAMPLE_IMAGE);
	await expect(page.getByText('pending')).toBeVisible();

	// Convert once so there's a non-pending status to observe being reset.
	await page.getByRole('button', { name: /^Convert/ }).click();
	await expect(page.getByText('completed')).toBeVisible();

	await page.getByRole('button', { name: 'PNG' }).click();
	await page.getByRole('button', { name: 'JPEG' }).click();

	await expect(page.getByRole('button', { name: 'JPEG' })).toBeVisible();
	await expect(page.getByText('pending')).toBeVisible();
	await expect(page.getByText('completed')).not.toBeVisible();
});

test('converting a file marks it completed and shows a download link', async ({ page }) => {
	await page.setInputFiles('input[type="file"]', SAMPLE_IMAGE);
	await page.getByRole('button', { name: /^Convert/ }).click();

	await expect(page.getByText('completed')).toBeVisible();
	const downloadLink = page.locator('a[download^="conv-"]');
	await expect(downloadLink).toBeVisible();
	await expect(downloadLink).toHaveAttribute('href', /^blob:/);
});

test('Clear All empties the queue', async ({ page }) => {
	await page.setInputFiles('input[type="file"]', SAMPLE_IMAGE);
	await expect(page.getByText('Queue (1)')).toBeVisible();

	await page.getByRole('button', { name: 'Clear All' }).click();

	await expect(page.getByText(/Queue \(\d+\)/)).not.toBeVisible();
	await expect(page.getByText('sample.png')).not.toBeVisible();
});

test('theme toggle switches the dark class and persists across reload', async ({ page }) => {
	const html = page.locator('html');
	const toggle = page.getByRole('button', { name: 'Toggle Theme' });

	const wasDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
	await toggle.click();
	if (wasDark) {
		await expect(html).not.toHaveClass(/dark/);
	} else {
		await expect(html).toHaveClass(/dark/);
	}

	const isDarkNow = (await html.getAttribute('class'))?.includes('dark') ?? false;
	await page.reload();
	if (isDarkNow) {
		await expect(html).toHaveClass(/dark/);
	} else {
		await expect(html).not.toHaveClass(/dark/);
	}
});
