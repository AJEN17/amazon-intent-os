import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "IntentOS_Products";

async function createTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table ${TABLE_NAME} already exists.`);
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Creating table ${TABLE_NAME}...`);
      await client.send(
        new CreateTableCommand({
          TableName: TABLE_NAME,
          KeySchema: [{ AttributeName: "asin", KeyType: "HASH" }],
          AttributeDefinitions: [{ AttributeName: "asin", AttributeType: "S" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );
      console.log(`Waiting for table ${TABLE_NAME} to become active...`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log(`Table ${TABLE_NAME} created successfully.`);
    } else {
      console.error("Error checking table status:", err);
      process.exit(1);
    }
  }
}

async function seedData() {
  const dataPath = path.resolve(process.cwd(), "master_inventory.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const items = JSON.parse(rawData);
  console.log(`Found ${items.length} items to insert.`);

  // DynamoDB BatchWriteItem limits to 25 items per request
  const chunks = [];
  for (let i = 0; i < items.length; i += 25) {
    chunks.push(items.slice(i, i + 25));
  }

  console.log(`Split into ${chunks.length} batches.`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map((item: any) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    try {
      await docClient.send(new BatchWriteCommand(params));
      console.log(`Successfully wrote batch ${i + 1} of ${chunks.length}`);
      // Sleep for 1500ms to avoid ProvisionedThroughputExceededException
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(`Error writing batch ${i + 1}:`, err);
    }
  }
  
  console.log("Seeding complete!");
}

async function run() {
  await createTable();
  await seedData();
}

run();
