import { defineConfig, devices } from '@playwright/test';
import path from 'path'

const baseURL = `http://localhost:3000`

export default defineConfig({
    // Timeout per test
    timeout: 90 * 1000,
    // Test directory
    testDir: path.join(__dirname, 'e2e'),
    // If a test fails, retry it additional 2 times
    retries: 2,
    // Artifacts folder where screenshots, videos, and traces are stored.
    outputDir: 'test-results/',

    workers: 2,

    // Run your local dev server before starting the tests:
    // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
    webServer: {
        command: 'npm run dev',
        url: baseURL,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },

    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: baseURL,
        trace: 'retry-with-trace',
    },

    projects: [
        {
            name: 'Desktop Chrome',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        // {
        //     name: 'Desktop Firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //     },
        // },
        // {
        //   name: 'Desktop Safari',
        //   use: {
        //     ...devices['Desktop Safari'],
        //   },
        // },
        // Test against mobile viewports.
        // {
        //     name: 'Mobile Chrome',
        //     use: {
        //         ...devices['Pixel 5'],
        //     },
        // },
        // {
        //     name: 'Mobile Safari',
        //     use: devices['iPhone 12'],
        // },
    ],
});