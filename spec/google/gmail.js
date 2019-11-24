const fs = require('fs-extra');
const { google }= require('googleapis');
const TOKEN_PATH = 'token.json';
let messageCountWithAutomation = 0;

exports.authorize = function authorize(logger) {
    logger.debug('gmail.js(authorize)');
    let content = fs.readFileSync('credentials.json');
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    const gmail = google.gmail({ version: 'v1', oAuth2Client });
    logger.debug('end of gmail.js(authorize)');
    return oAuth2Client;
};

exports.getMessageCount = function getMessageCount(){
    return messageCountWithAutomation;
};

function getSubject(logger,messageData) {
    logger.debug('gmail.js(getSubject)');
    let messageSubject = undefined;
    for (let { name, value } of messageData.data.payload.headers) {
        if (name === 'Subject') {
            messageSubject = value;
            break;
        }
    }
    logger.info('Subject of message: '+messageSubject);
    logger.debug('end of gmail.js(getSubject)');
    return messageSubject;
}

async function getDeadLine(logger,body) {
    try{
        let pattern = /(\d+\s[А-Яа-я]+,\s\d+:\d+)/;
        let match = body.match(pattern);
        return match[0];
    }
    catch (e) {
        logger.warn("I can not handle the encoding and get the message text")
        return "";
    }
}

async function getBody(logger,messageData) {
    let messageFullBody = '';
    for (let { body } of messageData.data.payload.parts) {
        if (body.data != undefined) {
            let data = Buffer.from(body.data, 'base64');
            messageFullBody += data.toString();
        }
    }
    return messageFullBody;
}

async function getMessageData(id,auth){
    const gmail = await google.gmail({ version: 'v1', auth });
    return await gmail.users.messages.get({
        userId: 'me',
        id: id
    });
}


async function logMessageData(logger, messageId, auth) {
    logger.debug('Started log message');
    logger.debug('gmail.js(logMessageData)');

    let messageData = await getMessageData(messageId,auth)
    let messageSubject = getSubject(logger,messageData);

    if (messageSubject.includes('Automation')) {
        messageCountWithAutomation += 1 ;
        let messageFullBody = await  getBody(logger,messageData);
        let deadline = await getDeadLine(logger,messageFullBody);
        logger.info(`Задание: ${messageSubject}. ${deadline}\r\nТело письма:\r\n${messageFullBody}`);
    } else {
        logger.warn('Subject is inappropriate');
    }
    logger.debug('end of gmail.js(logMessageData)');
}

exports.analysisMessages = async function(logger, auth) {
    logger.debug('gmail.js(analysisMessages)');

    const gmail = google.gmail({ version: 'v1', auth });
    let messagesList = await gmail.users.messages.list({ userId: 'me' });
    let { id } = messagesList.data.messages;
    for (let { id } of messagesList.data.messages) {
        await logMessageData(logger, id, auth);
    }
    logger.debug('end of gmail.js(analysisMessages)');
    return messagesList.data.messages.length;
};


exports.getMessagesAmount = async function(logger, auth) {
    logger.debug('gmail.js(getMessagesAmount)');
    const gmail = google.gmail({ version: 'v1', auth });
    let messagesList = await gmail.users.messages.list({ userId: 'me' });
    logger.debug('end of gmail.js(getMessagesAmount)');
    return messagesList.data.messages.length;
};