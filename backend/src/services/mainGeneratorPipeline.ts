import { MongoClient } from "mongodb";
import { addReferences, filterEntities, saveToDB } from "../utils";
import { generateCharacterSheet, generateNarrative } from "./generators";
import { IdStorage } from "../types";

// Call the generator functions and save elements to database
export async function mainGeneratorPipeline(client: MongoClient) {
  // Create storage for database ObjectIDs
  const ids: IdStorage = {
    narratives: [],
    characters: [],
    locations: [],
    factions: [],
    other: []
  }

  console.log("Generating narrative...");
  const narrative = await generateNarrative();
  const narrativeId = await saveToDB(client, narrative, "narratives");
  ids.narratives.push(narrativeId);

  console.log("Generating character sheets...");
  for (const characterData of narrative.characters) {
    const characterSheet = await generateCharacterSheet(characterData);
    const characterId = await saveToDB(client, characterSheet, "characters");
    ids.characters.push(characterId);
  }

  console.log("Generating compendium entries...");
  const filteredEntities = filterEntities(narrative.entities, narrative.story_name)
  for (const entity of filteredEntities) {
    const entry = {
      name: entity.name,
      description: entity.description,
    };

    switch (entity.type) {
      case "person":
        const characterId = await saveToDB(client, entry, "characters");
        ids.characters.push(characterId);
        break;
      case "location":
        const locationId = await saveToDB(client, entry, "locations");
        ids.locations.push(locationId);
        break;
      case "faction":
        const factionId = await saveToDB(client, entry, "factions");
        ids.factions.push(factionId);
        break;
      case "other":
        const otherId = await saveToDB(client, entry, "other");
        ids.other.push(otherId);
        break;
      default:
        console.log(`Unexpected entity type: ${entity.type}`);
    }
  }

  console.log("Adding relational references...");
  const result = await addReferences(client, ids);
  console.log(result);
}