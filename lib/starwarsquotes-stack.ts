import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejslambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as amplify from '@aws-cdk/aws-amplify-alpha'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StarwarsquotesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    //dynamo db table
    const table = new dynamodb.Table(this, 'StarwarsquotesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'StarwarsquotesTable'
    });

    const quoteLambda = new nodejslambda.NodejsFunction(this, "QuoteLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      environment:  {
        'TABLE_NAME': table.tableName
        },
      handler: "index.handler",
      entry: "quote_lambda/index.js",
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      }
    });

    table.grantReadData(quoteLambda);

    //put lambda
    const putLambda = new nodejslambda.NodejsFunction(this, "PutLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      environment:  {
        'TABLE_NAME': table.tableName
        },
        handler: "index.handler",
        entry: "quote_lambda/put.js",
        bundling: {
          externalModules: [
            'aws-sdk'
          ]
        }
    });

    table.grantWriteData(putLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, "Api",{
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS // this is also the default
      }
    });

    // Amplify Hosting
    const amplifyApp = new amplify.App(this, 'Hosting', {
      appName: 'starwars-frontend',
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'darko-mesaros',
        repository: 'starwars-quote-api',
        oauthToken: cdk.SecretValue.secretsManager('github-token')
      }),
      
      buildSpec: cdk.aws_codebuild.BuildSpec.fromObjectToYaml({
        "version": 0.1,
        "frontend": {
          "phases": {
            "preBuild": {
              "commands": [
                "cd swquotes_fe",
                "npm ci"
              ]
            },
            "build": {
              "commands": [
                "npm run build"
              ]
            }
          },
          "artifacts": {
            "baseDirectory": "swquotes_fe/build",
            "files": [
              "**/*"
            ]
          },
          "cache": {
            "paths": [
              "swquotes_fe/node_modules/**/*"
            ]
          }
        }
      })
      
    })

    amplifyApp.addBranch('mainbranch', {
      stage: 'PRODUCTION',
      branchName: 'main'
    })

    const quotes = api.root.addResource('quotes')

    quotes.addMethod("GET", new apigateway.LambdaIntegration(quoteLambda));
    quotes.addMethod("POST", new apigateway.LambdaIntegration(putLambda));
    
    new cdk.CfnOutput(this, "Endpoint", {
      value: api.url!,
      description: "The API endpoint",
    });

  }
}
