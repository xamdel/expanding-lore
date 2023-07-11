import { Entity } from "../types";

// Run text through NER model to isolate locations, people, organizations
export async function extractEntities(
  narrative: string,
  wait_for_model = false
) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Jean-Baptiste/roberta-large-ner-english",
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
        method: "POST",
        body: JSON.stringify({
          inputs: narrative,
          options: {
            wait_for_model: wait_for_model,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Entity[] = await response.json();

    // Ignore duplicate entities, filtered words
    const IGNORED_WORDS = ["Elysia", "Verdant Vale", "Crosswind Hold", "The Prancing Griffin"];

    const uniqueEntities = new Set();
    const filteredEntities = result.filter((entity: Entity) => {
      const duplicate = uniqueEntities.has(entity.word);
      const ignored = IGNORED_WORDS.includes(entity.word);
      uniqueEntities.add(entity.word);
      return !duplicate && !ignored;
    });

    return filteredEntities;
  } catch (error) {
    throw error;
  }
}