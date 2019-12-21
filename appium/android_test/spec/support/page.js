const config = require('./config');
const logger =  require('./logger').logger;

class Page {

    async click(selector, count) {
        let element = await $(selector);
        if (count === undefined) {
            count = 1;
        }
        logger.trace(`Click: ${selector} ${count} times`);
        for (let i = 0; i < count; i++)
            await element.click();

    }

    async back() {
        logger.trace('Back page');
        driver.back();
    }

    async setCreeds(selector, length) {
        logger.trace(`Random creeds ${selector}`);
        let creed = await $(`android=new UiSelector().resourceId("${selector}")`);
        await creed.setValue(this.getRandomStrByLength(length));
    }

    async getError(selector) {
        logger.trace('Error');
        let err = await $(selector);
        return await err.getText();
    }

    getRandomStrByLength(length) {
        var string = '';
        while (string.length < length)
            string += Math.random().toString(36).substring(2);
        return string.substring(0, length);
    }

}

module.exports = new Page();
