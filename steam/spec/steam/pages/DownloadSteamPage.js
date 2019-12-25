const Page = require('./Page');
const {By, until } = require('selenium-webdriver');
const config = require('../support/config');
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
            let files = fs.readdirSync(config.download_path);
            for (let file of files) {
                let filename = path.join(config.download_path, file);
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