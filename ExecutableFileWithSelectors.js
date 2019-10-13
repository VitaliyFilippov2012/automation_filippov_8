const { Builder, By } = require("selenium-webdriver");

async function getPageDriver(page) {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.get(page);
    return driver;
}

getPageDriver("https://www.onliner.by/").then(async function (driver) {
    let elementsById = await driver.findElements(By.id("userbar"))
    console.log("Count elements by id: " + elementsById.length);
    return driver;
}).then(async function (driver) {
    let elementsByName = await driver.findElements(By.name("query"));
    console.log("Count elements by name: " + elementsByName.length);
    return driver;
}).then(async function (driver) {
    let elementsByClass = await driver.findElements(By.className("b-top-navigation-age"));
    console.log("Count elements by class: " + elementsByClass.length);
    return driver;
}).then(async function (driver) {
    let elementsByTag = await driver.findElements(By.tagName("body > div > div > div > div >header > div > div > a"));
    console.log("Count elements by tag: " + elementsByTag.length);
    return driver;
}).then(async function (driver) {
    let elementsByCSSSelector = await driver.findElements(By.css("input.fast-search__input"));
    console.log("Count elements by css selector : " + elementsByCSSSelector.length);
    return driver;
}).then(async function (driver) {
    let elementsByLinkText = await driver.findElements(By.linkText("Манифест"));
    console.log("Count elements by link text: " + elementsByLinkText.length);
    return driver;
}).then(async function (driver) {
    let elementsByPartialLinkText = await driver.findElements(By.partialLinkText("Публичные"));
    console.log("Count elements by partial link text: " + elementsByPartialLinkText.length);
    return driver;
});
