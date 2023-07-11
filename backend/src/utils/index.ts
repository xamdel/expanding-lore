import { MongoClient } from "mongodb";
import { Entity } from "../types";

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

// Helper function to try and solve some of the problematic results returned by the NER model by combining entities which have no separating characters in the source text
export function mergeAdjacentEntities(entities: Entity[]): Entity[] {
  const mergedEntities: Entity[] = [];
  for (let i = 0; i < entities.length; i++) {
      if (i > 0 && entities[i].start === entities[i - 1].end) {
          const mergedEntity = {
              ...entities[i - 1],
              word: entities[i - 1].word + entities[i].word,
              end: entities[i].end,
          };
          if (mergedEntity.entity_group === 'MISC') {
              mergedEntity.entity_group = entities[i].entity_group;
          } else if (entities[i].entity_group !== 'MISC') {
              mergedEntity.entity_group = entities[i].entity_group;
          }
          mergedEntities[mergedEntities.length - 1] = mergedEntity;
      } else {
          mergedEntities.push(entities[i]);
      }
  }
  return mergedEntities;
}