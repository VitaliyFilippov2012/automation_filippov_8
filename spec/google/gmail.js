const fs = require('fs-extra');
const base64 = require('js-base64').Base64;
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
        logger.debug('gmail.js(getDeadLine)');
        //let pattern = /(Срок его выполнения)[\W\w]*[:][0-9]+/;
        //let match = body.match(pattern);
        //let deadLine = match[0];
        let findStr = "выполнения";
        let deadline = await body.slice(body.indexOf(findStr)+findStr.length+3, body.indexOf(findStr)+findStr.length+33);
        logger.info('DeadLine of task: '+deadLine);
        logger.debug('end of gmail.js(getDeadLine)');
        return deadline;
    }
    catch (e) {
        logger.warn("I can not handle the encoding and get the message text")
        return "";
    }
}

async function getBody(logger,messageData) {
    logger.debug('gmail.js(getBody)');
    let bodyData = await messageData.data.payload.parts[0].body.data;
    logger.debug('end of gmail.js(getBody)');
    return base64.decode(bodyData).replace(/[*]/g, '');
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