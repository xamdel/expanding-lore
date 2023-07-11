import { MongoClient } from "mongodb";
import { mergeAdjacentEntities, saveToDB } from "../utils";
import {
  generateCharacterSheet,
  generateDescription,
  generateNarrative,
} from "./generators";
import { extractEntities } from "./classifiers";
import { Entity } from "../types";

// Call the generator and classifier functions sequentially, saving results to the database
export async function mainGeneratorPipeline(client: MongoClient) {
  console.log("Generating narrative...");
  const narrative = await generateNarrative();
  await saveToDB(client, narrative, "narratives");

  console.log("Generating character sheets...");
  let characters = [];
  for (const characterData of narrative.characters) {
    const characterSheet = await generateCharacterSheet(characterData);
    characters.push(characterSheet);
    await saveToDB(client, characterSheet, "characters");
  }

  console.log("Extracting named entities");

  // Extract entities from narrative thread
  let narrativeEntities: Entity[] = [];
  try {
    narrativeEntities = await extractEntities(narrative.narrative_thread);
  } catch (error: any) {
    if (error.message.includes("503")) {
      console.log(
        "Inference endpoint busy. Retrying with wait_for_model=true..."
      );
      narrativeEntities = await extractEntities(
        narrative.narrative_thread,
        true
      );
    } else {
      console.error(`Failed to extract entities: ${error}`);
    }
  }
  narrativeEntities = mergeAdjacentEntities(narrativeEntities);

  // Extract entities from character backstories
  let characterEntities: Entity[] = [];
  for (const characterData of characters) {
    try {
      let entities = await extractEntities(characterData.backstory);
      entities = mergeAdjacentEntities(entities);
      const entitiesWithSource = entities.map((entity) => ({
        ...entity,
        source: characterData.backstory,
      }));

      // Filter out entities that match any word in the character's name
      const characterNameWords = new Set(characterData.name.split(" "));

      const filteredEntities = entitiesWithSource.filter((entity) => {
        const entityWords = entity.word.split(" ");

        for (const word of entityWords) {
          if (characterNameWords.has(word)) {
            return false;
          }
        }
        return true;
      });

      characterEntities = [...characterEntities, ...filteredEntities];
    } catch (error: any) {
      if (error.message.includes("503")) {
        console.log(
          "Inference endpoint busy. Retrying with wait_for_model=true..."
        );
        let entities = await extractEntities(characterData.backstory, true);
        entities = mergeAdjacentEntities(entities);
        const entitiesWithSource = entities.map((entity) => ({
          ...entity,
          source: characterData.backstory,
        }));
        characterEntities.push(...entitiesWithSource);
      } else {
        console.error(`Failed to extract entities: ${error}`);
      }
    }
  }

  const allEntities = [...narrativeEntities, ...characterEntities];

  console.log({ allEntities });

  console.log("Generating compendium entries...");

  const uniqueEntities = new Set();

  if (allEntities) {
    for (const entity of allEntities) {
      if (uniqueEntities.has(entity.word)) {
        continue;
      }
      uniqueEntities.add(entity.word);
      const context = entity.source || narrative.narrative_thread;

      try {
        let description;
        try {
          description = await generateDescription(entity.word, context);
        } catch (error: any) {
          if (error.response && error.response.status === 503) {
            console.log(
              "Inference endpoint busy. Retrying with wait_for_model=true..."
            );
            description = await generateDescription(entity.word, context, true);
          } else {
            throw error;
          }
        }

        const entry = {
          name: entity.word,
          description: description[0].generated_text,
        };

        switch (entity.entity_group) {
          case "PER":
            await saveToDB(client, entry, "characters");
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
