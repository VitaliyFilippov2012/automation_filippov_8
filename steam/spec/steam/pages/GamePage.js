const Page = require('./Page');
const {By, until } = require('selenium-webdriver');
let driver;

class GamePage extends Page{

    setDriver(value) {
        driver = value;
    }

    getDriver() {
        return driver;
    }

    async getDiscount(){
        let discount = await driver.wait (
            until.elementLocated(By.xpath('//div[@class="game_purchase_action_bg"]//div[@class=\'discount_pct\']')),
            10000
        );
        return await discount.getText();
    }

    async getFinalPrice(){
        let price = await driver.findElement(By.xpath('(//div[@class=\'game_purchase_action_bg\']//div[@class=\'discount_final_price\'])[1]'));
        return await price.getText();
    }

    async getPrice(){
        let price = await driver.wait (
            until.elementLocated(By.xpath('(//*[@class=\'game_purchase_price price\'])[1]')),
            10000
        );
        return await price.getText();
    }


    async EnterAgeGate(year){
        await driver.wait(until.elementLocated(By.className('game_page_background')));

        let agegateExists = true;
        try {
            await driver.findElement(By.className('agegate_birthday_selector'));
        } catch (e) {
            agegateExists = false;
        }
        if (agegateExists) {
            await driver.executeScript(`document.getElementById("ageYear").value = "${year}";`);
            let viewPageBtn = await driver.findElement(By.className('btnv6_blue_hoverfade'));
            await viewPageBtn.click();
        }
    }
}

module.exports = new GamePage();