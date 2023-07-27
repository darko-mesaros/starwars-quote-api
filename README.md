# Welcome to our Build On Weekly Project - Star Wars quote generator

*THIS IS A WORK IN PROGRESS, DO NOT EXPECT PERFECTION (just yet 😎)*

It started out as a joke, but it turned into a thing we seem to do. This simple API just returns a random Star Wars(tm) quote.

This application is deployed using [AWS CDK](https://aws.amazon.com/cdk/), and all you need to deploy and run it is in this repository.

## Getting started

Deploy the application by running the following commands:
```
npm install
npm run build
cdk deploy
```

Once the application is deployed, you can load the DynamoDB table with Star Wars quotes data by running the following command:
```
python3 populatetable.py
```

If you have the correct permissions to your AWS account, and have the [AWS CLI](https://aws.amazon.com/cli/) configured. This should push the data into the created DynamoDB Table.
