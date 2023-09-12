import { test, expect } from '@playwright/test'

// test.describe.configure({ mode: 'parallel' });

test.describe('hotel details', () => {

    test('check not logged in redirect', async ({ page }) => {
        await page.goto("/hotels/details")
        await expect(page).toHaveURL("/login");
    })

    test('render test', async ({ page }) => {
        await page.goto("/login")
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL("/hotels/list", { timeout: 20000 })
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').waitFor();
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').click();
        await expect(page).toHaveURL('/hotels/details');
    })

    test('filter dates test', async ({ page }) => {
        await page.goto("/login")
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL("/hotels/list", { timeout: 20000 })
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').waitFor();
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').click();
        await expect(page).toHaveURL('/hotels/details');
        await page.getByPlaceholder('Start date').click();
        await page.getByTitle('2023-09-13').getByText('13').click();
        await page.getByPlaceholder('End date').click();
        await page.getByTitle('2023-09-16').getByText('16').click();
        await expect(page.getByRole('button', { name: 'Book' }).nth(1)).toBeEnabled();
    })

})
