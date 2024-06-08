const { Builder, By, until } = require('selenium-webdriver');
const assert = require('chai').assert;
require('chromedriver');
require('geckodriver');
// require('msedgedriver'); 

const runTestInBrowserWithRetry = async (browserName, testFn, retryCount = 3) => {
    let attempts = 0;
    while (attempts < retryCount) {
        try {
            await testFn(browserName);
            return; // Test passed, no need to retry
        } catch (error) {
            console.error(`Error occurred in ${browserName}:`, error);
            attempts++;
        }
    }
    throw new Error(`Failed to run test in ${browserName} after ${retryCount} attempts`);
};

const runLoginTest = async (browserName) => {
    let driver;
    try {
        driver = await new Builder().forBrowser(browserName).build();
        await driver.get('http://localhost:3000/login');

        // Wait for 2 seconds before interacting with the email input field
        await driver.sleep(2000);

        // Locate email and password input fields
        const emailInput = await driver.findElement(By.css('input[type="text"][placeholder="Email"]'));
        const passwordInput = await driver.findElement(By.css('input[type="password"][placeholder="Password"]'));

        // Assert that email and password input fields are displayed
        assert.isTrue(await emailInput.isDisplayed(), 'Email input field should be displayed');
        assert.isTrue(await passwordInput.isDisplayed(), 'Password input field should be displayed');

    } finally {
        // Quit the driver after the test case is completed
        if (driver) {
            await driver.quit();
        }
    }
};

const runLoginSuccessfulTest = async (browserName) => {
    let driver;
    try {
        driver = await new Builder().forBrowser(browserName).build();
        await driver.get('http://localhost:3000/login');

        // Wait for 2 seconds before interacting with the email input field
        await driver.sleep(2000);

        // Enter email and password
        const emailInput = await driver.findElement(By.css('input[type="text"][placeholder="Email"]'));
        const passwordInput = await driver.findElement(By.css('input[type="password"][placeholder="Password"]'));
        await emailInput.sendKeys('sanju@gmail.com');
        await passwordInput.sendKeys('123456');

        // Click the login button
        const loginButton = await driver.findElement(By.id('LoginButt'));
        await loginButton.click();

        // Wait for the home page to load
        await driver.wait(until.urlIs('http://localhost:3000/home'), 10000); // Adjust the timeout as needed

    } finally {
        // Quit the driver after the test case is completed
        if (driver) {
            await driver.quit();
        }
    }
};

describe('Login Page Tests', function() {
    this.timeout(30000000); // Set timeout to 30 seconds for the whole suite

    it('should display email and password input fields in Chrome, Firefox, and Edge concurrently with retry', async function() {
        await Promise.all([
            runTestInBrowserWithRetry('chrome', runLoginTest),
            runTestInBrowserWithRetry('firefox', runLoginTest),
            runTestInBrowserWithRetry('MicrosoftEdge', runLoginTest) // Ensure msedgedriver is installed and accessible in the system PATH or specify its path
        ]);
    });

    it('should login successfully in Chrome, Firefox, and Edge concurrently with retry', async function() {
        this.timeout(30000000); // Set timeout to 30 seconds for the whole suite

        await Promise.all([
            runTestInBrowserWithRetry('chrome', runLoginSuccessfulTest),
            runTestInBrowserWithRetry('firefox', runLoginSuccessfulTest),
            runTestInBrowserWithRetry('MicrosoftEdge', runLoginSuccessfulTest) // Ensure msedgedriver is installed and accessible in the system PATH or specify its path
        ]);
    });
});
