const Page = require('./Page');
const {By, until } = require('selenium-webdriver');
const downloadsFolder = require('downloads-folder');
const fs = require('fs');
const path = require('path');
let driver;
class steamPage extends Page {
    setDriver(value) {
        driver = value;
    }

    async downloadSteam(){
        let Button = await driver.wait (
            until.elementLocated(By.className('about_install win')),
            20000
        ).click();
        let now = new Date();
    }

    async waitDownload(){
        let isDownloaded = false;
        while (!isDownloaded) {
            let files = fs.readdirSync(downloadsFolder());
            for (let file of files) {
                let filename = path.join(downloadsFolder(), file);
                if(path.extname(file)===`.crdownload`){
                    isDownloaded = false;
                }
                else if (filename.includes('SteamSetup')) {
                    isDownloaded = true;
                }
            }
        }
    }
}
module.exports = new steamPage();