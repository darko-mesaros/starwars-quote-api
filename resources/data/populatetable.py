# load data to an amazon dynamo db table from a text file locally where each row is a new entry
import boto3

# open the file
with open('starwarsquotes.txt', 'r') as file:
    # read the file
    data = file.read()
    # split the file into rows
    rows = data.split('\n')
    # create a dynamodb client
    dynamodb = boto3.client('dynamodb')
    # loop through each row
    for row in rows:
        # split the row into columns
        # create a dictionary of the columns
        item = {
            'id': {'S': str(hash(row))},
            'quote': {'S': row},
        }
        # insert the item into the table
        dynamodb.put_item(TableName='StarwarsquotesTable', Item=item)
        print(item)