import { test, expect } from '@playwright/test'

// test.describe.configure({ mode: 'parallel' });

test.describe('register', () => {

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
        await page.getByPlaceholder('John', { exact: true }).waitFor();
        await page.getByPlaceholder('John', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('Doe', { exact: true }).fill("adwdawd")
        await page.getByPlaceholder('johndoe@domain.com').fill("johny@email.com")
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Register' }).click()
        await expect(page).toHaveURL('/login')
    })
})
