const Page = require('./Page');
const logger = require('./Log');
const { By, until } = require("selenium-webdriver");

class ResultsPage extends Page {

    constructor(driver){
        logger.debug("ResultsPage()");
        super();
        this.driver = driver;
    }

    setDriver(value){
        logger.debug("ResultsPage.setDriver(driver)");
        this.driver = value;
    }

    getDriver(){
        logger.debug("ResultsPage.getDriver()");
        return this.driver;
    }

    async getNumOfResults(){
        logger.debug("ResultsPage.getNumOfResults()");
        let numOfResults = await this.driver.findElement(By.xpath('//*[@id="resultStats"]'));
        let text = await numOfResults.getText();
        let result = '\n' + text.slice(0, text.indexOf('('));
        logger.debug("Result: "+ result);
        return result;
    }

    async getTimeOfSearching(){
        logger.debug("ResultsPage.getTimeOfSearching()");
        let numOfResults = await this.driver.findElement(By.xpath('//*[@id="resultStats"]'));
        let text = await numOfResults.getText();
        let result = text.slice(text.indexOf('('));
        logger.debug("Result: "+ result);
        return result;
    }

    async getBlock(){
        await logger.debug(`ResultsPage.getBlock()`);
        let results = await this.driver.findElements(By.xpath('//span[@class = "st"]'));
        logger.debug("Results: "+ results.toString());
        return results;
    }

    async goNextPage(){
        await logger.debug(`ResultsPage.goNextPage()`);
        await this.driver.wait(until.elementLocated(By.id('pnnext')));
        await this.driver.findElement(By.id('pnnext'))
            .then(element => element.click());
    }
}
module.exports = new ResultsPage();