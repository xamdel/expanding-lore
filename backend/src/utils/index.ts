import { extractEntities } from "../services/classifiers";
import { generateDescriptions } from "../services/generators";
import { MongoClient } from 'mongodb';

// Generate wiki entries from narrative threads using classifier and generator functions
export async function extractAndDescribeEntities(narrative: string) {
  const entities = await extractEntities(narrative);
  const entityDescriptions: any = {};

  for (const entity of entities) {
    entityDescriptions[entity.word] = await generateDescriptions(
      entity.word,
      narrative
    );
  }

  return entityDescriptions;
}

// Add object to database
export async function addToDatabase(client: MongoClient, document: any, collectionName: string): Promise<void> {
  const db = client.db(); 
  
  const collection = db.collection(collectionName);
  await collection.insertOne(document);
}