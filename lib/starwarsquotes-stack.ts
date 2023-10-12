import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejslambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';
const path = require('path');

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

    // Generate lambda
    const generateLambda = new lambda.Function(this, 'generate-function',{
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'index.handler',
      timeout: Duration.seconds(60),
      code: lambda.Code.fromAsset(path.join(__dirname, '../resources/gen_lambda'),{
        bundling: {
          image: lambda.Runtime.PYTHON_3_10.bundlingImage,
          command: [
            'bash',
            '-c',
            'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output',
          ],
        }
      }),
    });

    const bedrockPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
      ],
      resources: ['*']
    })
    
    generateLambda.role?.attachInlinePolicy(
      new iam.Policy(this, 'invoke_model_bedrock',{
        statements: [bedrockPolicy],
      })
    );

    // API Gateway
    const api = new apigateway.RestApi(this, "Api",{
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS, // this is also the default
        allowHeaders: ['Content-Type', 'X-Amz-Date','Authorization','X-Api-Key','X-Amz-Security-Token']
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

    const genApi = quotes.addResource('generate')
    genApi.addMethod("POST", new apigateway.LambdaIntegration(generateLambda));
    
    new cdk.CfnOutput(this, "Endpoint", {
      value: api.url!,
      description: "The API endpoint",
    });

  }
}
