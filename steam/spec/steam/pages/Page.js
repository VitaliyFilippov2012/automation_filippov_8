module.exports = class Page {
    open(path,driver) {
        driver.get(path);
    }
};