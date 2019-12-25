const Page = require('./Page');
const { By, until } = require('selenium-webdriver');
let driver;

class SteamMenuPage extends Page {

    setDriver(value){
        driver = value;
    }

    getDriver(){
        return driver;
    }

    open(path) {
        super.open(path, driver);
    }

    async goMenuItem(genreName){
        const genresDivId = 'genre_flyout';

        await driver.wait(until.elementLocated(By.id(genresDivId)));
        let genresDiv = await driver.findElement(By.id(genresDivId));
        let elements = await genresDiv.findElements(By.className('popup_menu_item'));

        for (let element of elements) {
            const elementName = (await element.getAttribute('innerText')).trim();
            const elementHref = await element.getAttribute('href');
            if (genreName === elementName) {
                await driver.get(elementHref);
                return true;
            }
        }
        return false;
    }

    async goSteamInstall(){
        let Button = await driver.wait(
            until.elementLocated(By.className('header_installsteam_btn')),
            20000
        );
        Button.click();
    }
}
module.exports = new SteamMenuPage();