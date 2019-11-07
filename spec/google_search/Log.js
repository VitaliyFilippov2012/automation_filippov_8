const LG = require('log4js');
const fs = require('fs-extra');
if (!fs.exists("./logs")){
    fs.mkdir("./logs");
}
fs.emptyDir('./allure-results');
LG.configure({
    appenders: {
        file: {type: 'file', filename: 'logs/log.txt', pattern: 'yyyy-MM-dd-hh', compress: true},
        stdout: {type: 'stdout'}
    },
    categories: {
        default: { appenders: ['file', 'stdout'], level: 'debug'},
        trc: {appenders: ['file'], level: 'trace'}
    }
});

let loggerDef = LG.getLogger('file');
let loggerTrace = LG.getLogger('trc');

module.exports = {
    trace: str => loggerTrace.trace(str),
    debug: str => loggerDef.debug(str),
    info: str => loggerDef.info(str),
    warn: str => loggerDef.warn(str),
    error: str => loggerDef.error(str),
    fatal: str => loggerDef.fatal(str)
};

