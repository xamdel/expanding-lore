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