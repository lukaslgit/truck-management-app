import { test, expect } from '@playwright/test';

const managerEmail = process.env.TEST_MANAGER_MAIL;
const managerPassword = process.env.TEST_MANAGER_PASSWORD;

const loginEndpoint = '/api/managers/login'

test('manager login with right credentials', async ({ page }) => {
    if (!managerEmail || !managerPassword){
        throw new Error('No test manager email or password in env file!');
    }

    await page.goto('login');
    await page.getByTestId('email-input').isVisible();
    await page.getByTestId('manager-btn').click();
    await page.getByTestId('email-input').fill(managerEmail);
    await page.getByTestId('password-input').fill(managerPassword);

    const responsePromise = page.waitForResponse(response =>
        response.request().method() === 'POST' &&
        new URL(response.url()).pathname.endsWith(loginEndpoint)
    );

    await page.getByTestId('login-submit-btn').click();

    const response = await responsePromise;

    expect(response.status()).toBe(200);

    await expect(page).toHaveURL('profile')

})

test('manager login with wrong password', async ({ page }) => {
    if(!managerEmail){
        throw new Error('No test worker mail in env!');
    }

    await page.goto('login');

    await page.getByTestId('email-input').isVisible();
    await page.getByTestId('manager-btn').click();
    await page.getByTestId('email-input').fill(managerEmail);
    await page.getByTestId('password-input').fill('test');

    const responsePromise = page.waitForResponse(response =>
        response.request().method() === 'POST' &&
        new URL(response.url()).pathname.endsWith(loginEndpoint)
    );

    await page.getByTestId('login-submit-btn').click();

    const response = await responsePromise;

    expect(response.status()).toBe(401);

    await expect(page.getByTestId('auth-error')).toBeVisible();
})