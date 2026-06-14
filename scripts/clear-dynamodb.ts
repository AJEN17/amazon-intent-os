import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
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

async function clearTable() {
  console.log(`Scanning table ${TABLE_NAME} for items to delete...`);
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  
  if (!Items || Items.length === 0) {
    console.log("Table is already empty.");
    return;
  }
  
  console.log(`Found ${Items.length} items. Deleting...`);
  
  const chunks = [];
  for (let i = 0; i < Items.length; i += 25) {
    chunks.push(Items.slice(i, i + 25));
  }
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map((item: any) => ({
          DeleteRequest: {
            Key: { asin: item.asin },
          },
        })),
      },
    };

    try {
      await docClient.send(new BatchWriteCommand(params));
      console.log(`Deleted batch ${i + 1} of ${chunks.length}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // sleep to avoid AWS throttling
    } catch (err) {
      console.error(`Error deleting batch ${i + 1}:`, err);
    }
  }
  console.log("Successfully cleared the table!");
}

clearTable();
