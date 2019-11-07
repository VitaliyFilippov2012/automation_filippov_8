const Page = require('./Page');
const logger = require('./Log');
const { By,Key } = require("selenium-webdriver");


class SearchPage extends Page {

    constructor(driver) {
        logger.debug("SearchPage()");
        super();
        this.driver = driver;
    }

    setDriver(value){
        logger.debug("SearchPage.setDriver(driver)");
        this.driver = value;
    }

    getDriver(){
        logger.debug("SearchPage.getDriver(driver)");
        return this.driver;
    }

    async open(path) {
        logger.debug("SearchPage.open(path): " + path);
        await super.open(this.driver,path);
    }

    async writeSearch(request){
        logger.debug("SearchPage.writeSearch(request): " + request);
        let res = await this.driver.findElement(By.name('q'));
        await res.sendKeys(request);
        await res.sendKeys(Key.ENTER);
    }
}

module.exports = new SearchPage();