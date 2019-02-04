const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const processResponse = require('./process-response.js');
const TABLE_NAME = process.env.TABLE_NAME;
const IS_CORS = process.env.IS_CORS;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const crypto = require('crypto');
const moment = require('moment');

exports.handler = (event, context, callback) => {
    
    if (event.httpMethod === 'OPTIONS') {
		return Promise.resolve(processResponse(event, IS_CORS));
	}
    
    switch (event.httpMethod) {
    case 'GET':
        let getItemParams = {
            TableName: TABLE_NAME,
            Key: {
                'mappingId': event.hash
            }
        };

        return dynamodb.get(getItemParams)
        .promise()
        .then((data) => (processResponse(event, IS_CORS, data.Item)))
        .catch(dbError => {
            let errorResponse = `Error: Execution select, caused a Dynamodb error, please look at your logs.`;
            console.log(dbError);
            return processResponse(event, IS_CORS, errorResponse, 500);
        });
    case 'POST':
        if (! event.body) {
            return Promise.resolve(processResponse(event, IS_CORS, 'invalid', 400));
        }

        let body = JSON.parse(event.body);

        if (! body.url) {
            return Promise.resolve(processResponse(event, IS_CORS, 'invalid', 400));
        }

        let item = {
            "urlId": crypto.randomBytes(8).toString('hex'),
            "url": body.url,
            "createdAt": moment().format("YYYY/MM/DD HH:mm:s")
        };
        
        let putItemParams = {
            TableName: TABLE_NAME,
            Item: item
        };

        return dynamodb.put(putItemParams)
        .promise()
        .then(() => (processResponse(event, IS_CORS, item)))
        .catch(dbError => {
            let errorResponse = `Error: Execution update or insert, caused a Dynamodb error, please look at your logs.`;
            if (dbError.code === 'ValidationException') {
                if (dbError.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
            }
            console.log(dbError);
            return processResponse(event, IS_CORS, errorResponse, 500);
        });
    default:
        return Promise.resolve(processResponse(event, IS_CORS, 'invalid', 400));
    }
};
