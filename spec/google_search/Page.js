const logger = require('./Log');

module.exports = class Page {
    async open(driver,path){
        logger.debug("Page.open(path): " + path);
        await driver.get(path);
    }
};
