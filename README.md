# Welcome to our Build On Weekly Project - Star Wars quote generator

Context

- This a joke
- This can be a vessel for different technologies
- This will vend the most amazing star wars quotes

Complication

Having a DEMO application that is easy to show, share, upgrade, modify, and add new and exciting technolgies to it.
- Requirements (Business, Technical)

How do we make it so

We create an amazing and funny Star Wars quotes app, but we have it built using the cloud, and infrastructe as code so its easy to modify.

--- 

Categories of Topics:
- Requirements
- Deploying it
- Demoing
- Breaking it down
- Troubleshooting

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
