require('jasmine');

const gmailApi = require('./gmail.js');
const logger = require('./Log');

let auth;
let messagesAmount = 0;

beforeAll(async function () {
    logger.debug('Authorization');
    auth = gmailApi.authorize(logger);
    logger.debug('end of authorization');

    logger.debug('Get messages amount');
    messagesAmount = await gmailApi.getMessagesAmount(logger, auth);
    logger.debug('end of it "Get messages amount"');
    logger.info('Message count: '+messagesAmount);
    },20000);

describe('GmailApi', function() {
    beforeAll(async function() {
        logger.debug('Messages Analysis');
        await gmailApi.analysisMessages(logger,auth);
        logger.debug('end of it "Messages Analysis"');
    },200000);

    it('The total number of messages equals 2', function() {
        logger.debug('The total number of messages equals 2');
        expect(messagesAmount).toBe(2);
        logger.debug('end of it "The total number of messages equals 2"');
    },200000);

    it('The number of messages with subject "Automation" equals 2', async function() {
        logger.debug('The  number of messages with subject "Automation" equals 2');
        let countMessages = await gmailApi.getMessageCount();
        expect(countMessages).toBe(2);
        logger.debug('end of it "The number of messages with subject "Automation" equals 2"');
    },200000);
},20000);