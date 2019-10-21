require('chromedriver');
require('geckodriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const Config = require('../../testData.js');
let browser = 'chrome';

if (process.argv.length > 2) {
    browser = process.argv[2];
}

let driver = new Builder().forBrowser(browser).build();
let resultsCount = 0;
let dateStarted;

beforeAll(function (done) {
    driver.get('https://google.com').then(() => {
        driver.findElement(By.name('q')).then(tag => {
            tag.sendKeys(Config.searchString).then(() => {
                tag.sendKeys(Key.ENTER).then(() => {
                    done();
                });
            });
        });
    });
    dateStarted = new Date();
}, 15000);

afterAll(async function() {
    await driver.quit();
    console.log(`\nResults: ${resultsCount}`);
    console.log(`Time: ${new Date() - dateStarted}ms`);
}, 15000);

describe('Google-search', function () {
    it('Text exists on the first page', function (done) {
        driver.wait(async function () {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }).then(() => {
            driver.getPageSource().then(source => {
                expect(source.includes(Config.searchString)).toBe(true);
                done();
            });
        });
    }, 20000);

    it('Text exists in url of the first page', function(done) {
        driver.getCurrentUrl().then(url => {
            expect(url.includes(Config.searchString)).toBe(true);
            done();
        });
    }, 10000);

    it('Text exists on the second page', async function (done) {
        await driver.wait(until.elementLocated(By.id('pnnext')));
        await driver.findElement(By.id('pnnext'))
            .then(element => element.click());
        await driver.wait(async function () {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        });
        driver.getPageSource().then(source => {
            expect(source.includes(Config.searchString)).toBe(true);
            done();
        });
    }, 10000);
    
    it('Text exists in url of the second page', function(done) {
        driver.getCurrentUrl().then(url => {
            expect(url.includes(Config.searchString)).toBe(true);
            done();
        });
    }, 10000);

    it('Results count greater than x', async function(done) {
        let element = await driver.wait(until.elementLocated(By.id('resultStats')));
        let text = await element.getText();
        let regex = /((\d+\s*)+)/;
        let found = text.match(regex)[1];
        found = found.replace(' ', '');
        resultsCount = parseInt(found);
        expect(resultsCount).toBeGreaterThan(Config.expectedResults);
        done();
    }, 15000);

});
