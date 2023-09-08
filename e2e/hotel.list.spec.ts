import { test, expect } from '@playwright/test'

// test.describe.configure({ mode: 'parallel' });

test.describe('hotels list', () => {

    test('check not logged in redirect', async ({ page }) => {
        await page.goto("/hotels/list")
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
        await expect(page.getByText('Filter').first()).toBeInViewport({ timeout: 25000 });
    })

    test('data fetch', async ({ page }) => {
        await page.route('/api/hotels/get-paginated-hotel-list', async route => {
            const json = JSON.stringify({
                hotels: [{
                    _id: {
                        $oid: "64d4b225b8793b5e3254543f"
                    },
                    name: "TestName",
                    description: "string",
                    address: "string",
                    city: "string",
                    state: "string",
                    country: "string",
                    pets: true,
                    amenities: ["adsad", "adad"],
                    roomCount: 3,
                    rooms: [{
                        roomNumber: 1,
                        desc: "string",
                        sleeps: 1,
                        area: 1,
                        nor: 1,
                        price: 1
                    }],
                    images: [{
                        imageURL: "https://media.formula1.com/image/upload/content/dam/fom-website/manual/Misc/2021manual/2021BritishManualAdds/2022CarImages/2022CarImageSTUDIO/2022%20F1%20Car%20Race%20Service%20-%20Ryan%20Davis-5.jpg.transform/9col/image.jpg",
                        imageDesc: "string",
                        imageType: "hotel",
                        roomNumber: 1
                    }],
                }],
                total: 1
            }
            )
            await route.fulfill({ json });
        })
        await page.goto("/login")
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByText('Login').waitFor()
        await page.getByText('Login').click()
        await expect(page).toHaveURL("/hotels/list")
        await expect(page.getByText('TestName')).toBeInViewport({ timeout: 25000 });
    })

    test('filter', async ({ page }) => {
        await page.goto("/login")
        await page.getByPlaceholder('email@domain.com').waitFor();
        await page.getByPlaceholder('email@domain.com').fill("johndoe@email.com")
        await page.getByPlaceholder('Password').waitFor()
        await page.getByPlaceholder('Password').fill("123")
        await page.getByText('Login').waitFor()
        await page.getByText('Login').click()
        await expect(page).toHaveURL("/hotels/list")
        await expect(page.getByText('Novotel Mumbai International Airport')).toBeVisible({ timeout: 25000 });
        await expect(page.getByText('Novotel Mumbai International Airport')).not.toBeInViewport({ timeout: 25000 });
        await page.getByPlaceholder('Search hotels').waitFor();
        await page.getByPlaceholder('Search hotels').fill("Novotel Mumbai International Airport");
        // await page.getByPlaceholder('Search by address').click();
        // await page.getByLabel('State').click();
        // await page.getByTitle('Kerala').getByText('Kerala').click();
        await page.getByLabel('Country').waitFor();
        await page.getByLabel('Country').click();
        await page.getByTitle('India').getByText('India').click();
        await page.getByRole('button', { name: 'Filter' }).click();
        await expect(page.getByText('Novotel Mumbai International Airport')).toBeInViewport({ timeout: 25000 });
    })
})
