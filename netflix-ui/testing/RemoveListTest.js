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

const runRemoveFromListTest = async (browserName) => {
    let driver;
    try {
        driver = await new Builder().forBrowser(browserName).build();

        await driver.get('http://localhost:3000/login');
        await driver.sleep(2000);

        const emailInput = await driver.findElement(By.css('input[type="text"][placeholder="Email"]'));
        const passwordInput = await driver.findElement(By.css('input[type="password"][placeholder="Password"]'));
        await emailInput.sendKeys('sanju@gmail.com');
        await passwordInput.sendKeys('123456');

        const loginButton = await driver.findElement(By.id('LoginButt'));
        await loginButton.click();
        await driver.wait(until.urlIs('http://localhost:3000/home'), 50000);

        await driver.get('http://localhost:3000/mylist');
        await driver.sleep(2000);

        await driver.wait(until.elementLocated(By.css('.content')), 10000);

        const pageSource = await driver.getPageSource();
        console.log(pageSource);

        let cards = await driver.findElements(By.css('.grid img'));
        console.log(`Number of cards: ${cards.length}`);

        const actions = driver.actions({ async: true });
        await actions.move({ origin: cards[0] }).perform();
        await driver.sleep(2000);

        await driver.wait(until.elementLocated(By.id('remove')), 5000);
        await driver.sleep(2000);

        const removeButton = await driver.findElement(By.id('remove'));
        await removeButton.click();
        console.log("removed");
        await driver.sleep(2000);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
};

describe('Removing from List Tests', function() {
    this.timeout(30000); // Set timeout to 30 seconds for the whole suite

    it('should remove movies from list in Chrome, Firefox, and Edge concurrently with retry', async function() {
        await Promise.all([
            runTestInBrowserWithRetry('chrome', runRemoveFromListTest),
            runTestInBrowserWithRetry('firefox', runRemoveFromListTest),
            runTestInBrowserWithRetry('MicrosoftEdge', runRemoveFromListTest) // Ensure msedgedriver is installed and accessible in the system PATH or specify its path
        ]);
    });

    // Add more test cases as needed
});
