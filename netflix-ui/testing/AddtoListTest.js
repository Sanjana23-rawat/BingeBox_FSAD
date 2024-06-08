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

const runAddToListTest = async (browserName) => {
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
        await driver.wait(until.urlIs('http://localhost:3000/home'), 50000);

        // Wait for the content to load
        await driver.executeScript('window.scrollBy(0, 400);');

        // Locate the first card element using the image's src attribute
        const cardImageSrc = 'https://image.tmdb.org/t/p/w500/3TNSoa0UHGEzEz5ndXGjJVKo8RJ.jpg'; // Replace with the actual src value

        const hoverElement = await driver.wait(until.elementLocated(By.css('.hover')), 5000);

        // Find the image container within the hover element
        const imageContainer = await hoverElement.findElement(By.id('image_container'));
        const firstCardImage = await imageContainer.findElement(By.css('img'));

        // Get the src attribute of the first card image
        const srcAttribute = await firstCardImage.getAttribute('src');
        console.log("Src of the first card image:", srcAttribute);

        // Wait for the add to list button to become visible
        await driver.wait(until.elementLocated(By.id('add_to_list')), 5000000);

        // Find and click the "Add to my list" button
        const addToListButton = await driver.findElement(By.id('add_to_list'));
        await addToListButton.click();
        await driver.sleep(2000);

        await driver.get('http://localhost:3000/mylist');
        await driver.sleep(2000);

        // Verify that the movie was added to the list
        const addedMovie = await driver.findElement(By.css(`img[src="${cardImageSrc}"]`));
        assert.isTrue(await addedMovie.isDisplayed(), 'Movie should be added to the list');
    } finally {
        // Quit the driver after the test case is completed
        if (driver) {
            await driver.quit();
        }
    }
};

describe('Add to List Tests', function() {
    this.timeout(3000000); // Set timeout to 60 seconds for the whole suite

    it('should add movie to list in Chrome, Firefox, and Edge concurrently with retry', async function() {
        await Promise.all([
            runTestInBrowserWithRetry('chrome', runAddToListTest),
            runTestInBrowserWithRetry('firefox', runAddToListTest),
            runTestInBrowserWithRetry('MicrosoftEdge', runAddToListTest) // Ensure msedgedriver is installed and accessible in the system PATH or specify its path
        ]);
    });

    // Add more test cases as needed
});
