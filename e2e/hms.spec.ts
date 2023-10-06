import { test, expect, Page } from '@playwright/test'

// test.describe.configure({ mode: 'parallel' });

test.describe('hms', () => {

    async function login(page: Page) {
        await page.goto('/login')
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await expect(page.getByPlaceholder('email@domain.com')).toHaveValue("johndoe@email.com");
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await expect(page.getByPlaceholder('Password')).toHaveValue("123");
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('/hotels/list', { timeout: 0 })
    }

    test('render login page', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState();
        await expect(page.getByLabel('Email')).toBeInViewport()
        await expect(page.getByLabel('Password')).toBeInViewport()
        await expect(page.getByRole('button', { name: 'Login' })).toBeInViewport()
    })

    test('login page login button disabled initially', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState();
        await expect(page.getByRole('button', { name: 'Login' })).toBeDisabled()
    })

    test('login page validation email fail', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("adwdawd")
        await expect(page.getByRole('button', { name: 'Login' })).toBeDisabled()
    })

    test('login page validation pass', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("john@email.com")
        await page.getByPlaceholder('Password').fill("123")
        await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled()
    })

    test('login page login fail', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("asd@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForResponse("http://localhost:3000/api/users/login")
        await expect(page.getByText('Invalid credentials')).toBeInViewport({ timeout: 10000 });
    })

    test('login page login pass', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('/hotels/list', { timeout: 0 })
    })

    test('bookings check not logged in redirect', async ({ page }) => {
        await page.goto("/hotels/bookings")
        await page.waitForLoadState();
        await expect(page).toHaveURL("/login");
    })

    test('bookings render test', async ({ page }) => {
        await login(page)
        await page.waitForLoadState();
        await page.getByText('Bookings').click();
        await expect(page).toHaveURL("/hotels/bookings", { timeout: 0 })
        await page.waitForLoadState();
        await expect(page.getByRole('heading', { name: 'Executive Double Room' })).toBeDefined();
    })

    test('details check not logged in redirect', async ({ page }) => {
        await page.goto("/hotels/details")
        await page.waitForLoadState();
        await expect(page).toHaveURL("/login");
    })

    test('details render test', async ({ page }) => {
        await login(page)
        await page.waitForLoadState();
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').waitFor();
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').click();
        await expect(page).toHaveURL('/hotels/details');
    })

    test('details filter dates test', async ({ page }) => {
        await login(page)
        await page.waitForLoadState();
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').waitFor();
        await page.locator('div:nth-child(2) > .ant-col > .ant-list-item > .ant-card > .ant-card-body').click();
        await expect(page).toHaveURL('/hotels/details');
        await page.waitForLoadState();
        await page.getByPlaceholder('Start date').click();
        await page.getByTitle('2023-10-13').getByText('13').click();
        await page.getByPlaceholder('End date').click();
        await page.getByTitle('2023-10-16').getByText('16').click();
        await expect(page.getByRole('button', { name: 'Book' }).nth(1)).toBeEnabled();
    })

    test('list check not logged in redirect', async ({ page }) => {
        await page.goto("/hotels/list")
        await page.waitForLoadState();
        await expect(page).toHaveURL("/login");
    })

    test('list render test', async ({ page }) => {
        await login(page)
        await expect(page.getByText('Filter').first()).toBeInViewport({ timeout: 0 });
    })

    test('list data fetch', async ({ page }) => {
        await page.goto("/login")
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByText('Login').waitFor()
        await page.getByText('Login').click()
        await expect(page).toHaveURL("/hotels/list")
        await page.waitForLoadState();
        await expect(page.getByText('Test').first()).toBeInViewport();
    })

    test('list filter', async ({ page }) => {
        await page.goto("/login")
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByText('Login').waitFor()
        await page.getByText('Login').click()
        await expect(page).toHaveURL("/hotels/list")
        await page.waitForLoadState();
        await expect(page.getByText('Novotel Mumbai International Airport')).toBeVisible({ timeout: 0 });
        await expect(page.getByText('Novotel Mumbai International Airport')).not.toBeInViewport({ timeout: 0 });
        await page.getByPlaceholder('Search hotels').waitFor();
        await page.getByPlaceholder('Search hotels').fill("Novotel Mumbai International Airport");
        // await page.getByPlaceholder('Search by address').click();
        // await page.getByLabel('State').click();
        // await page.getByTitle('Kerala').getByText('Kerala').click();
        await page.getByLabel('Country').waitFor();
        await page.getByLabel('Country').click();
        await page.getByTitle('India').getByText('India').click();
        await page.getByRole('button', { name: 'Filter' }).click();
        await expect(page.getByText('Novotel Mumbai International Airport')).toBeInViewport({ timeout: 0 });
    })

    test('upsert check not logged in redirect', async ({ page }) => {
        await page.goto("/hotels/upsert")
        await expect(page).toHaveURL("/login");
    })

    test('upsert render test', async ({ page }) => {
        await page.goto("/login")
        await page.waitForLoadState();
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("janedoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL("/hotels/admin/list", { timeout: 0 })
        await page.getByText('Add Hotel').click();
        await expect(page).toHaveURL("/hotels/upsert", { timeout: 0 })
    })

    test('render register page', async ({ page }) => {
        await page.goto('/register')
        await expect(page.getByLabel('First name')).toBeInViewport()
        await expect(page.getByLabel('Last name')).toBeInViewport()
        await expect(page.getByLabel('Email')).toBeInViewport()
        await expect(page.getByLabel('Password')).toBeInViewport()
        await expect(page.getByRole('button', { name: 'Register' })).toBeInViewport()
    })

    test('register page register button disabled initially', async ({ page }) => {
        await page.goto('/register')
        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled()
    })

    test('reigster page validation email fail', async ({ page }) => {
        await page.goto('/register')
        await page.getByPlaceholder('John', { exact: true }).waitFor();
        await page.getByPlaceholder('John', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('Doe', { exact: true }).waitFor()
        await page.getByPlaceholder('Doe', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('johndoe@domain.com').fill("adwdawd")
        await page.getByPlaceholder('Password').fill("adwdawd")
        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled()
    })

    test('register page validation pass', async ({ page }) => {
        await page.goto('/register')
        await page.getByPlaceholder('John', { exact: true }).waitFor();
        await page.getByPlaceholder('John', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('Doe', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('johndoe@domain.com').fill("john@email.com")
        await page.getByPlaceholder('Password').fill("123")
        await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled({ timeout: 10000 })
    })

    test('register page register fail', async ({ page }) => {
        await page.route('/api/users/register', async route => {
            const json = "null"
            await route.fulfill({ json, status: 500 });
        })
        await page.goto('/register')
        await page.getByPlaceholder('John', { exact: true }).waitFor();
        await page.getByPlaceholder('John', { exact: true }).fill("ionim")
        await page.getByPlaceholder('Doe', { exact: true }).waitFor()
        await page.getByPlaceholder('Doe', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('johndoe@domain.com').waitFor()
        await page.getByPlaceholder('johndoe@domain.com').fill("john@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Register' }).waitFor();
        await page.getByRole('button', { name: 'Register' }).click()
        await expect(page.getByText('Could not register user')).toBeInViewport();
    })

    test('register page register success', async ({ page }) => {
        await page.route('/api/users/register', async route => {
            const json = JSON.stringify({
                insertedId: "64d4b225b8793b5e3254543f"
            })
            await route.fulfill({ json });
        })
        await page.goto('/register')
        await page.waitForLoadState();
        await page.getByPlaceholder('John', { exact: true }).waitFor();
        await page.getByPlaceholder('John', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('Doe', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('johndoe@domain.com').fill("johny@email.com")
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Register' }).click()
        await expect(page).toHaveURL('/login')
    })
})
