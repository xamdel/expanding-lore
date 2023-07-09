import { characterSheetPrompt, narrativePrompt } from "../prompts/prompts";
import { CharacterBrief } from "../types";
import { generateCompletion } from "./callOpenai";

// Function to generate narrative threads
export async function generateNarrative() {
  const model = "gpt-4";
  const narrative = await generateCompletion(narrativePrompt, model);

  return narrative;
}

// Function for expanding character brief into full character sheet
export async function createCharacterSheet(CharacterBrief: CharacterBrief) {
  const model = "gpt-4";
  const userPrompt = JSON.stringify(CharacterBrief);
  const characterSheet = await generateCompletion(
    userPrompt,
    model,
    characterSheetPrompt
  );

  return characterSheet;
}

// Generate descriptions for named entities extracted from narrative text
export async function generateDescriptions(entity: string, text: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
    {
      headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
      method: "POST",
      body: JSON.stringify({
        inputs: `Create a description for ${entity} based on this paragraph: "${text}"`,
        parameters: {
            temperature: 0,
            max_new_tokens: 20,
            return_full_text: false
        }
      }),
    }
  );
  const result = await response.json();
  
  return result.generated_text;
}