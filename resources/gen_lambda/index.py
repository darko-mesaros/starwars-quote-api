import boto3
import json

def handler(event, context):

    bedrock = boto3.client("bedrock-runtime", region_name="us-west-2")

    prompt = """Generate me a made up quote from the films - Star Wars. Keep it to under 50 words. Just return the quote and nothing else.
    """.encode('unicode-escape').decode('utf-8')

    modelId= "anthropic.claude-v2"
    contentType= "application/json"
    accept= "*/*"

    body = json.dumps({
        "prompt": "Human: "+prompt+"\n Assistant:",
        "max_tokens_to_sample": 300,
        "temperature": 1,
        "top_k": 250,
        "top_p": 0.999,
        "stop_sequences": ["\n\nHuman:"],
        "anthropic_version":"bedrock-2023-05-31"
        })

    response = bedrock.invoke_model(accept=accept, body=body, contentType=contentType,modelId=modelId)
    response_body = json.loads(response.get("body").read())
    completion = response_body.get("completion")


    return {
        'statusCode': 200,
        'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            },
        'body': json.dumps({
            'message': completion
            })
    }
