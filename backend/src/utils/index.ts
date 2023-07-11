import { MongoClient, ObjectId } from "mongodb";
import { Entity, IdStorage } from "../types";

// Add object to database, return new ObjectID
export async function saveToDB(
  client: MongoClient,
  document: any,
  collectionName: string
): Promise<ObjectId> {
  try {
    console.log("Saving to DB:", document, collectionName);

    const db = client.db();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);

    return result.insertedId;
  } catch (err) {
    console.error("Error saving to DB:", err);
    throw err;
  }
}

// Helper function to try to solve some of the problematic results returned by the NER model by combining entities which have no separating characters in the source text
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

// Try to remove duplicate sentences from generated descriptions
export function removeDuplicateSentences(text: string): string {
  const sentences = text.split(". ");

  const uniqueSentences = new Set(sentences);

  const newText = Array.from(uniqueSentences).join(". ");

  return newText;
}

// Add references for related objects in database
export async function addReferences(client: MongoClient, ids: IdStorage): Promise<string> {
  const db = client.db();
  
  try {
    // Add references to narratives
    for (const narrativeId of ids.narratives) {
      await db.collection('narratives').updateOne(
        { _id: narrativeId },
        { 
          $push: { 
            characters: { $each: ids.characters },
            locations: { $each: ids.locations },
            factions: { $each: ids.factions },
            other: { $each: ids.other }
          } 
        }
      );
    }

    // Add references to characters
    for (const characterId of ids.characters) {
      await db.collection('characters').updateOne(
        { _id: characterId },
        { 
          $push: { 
            narratives: { $each: ids.narratives },
            locations: { $each: ids.locations },
            factions: { $each: ids.factions },
            other: { $each: ids.other }
          } 
        }
      );
    }

    // Add references to locations
    for (const locationId of ids.locations) {
      await db.collection('locations').updateOne(
        { _id: locationId },
        { 
          $push: { 
            narratives: { $each: ids.narratives },
            characters: { $each: ids.characters },
            factions: { $each: ids.factions },
            other: { $each: ids.other }
          } 
        }
      );
    }

    // Add references to factions
    for (const factionId of ids.factions) {
      await db.collection('factions').updateOne(
        { _id: factionId },
        { 
          $push: { 
            narratives: { $each: ids.narratives },
            locations: { $each: ids.locations },
            characters: { $each: ids.characters },
            other: { $each: ids.other }
          } 
        }
      );
    }

    // Add references to others
    for (const otherId of ids.other) {
      await db.collection('other').updateOne(
        { _id: otherId },
        { 
          $push: { 
            narratives: { $each: ids.narratives },
            locations: { $each: ids.locations },
            characters: { $each: ids.characters },
            factions: { $each: ids.factions },
          } 
        }
      );
    }
    
    return "Reference updates completed successfully.";
  } catch (error) {
    console.error("Error updating references: ", error);
    return "An error occurred while updating references.";
  }
}