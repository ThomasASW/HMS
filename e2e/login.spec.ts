import { test, expect } from '@playwright/test'

// test.describe.configure({ mode: 'parallel' });

test.describe('login', () => {

    test('render login page', async ({ page }) => {
        await page.goto('/login')
        await expect(page.getByLabel('Email')).toBeInViewport()
        await expect(page.getByLabel('Password')).toBeInViewport()
        await expect(page.getByRole('button', { name: 'Login' })).toBeInViewport()
    })

    test('login page login button disabled initially', async ({ page }) => {
        await page.goto('/login')
        await expect(page.getByRole('button', { name: 'Login' })).toBeDisabled()
    })

    test('login page validation email fail', async ({ page }) => {
        await page.goto('/login')
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("adwdawd")
        await expect(page.getByRole('button', { name: 'Login' })).toBeDisabled()
    })

    test('login page validation pass', async ({ page }) => {
        await page.goto('/login')
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("john@email.com")
        await page.getByPlaceholder('Password').fill("123")
        await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled()
    })

    test('login page login fail', async ({ page }) => {
        await page.route('/api/users/login', async route => {
            const json = "null"
            await route.fulfill({ json });
        })
        await page.goto('/login')
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("asd@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Invalid credentials')).toBeInViewport({ timeout: 10000 });
    })

    test('login page login pass', async ({ page }) => {
        await page.route('/api/users/login', async route => {
            const json = JSON.stringify({
                _id: {
                    $oid: "64d4b225b8793b5e3254543f"
                },
                email: "johndoe@email.com",
                role: "user"
            })
            await route.fulfill({ json });
        })
        await page.goto('/login')
        await page.evaluate(() => document.cookie = "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQ0YjIyNWI4NzkzYjVlMzI1NDU0M2YiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MzgwMzczOSwiZXhwIjoxNjkzODkwMTM5fQ.0CZ2LTVjMF4GBBHZTjqHbybmgbwaVj5craGaSIwapYg;")
        await page.evaluate(() => console.log(document.cookie))
        await page.getByPlaceholder('email@domain.com').waitFor()
        await page.getByPlaceholder('email@domain.com').fill("johoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByRole('button', { name: 'Login' }).waitFor()
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('/hotels/list', { timeout: 15000 })
    })
})
