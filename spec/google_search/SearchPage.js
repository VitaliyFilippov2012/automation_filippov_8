const Page = require('./Page');
const { By,Key } = require("selenium-webdriver");


class SearchPage extends Page {

    constructor(driver) {
        super();
        this.driver = driver;
    }

    setDriver(value){
        this.driver = value;
    }

    getDriver(){
        return this.driver;
    }

    async open(path) {
        await super.open(this.driver,path);
    }

    async writeSearch(request){
        let res = await this.driver.findElement(By.name('q'));
        await res.sendKeys(request);
        await res.sendKeys(Key.ENTER);
    }
}

module.exports = new SearchPage();