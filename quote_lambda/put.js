// PUT quote from a lambda event into an amazon dynamo db table
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
    let params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            // generate random UUID
            id: Math.floor((1 + Math.random()) * 0x10000).toString(16),
            quote: event.quote,
        }
    };
    try {
        let data = await docClient.put(params).promise();
        console.log(data);
    } catch (err) {
        
    }
    return {
        statusCode: 200,
        body: JSON.stringify('Quote added')
    };
}