import { MongoClient } from "mongodb";
import { saveToDB } from "../utils";
import {
  generateCharacterSheet,
  generateDescription,
  generateNarrative,
} from "./generators";
import { extractEntities } from "./classifiers";

// Call the generator and classifier functions sequentially, saving results to the database
export async function mainGeneratorPipeline(client: MongoClient) {
  console.log("Generating narrative...");
  const narrative = await generateNarrative();
  await saveToDB(client, narrative, "narratives");

  console.log("Generating character sheets...");
  for (const characterData of narrative.characters) {
    const characterSheet = await generateCharacterSheet(characterData);
    await saveToDB(client, characterSheet, "characters");
  }

  console.log("Extracting named entities");
  let entities;
  try {
    entities = await extractEntities(narrative.narrative_thread);
  } catch (error: any) {
    if (error.message.includes("503")) {
      console.log(
        "Inference endpoint busy. Retrying with wait_for_model=true..."
      );
      entities = await extractEntities(narrative.narrative_thread, true);
    } else {
      console.error(`Failed to extract entities: ${error}`);
    }
  }

  console.log({ entities });

  console.log("Generating compendium entries...");
  if (entities) {
    for (const entity of entities) {
      try {
        let description;
        try {
          description = await generateDescription(
            entity.word,
            narrative.narrative_thread
          );
        } catch (error: any) {
          if (error.response && error.response.status === 503) {
            console.log(
              "Inference endpoint busy. Retrying with wait_for_model=true..."
            );
            description = await generateDescription(
              entity.word,
              narrative.narrative_thread,
              true
            );
          } else {
            throw error;
          }
        }
        
        const entry = {
          name: entity.word,
          description: description[0].generated_text,
        };

        console.log(entry);

        switch (entity.entity_group) {
          case "PER":
            await saveToDB(client, entry, "people");
            break;
          case "LOC":
            await saveToDB(client, entry, "locations");
            break;
          case "ORG":
            await saveToDB(client, entry, "factions");
            break;
          case "MISC":
            await saveToDB(client, entry, "other");
            break;
          default:
            console.log(`Unexpected entity group: ${entity.entity_group}`);
        }
      } catch (error) {
        console.error(
          `Failed to process entity: ${entity.word}, error: ${error}`
        );
      }
    }
  } else {
    console.error("No entities found to generate compendium entries.");
  }
}