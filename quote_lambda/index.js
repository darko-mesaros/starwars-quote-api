// Retrieve a random item from a dynamodb table and return it to the API gateway
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME,
    };
    const data = await ddb.scan(params).promise();
    const item = data.Items[Math.floor(Math.random() * data.Items.length)];
    const response = {
        statusCode: 200,
        headers: {
                "Content-Type" : "application/json",
                "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods" : "OPTIONS,POST",
                "Access-Control-Allow-Credentials" : true,
                "Access-Control-Allow-Origin" : "*",
                "X-Requested-With" : "*"
            },
        body: JSON.stringify({quote:item.quote}),
    };
    return response;
}
