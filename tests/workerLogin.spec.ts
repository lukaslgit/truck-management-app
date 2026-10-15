import { test, expect } from '@playwright/test';

const workerMail = process.env.TEST_WORKER_MAIL;
const workerPassword = process.env.TEST_WORKER_PASSWORD;

const loginEndpoint = '/api/workers/login'

test('worker login with right credentials', async ({ page }) => {

    if(!workerMail || !workerPassword){
        throw new Error('No test worker mail or password in env!');
    }

    await page.goto('login');

    await page.getByTestId('email-input').isVisible();
    await page.getByTestId('email-input').fill(workerMail);
    await page.getByTestId('password-input').fill(workerPassword);


    const responsePromise = page.waitForResponse(response =>
        response.request().method() === 'POST' &&
        new URL(response.url()).pathname.endsWith(loginEndpoint)
    );

    await page.getByTestId('login-submit-btn').click();

    const response = await responsePromise;

     expect(response.status()).toBe(200);

    await expect(page).toHaveURL('profile');

});

test('worker login with wrong password', async ({ page }) => {
    if(!workerMail){
        throw new Error('No test worker mail in env!');
    }

    await page.goto('login');

    await page.getByTestId('email-inpu').isVisible();
    await page.getByTestId('email-input').fill(workerMail);
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