const { Builder, By, until } = require('selenium-webdriver');
const assert = require('chai').assert;
require('chromedriver');
//require('geckodriver');
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
 
const runPlayerPageTest = async (browserName) => {
    let driver;
    try {
        driver = await new Builder().forBrowser(browserName).build();
 
        // Test: should display the video element
        await driver.get('http://localhost:3000/player');
        const videoElement = await driver.wait(until.elementLocated(By.tagName('video')), 10000);
        assert.isTrue(await videoElement.isDisplayed());
        await driver.sleep(2000);
 
        // Test: should display the back button and navigate back to the previous page
        await driver.get('http://localhost:3000/login');
        await driver.sleep(2000);
 
        const emailInput = await driver.findElement(By.css('input[type="text"][placeholder="Email"]'));
        const passwordInput = await driver.findElement(By.css('input[type="password"][placeholder="Password"]'));
        await emailInput.sendKeys('sanju@gmail.com');
        await passwordInput.sendKeys('123456');
 
        const loginButton = await driver.findElement(By.id('LoginButt'));
        await loginButton.click();
        await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
        await driver.sleep(2000);
 
        await driver.get('http://localhost:3000/player');
        await driver.sleep(2000);
 
        const backButton = await driver.wait(until.elementLocated(By.id('back_arrow')), 10000);
        assert.isTrue(await backButton.isDisplayed());
 
        await driver.wait(until.elementIsVisible(backButton), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", backButton);
 
        try {
            await backButton.click();
        } catch (error) {
            console.error('Error clicking back button:', error);
        }
 
        await driver.sleep(2000);
        await driver.wait(until.urlIs('http://localhost:3000/home'), 20000);
        await driver.sleep(2000);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
};
 
describe('Player Page Tests', function() {
    this.timeout(3000000); // Increase timeout to 60 seconds for the whole suite
 
    it('should pass player page tests in Chrome, Firefox, and Edge concurrently with retry', async function() {
        await Promise.all([
            runTestInBrowserWithRetry('chrome', runPlayerPageTest),
            runTestInBrowserWithRetry('firefox', runPlayerPageTest),
            runTestInBrowserWithRetry('MicrosoftEdge', runPlayerPageTest) // Ensure msedgedriver is installed and accessible in the system PATH or specify its path
        ]);
    });
 
    // Add more test cases as needed
});
 
