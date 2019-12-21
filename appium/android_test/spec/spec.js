const config = require('./support/config');
const logger = require('./support/logger').logger;
const Page = require('./support/page');
const assert = require('assert').strict;

describe('Android', function () {
  it('Headers', async () => {
    logger.info('Start describe');

    await Page.click(config.logo, 5);
    await Page.click(config.QA1Button);
    await Page.back();
    await Page.click(config.loginButton);
    await Page.setCreeds(config.name, 11);
    await Page.setCreeds(config.pass, 13);
    await Page.click(config.submit);
    const err = await Page.getError(config.error);
    expect(err).toContain(config.errors);
    logger.info('End describe');
  });

});
