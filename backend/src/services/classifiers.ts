import { Entity } from "../types";

// Run text through NER model to isolate locations, people, organizations
export async function extractEntities(narrative: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/Jean-Baptiste/roberta-large-ner-english",
    {
      headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
      method: "POST",
      body: JSON.stringify({ inputs: narrative }),
    }
  );
  const result: Entity[] = await response.json();

  const uniqueEntities = new Set();
  const filteredEntities = result.filter((entity: Entity) => {
    const duplicate = uniqueEntities.has(entity.word);
    uniqueEntities.add(entity.word);
    return !duplicate;
  });

  return filteredEntities;
}