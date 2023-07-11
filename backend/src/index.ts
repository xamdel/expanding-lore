import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { MongoClient } from "mongodb";
import cron from "node-cron";
import { mainGeneratorPipeline } from "./services/mainGeneratorPipeline";

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

    // Generate story on server start
    await mainGeneratorPipeline(client);

    // Set up cron job for intermittent generation
    let counter = 0;
    cron.schedule("* * * * *", async function () {
      const randomNumber = Math.floor(Math.random() * 120) + 1;
      counter++;
      if (randomNumber === 1 || counter >= 240) {
        console.log('Running mainGeneratorPipeline...');
        await mainGeneratorPipeline(client);
        counter = 0;
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