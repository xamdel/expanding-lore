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

    // Ignore duplicate entities and ignored words
    const IGNORED_WORDS = new Set(["Elysia", "Verdant Vale", "Crosswind Hold", "Prancing Griffin"].map(word => word.trim()));
    const filteredEntities = result.filter((entity: Entity) => {
      return !IGNORED_WORDS.has(entity.word.trim());
    });

    return filteredEntities;
  } catch (error) {
    throw error;
  }
}