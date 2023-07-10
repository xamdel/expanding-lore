import { characterSheetPrompt, narrativePrompt } from "../prompts/prompts";
import { CharacterBrief } from "../types";
import { generateCompletion } from "./callOpenai";

// Function to generate narrative threads
export async function generateNarrative() {
  const model = "gpt-4";
  console.log("generateNarrative function called. Calling OpenAI...");
  const response = await generateCompletion(narrativePrompt, model);
  const cleanedResponse = response.replace(/\n/g, ' ');
  console.log(cleanedResponse, typeof(cleanedResponse));
  const narrative = JSON.parse(cleanedResponse);
  console.log({ narrative });

  return narrative;
}

// Function for expanding character brief into full character sheet
export async function generateCharacterSheet(CharacterBrief: CharacterBrief) {
  const model = "gpt-3.5-turbo-0613";
  const userPrompt = JSON.stringify(CharacterBrief);
  const response = await generateCompletion(
    userPrompt,
    model,
    characterSheetPrompt
  );
  const characterSheet = JSON.parse(response);

  return characterSheet;
}

// Generate descriptions for named entities extracted from narrative text
export async function generateDescription(entity: string, text: string, wait_for_model = false) {
  // console.log({entity}, typeof(entity));
  // console.log({text}, typeof(text));
  try {
    // Construct request body
    const requestBody = {
      inputs: `${text} Based on the previous paragraph, create a brief description for ${entity}. Do not include anything besides the description of ${entity}. ${entity} is`,
      parameters: {
        temperature: 0.5,
        max_new_tokens: 150,
        return_full_text: false,
      },
      options: {
        wait_for_model: wait_for_model
      }
    };

    // console.log("Request Body: ", requestBody);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` 
        },
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // console.log(result);
    return result;
  } catch (error) {
    console.error(`Failed to generate description: ${error}`);
    throw error;
  }
}