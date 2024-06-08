const { Builder, By, until } = require('selenium-webdriver');
const assert = require('chai').assert;
require('chromedriver');

describe('Dowload Tests', function() {
    this.timeout(60000); // Increase timeout to 60 seconds for the whole suite

   
        let driver;
       
    it('should download the video', async function() {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
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
            await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
            await driver.sleep(2000); // Ensure the home page loads

            // Navigate to the player page
            await driver.get('http://localhost:3000/player');
            await driver.sleep(2000);

            

            // Wait for 2 seconds to observe the navigation
            await driver.sleep(2000);
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    });
});
