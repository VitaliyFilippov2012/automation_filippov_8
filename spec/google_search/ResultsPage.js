const Page = require('./Page');
const { By, until } = require("selenium-webdriver");

class ResultsPage extends Page {

    constructor(driver){
        super();
        this.driver = driver;
    }

    setDriver(value){
        this.driver = value;
    }

    getDriver(){
        return this.driver;
    }

    async getNumOfResults(){
        let numOfResults = await this.driver.findElement(By.xpath('//*[@id="resultStats"]'));
        let text = await numOfResults.getText();
        return '\n' + text.slice(0, text.indexOf('('));
    }

    async getTimeOfSearching(){
        let numOfResults = await this.driver.findElement(By.xpath('//*[@id="resultStats"]'));
        let text = await numOfResults.getText();
        return text.slice(text.indexOf('('));
    }

    async getBlock(){
        return await this.driver.findElements(By.xpath('//span[@class = "st"]'));
    }

    async goNextPage(){
        await this.driver.wait(until.elementLocated(By.id('pnnext')));
        await this.driver.findElement(By.id('pnnext'))
            .then(element => element.click());
    }
}
module.exports = new ResultsPage();