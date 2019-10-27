require('chromedriver');
require('geckodriver');
require('jasmine');
const Config = require('../../testData.js');
const SearchPage = require('./SearchPage.js');
const ResultsPage = require('./ResultsPage.js');
const { Builder } = require('selenium-webdriver');

jasmine.DEFAULT_TIMEOUT_INTERVAL = Config.jasmineInterval;

let browser = 'chrome';
if (process.argv.length > 2){
    browser = process.argv[2].slice(process.argv[2].indexOf('=')+1);
}

let driver = new Builder().forBrowser(browser).build();

beforeAll(async function (done) {
    await SearchPage.setDriver(driver);
    await SearchPage.open(Config.googleURL);
    await SearchPage.writeSearch(Config.searchString).then(() => {
        driver = SearchPage.getDriver();
        done();
    });
},20000);

afterAll(async function() {
    ResultsPage.setDriver(driver);
    console.log(await ResultsPage.getNumOfResults());
    console.log(await ResultsPage.getTimeOfSearching());
    await driver.quit();
});

describe('Google-search', function () {

    it('Text exists on the text first page', async function (done) {
        await ResultsPage.setDriver(driver);
        let res = await ResultsPage.getBlock();
        for (let result of res) {
            let text = await result.getText();
            expect(text.toLowerCase()).toContain(Config.searchString.toLowerCase());
        }
        done();
    },200000);

    it('Text exists on the text second page', async function (done) {
        await  ResultsPage.setDriver(driver);
        await  ResultsPage.goNextPage();
        driver = ResultsPage.getDriver();
        await ResultsPage.setDriver(driver);
        let res = await ResultsPage.getBlock();
        for (let result of res) {
            let text = await result.getText();
            expect(text.toLowerCase()).toContain(Config.searchString.toLowerCase());
        }
        done();
    },20000);

    it('Results count greater than x', async function (done) {
        await ResultsPage.setDriver(driver);
        let numRes = await ResultsPage.getNumOfResults();
        expect(+numRes.replace(/\D+/g, "")).toBeGreaterThan(Config.expectedResults);
        done();
    },20000);
});