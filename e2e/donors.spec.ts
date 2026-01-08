import { test, expect } from '@playwright/test';

test.describe('Donor Management', () => {
  // Assuming we have a way to bypass auth or login. 
  // For now, we'll assume the user is logged in or we mock the auth state if possible, 
  // but Playwright runs against the real running app.
  // We'll write the test steps assuming the user can access the admin panel.

  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login');
    // Fill login form (assuming standard Supabase auth or similar)
    // await page.fill('input[type="email"]', 'admin@example.com');
    // await page.fill('input[type="password"]', 'password');
    // await page.click('button[type="submit"]');
    // await page.waitForURL('/admin');
    
    // NOTE: Since I cannot easily run E2E tests in this environment against a running dev server 
    // with database connectivity, I am writing this spec as a template.
  });

  test('should create, update, and delete a donor', async ({ page }) => {
    // Navigate to Donor Management
    await page.goto('/admin/donors');
    await expect(page.getByText('Donor Management')).toBeVisible();

    // CREATE
    await page.click('button:has-text("Add New Donor")');
    await expect(page.getByText('Add New Donor')).toBeVisible();
    
    await page.fill('input[placeholder="Company Name"]', 'Test Donor Inc');
    await page.fill('input[placeholder="https://example.com"]', 'https://testdonor.com');
    await page.fill('textarea[placeholder*="description"]', 'A test donor description');
    
    await page.click('button:has-text("Add Donor")');
    
    // Verify creation
    await expect(page.getByText('Test Donor Inc')).toBeVisible();
    await expect(page.getByText('testdonor.com')).toBeVisible();

    // UPDATE
    // Click edit button for the new donor (assuming it's the first or unique)
    await page.locator('tr:has-text("Test Donor Inc") button:has-text("edit")').click();
    await expect(page.getByText('Edit Donor')).toBeVisible();
    
    await page.fill('input[placeholder="Company Name"]', 'Test Donor Updated');
    await page.click('button:has-text("Update")');
    
    // Verify update
    await expect(page.getByText('Test Donor Updated')).toBeVisible();
    await expect(page.getByText('Test Donor Inc')).not.toBeVisible();

    // DELETE
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Test Donor Updated") button:has-text("delete")').click();
    
    // Verify deletion
    await expect(page.getByText('Test Donor Updated')).not.toBeVisible();
  });
});
