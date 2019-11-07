require('chromedriver');
require('geckodriver');
require('jasmine');

const logger = require('./Log');
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

const AllureReporter = require('jasmine-allure-reporter');
jasmine.getEnv().addReporter(new AllureReporter({
    resultsDir: 'allure-results'
}));


beforeAll(async function (done) {
    logger.trace('beforeAll');
    await SearchPage.setDriver(driver);
    await SearchPage.open(Config.googleURL);
    await SearchPage.writeSearch(Config.searchString).then(() => {
        driver = SearchPage.getDriver();
        done();
    });
},20000);

afterAll(async function() {
    logger.trace('afterAll');
    ResultsPage.setDriver(driver);
    logger.trace(`Results: ${ await ResultsPage.getNumOfResults()}; Time: ${await ResultsPage.getTimeOfSearching()}ms`);
    await driver.quit();
});

describe('Google-search', function () {

    logger.info(`Google-search starts`);
    it('Text exists on the text first page', async function (done) {
        logger.info(`Text exists on the text first page starts`);
        await ResultsPage.setDriver(driver);
        let res = await ResultsPage.getBlock();
        for (let result of res) {
            let text = await result.getText();
            expect(text.toLowerCase()).toContain(Config.searchString.toLowerCase());
        }
        logger.info(`Text exists on the text first page finished`);
        done();
    },200000);

    it('Text exists on the text second page', async function (done) {
        logger.info(`Text exists on the text second page starts`);
        await  ResultsPage.setDriver(driver);
        await  ResultsPage.goNextPage();
        driver = ResultsPage.getDriver();
        await ResultsPage.setDriver(driver);
        let res = await ResultsPage.getBlock();
        for (let result of res) {
            let text = await result.getText();
            expect(text.toLowerCase()).toContain(Config.searchString.toLowerCase());
        }
        logger.info(`Text exists on the text second page finished`);
        done();
    },20000);

    it('Results count greater than x', async function (done) {
        logger.info(`Results count greater than x starts`);
        await ResultsPage.setDriver(driver);
        let numRes = await ResultsPage.getNumOfResults();
        expect(+numRes.replace(/\D+/g, "")).toBeGreaterThan(Config.expectedResults);
        logger.info(`Results count greater than x starts finished`);
        done();
    },20000);

    logger.info(`Google-search finished`);
});