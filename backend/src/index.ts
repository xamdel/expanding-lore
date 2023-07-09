import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { MongoClient } from "mongodb";
import cron from "node-cron";
import {
  generateDescriptions,
  generateNarrative,
  generateCharacterSheet,
} from "./services/generators";
import { extractEntities } from "./services/classifiers";
import { saveToDB } from "./utils";

const app = express();
const port = process.env.PORT || 8000;

// Set up MongoDB connection
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Set up cron job for intermittant generation
    cron.schedule("0 */4-8 * * *", async function () {
      console.log("Generating narrative");
      const narrative = await generateNarrative();
      await saveToDB(client, narrative, "narratives");

      console.log("Extracting named entities");
      const entities = await extractEntities(narrative.narrative_thread);

      console.log("Generating compendium entries");
      for (const entity of entities) {
        const description = await generateDescriptions(
          entity.word,
          narrative.narrative_thread
        );

        switch (entity.entity_group) {
          case "PER":
            await saveToDB(client, description, "people");
            break;
          case "LOC":
            await saveToDB(client, description, "locations");
            break;
          case "ORG":
            await saveToDB(client, description, "factions");
            break;
          case "MISC":
            await saveToDB(client, description, "other");
            break;
          default:
            console.log(`Unexpected entity group: ${entity.entity_group}`);
        }
      }

      console.log("Generating character sheets");
      for (const characterData of narrative.characters) {
        const characterSheet = await generateCharacterSheet(characterData);
        await saveToDB(client, characterSheet, "characters");
      }
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }

  try {
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start the server", err);
    process.exit(1);
  }
}

startServer();