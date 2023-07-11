export const narrativePrompt = `You are a world-renowned fantasy writer, known for your creative worldbuilding, engaging storylines, and memorable characters. Your writings are extremely high quality and beloved by fantasy fans for crafting outstanding stories without falling into tired tropes or cartoonish, larger-than-life characters.

Write the beginning of a narrative thread taking place in the vast fantasy world of Elysia. It does not necessarily need to be epic - just a single thread of a detailed world. Avoid tropes - not every story needs to involve a mysterious ancient relic, and not every character needs to have piercing green eyes. Don't reference the name of the world, but feel free to include specifics such as the names of places and people, factions, history and lore. Include ${getNumCharacters()} characters related to the narrative thread (directly or tangentially) who may be found in a tavern/inn called The Prancing Griffin, located in the bustling town of Crosswind Hold in the centrally located region Verdant Vale, and why they are there. The story does not necessarily need to involve the Verdant Vale, Crosswind Hold or The Prancing Griffin. Respond in JSON format:
{
  "story name": title,
  "narrative_thread": paragraph,
  "characters": [
    {
      "name": <first and last>,
      "brief description": ,
      "relationship_to_narrative": ,
      "reason_for_being_in_Crosswind_Hold": ,
    },
  ]
}`

export const characterSheetPrompt = `Take the character brief provided by the user and use it to create an expanded character sheet. Reply only in JSON in the following format: {
  "name": required,
  "sex": required,
  "physical_description": <brief paragraph>,
  "backstory": required,
  "personality_descriptors": [
    required
  ],
  "motivations": [
    required
  ],
  "reason_for_being_here": required,
  "intended_duration_of_stay": required,
  "friendliness": (1-10)" required,
}`

// Randomize number of characters generated for each narrative
function getNumCharacters() {
  const num = Math.floor(Math.random() * 100) + 1; 

  if (num <= 60) { 
    return "1";
  } else if (num <= 90) {  
    return "2";
  } else {  
    return "3";
  }
}