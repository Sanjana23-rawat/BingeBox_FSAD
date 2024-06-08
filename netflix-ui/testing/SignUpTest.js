const { Builder, By, until } = require('selenium-webdriver');
const assert = require('chai').assert;
require('chromedriver');
require('geckodriver');
// require('msedgedriver'); 
const crypto = require('crypto');

// Function to generate a random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}

// Function to generate a random email
function generateRandomEmail() {
    const randomString = generateRandomString(10);
    return `${randomString}@example.com`;
}

// Function to generate a random password
function generateRandomPassword() {
    return generateRandomString(12);
}

const runTestInBrowserWithRetry = async (browserName, retryCount = 3) => {
    let attempts = 0;
    while (attempts < retryCount) {
        try {
            await runTestInBrowser(browserName);
            return; // Test passed, no need to retry
        } catch (error) {
            console.error(`Error occurred in ${browserName}:`, error);
            attempts++;
        }
    }
    throw new Error(`Failed to run test in ${browserName} after ${retryCount} attempts`);
};

const runTestInBrowser = async (browserName) => {
    let driver;
    try {
        driver = await new Builder().forBrowser(browserName).build();

        await driver.get('http://localhost:3000/');

        // Wait for the page to load
        await driver.sleep(2000);
        const emailInput = await driver.findElement(By.css('input[name="email"]'));
        const randomEmail = generateRandomEmail();
        await emailInput.sendKeys(randomEmail);
        await driver.sleep(2000);

        // Click the "Get Started" button
        const getStartedButton = await driver.findElement(By.id('getStart_butt'));
        await getStartedButton.click();
        await driver.sleep(2000);

        // Wait for the password input field to be displayed
        const passwordInput = await driver.findElement(By.css('input[name="password"]'));
        assert.isTrue(await passwordInput.isDisplayed());
        const randomPassword = generateRandomPassword();
        await passwordInput.sendKeys(randomPassword);
        await driver.sleep(2000);

        // Click the "Sign In" button
        const signInButton = await driver.findElement(By.id('signIn_Butt'));
        await signInButton.click();
        console.log('Sign In button pressed successfully');

        // Wait for navigation to the home page
        await driver.wait(until.urlIs('http://localhost:3000/home'), 10000); // Wait for 10 seconds

        console.log('Successfully navigated to the home page');
    } finally {
        // Quit the driver after the test case is completed
        if (driver) {
            await driver.quit();
        }
    }
};

describe('Signup Page Tests', function() {
    
   
        this.timeout(30000000); // Set timeout to 10 seconds for the whole suite

        it('should navigate to the home page after successful sign-up in Chrome, Firefox, and Edge concurrently with retry', async function() {
            await Promise.all([
                runTestInBrowserWithRetry('chrome'),
                runTestInBrowserWithRetry('firefox'),
                runTestInBrowserWithRetry('MicrosoftEdge') // Ensure msedgedriver is installed and accessible in the system PATH or specify its path
            ]);
        });
   
    
    

    // Add more test cases as needed
});
