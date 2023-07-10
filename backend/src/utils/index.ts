import { MongoClient } from "mongodb";

// Add object to database
export async function saveToDB(
  client: MongoClient,
  document: any,
  collectionName: string
): Promise<void> {
  try {
    console.log("Saving to DB:", document, collectionName);

    const db = client.db();
    const collection = db.collection(collectionName);
    await collection.insertOne(document);
  } catch (err) {
    console.error("Error saving to DB:", err);
  }
}