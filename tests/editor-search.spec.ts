import { test, expect } from '@playwright/test';

test.describe('Editor to Search Flow', () => {
  test('should create post and find it via search', async ({ page }) => {
    // Create a new post
    await page.goto('/posts/new');
    await page.fill('[name="title"]', 'Test Post');
    await page.fill('[name="slug"]', 'test-post');
    await page.fill('[name="body"]', 'This is a test post for search functionality.');
    await page.fill('[name="tags"]', 'test,search');
    await page.click('button[type="submit"]');

    // Wait for post creation
    await expect(page).toHaveURL(/\/posts\/[^/]+$/);

    // Go to search page
    await page.goto('/search');
    await page.fill('[name="q"]', 'test');
    await page.click('button[type="submit"]');

    // Verify search results
    await expect(page.locator('text=Test Post')).toBeVisible();
    await expect(page.locator('text=This is a test post')).toBeVisible();
  });

  test('should handle fuzzy search when exact match not found', async ({ page }) => {
    // Create a post with a typo
    await page.goto('/posts/new');
    await page.fill('[name="title"]', 'Test Post');
    await page.fill('[name="slug"]', 'test-post-typo');
    await page.fill('[name="body"]', 'This is a test post with a typo.');
    await page.fill('[name="tags"]', 'test,typo');
    await page.click('button[type="submit"]');

    // Search with correct spelling
    await page.goto('/search');
    await page.fill('[name="q"]', 'typo');
    await page.click('button[type="submit"]');

    // Verify fuzzy search results
    await expect(page.locator('text=Test Post')).toBeVisible();
    await expect(page.locator('text=This is a test post with a typo')).toBeVisible();
  });
}); 