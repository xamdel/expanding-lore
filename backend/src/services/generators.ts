import { characterSheetPrompt, narrativePrompt } from "../prompts/prompts";
import { CharacterBrief } from "../types";
import { generateCompletion } from "./callOpenai";

// Function to generate narrative threads
export async function generateNarrative() {
  const model = "gpt-4";
  const response = await generateCompletion(narrativePrompt, model);
  const cleanedResponse = response.replace(/\n/g, " ");
  const narrative = JSON.parse(cleanedResponse);

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

  characterSheet.brief_description = CharacterBrief.brief_description;
  CharacterBrief.backstory = characterSheet.backstory; 
  characterSheet.relationship_to_narrative =
    CharacterBrief.relationship_to_narrative;
  characterSheet.reason_for_being_in_Crosswind_Hold =
    CharacterBrief.reason_for_being_in_Crosswind_Hold;

  return characterSheet;
}

// Generate descriptions for named entities extracted from narrative text
// export async function generateDescription(
//   entity: string,
//   text: string,
//   wait_for_model = false
// ) {
//   try {
//     // Construct request body
//     const requestBody = {
//       inputs: `${text} Based on the previous paragraph, create a brief description for ${entity}. Do not include anything besides the description of ${entity}. ${entity} is`,
//       parameters: {
//         temperature: 0.5,
//         max_new_tokens: 150,
//         return_full_text: false,
//       },
//       options: {
//         wait_for_model: wait_for_model,
//       },
//     };

//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
//         },
//         method: "POST",
//         body: JSON.stringify(requestBody),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.error(`Failed to generate description: ${error}`);
//     throw error;
//   }
// }