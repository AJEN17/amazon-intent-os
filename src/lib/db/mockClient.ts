import { mockUserProfile, mockPurchaseHistory } from "./seedData";
import { ProductItem, UserProfile } from "../../types/inventory";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "IntentOS_Products";

export const fetchInventoryByCategory = async (category: string, macro_crisis?: string): Promise<ProductItem[]> => {
  const normalizedCategory = category ? category.toLowerCase().trim().replace(/ /g, '_') : "";
  const normalizedCrisis = macro_crisis ? macro_crisis.toUpperCase().trim() : "";
  
  // Create FilterExpression to push computation to AWS instead of Next.js server
  let filterExpr = "";
  const exprAttrValues: Record<string, any> = {};
  
  if (normalizedCrisis && normalizedCategory) {
    filterExpr = "macro_crisis = :crisis OR category = :cat";
    exprAttrValues[":crisis"] = normalizedCrisis;
    exprAttrValues[":cat"] = normalizedCategory;
  } else if (normalizedCrisis) {
    filterExpr = "macro_crisis = :crisis";
    exprAttrValues[":crisis"] = normalizedCrisis;
  } else if (normalizedCategory) {
    filterExpr = "category = :cat";
    exprAttrValues[":cat"] = normalizedCategory;
  }

  if (!filterExpr) return [];

  const { Items } = await docClient.send(new ScanCommand({ 
    TableName: TABLE_NAME,
    FilterExpression: filterExpr,
    ExpressionAttributeValues: exprAttrValues
  }));
  
  return (Items || []) as ProductItem[];
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockUserProfile), 50));
};

export const fetchUserHistory = async () => {
  console.log(`Fetching history...`);
  return new Promise((resolve) => setTimeout(() => resolve(mockPurchaseHistory), 50));
};

export const fetchFullInventory = async (): Promise<ProductItem[]> => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  return (Items || []) as ProductItem[];
};