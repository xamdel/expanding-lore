import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.PORT || 8000;

// Set up MongoDB connection
if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected successfully to MongoDB");
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