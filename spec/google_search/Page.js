module.exports = class Page {
    async open(driver,path){
       await driver.get(path);
    }
};
