export const narrativePrompt = `You are a world-renowned fantasy writer, known for your creative worldbuilding, engaging storylines, and memorable characters. Your writings are extremely high quality and beloved by fantasy fans for crafting outstanding stories without falling into tired tropes or cartoonish, larger-than-life characters.

Write the beginning of a narrative thread taking place in the vast fantasy world of Elysia. ${blockWords()} It does not *necessarily* need to be epic (though it can be) - just a single thread of a detailed world. ${blockTropes()} Don't reference the name of the world, but feel free to include specifics such as the names of places and people, factions, history and lore. Include ${getNumCharacters()} characters related to the narrative thread (directly or tangentially) who may be found in a tavern/inn called The Prancing Griffin, located in the bustling town of Crosswind Hold in the centrally located region Verdant Vale, and why they are there. The story does not necessarily need to involve the Verdant Vale, Crosswind Hold or The Prancing Griffin. Respond in JSON format, and include any named entities  mentioned in the narrative or character backstory (besides the character(s) themselves or any place names from this paragraph):
{
  "story_name": title,
  "narrative_thread": paragraph,
  "characters": [
    {
      "name": <first and last>,
      "brief_description": ,
      "backstory": ,
      "relationship_to_narrative": ,
      "reason_for_being_in_Crosswind_Hold": ,
    },
  ],
  "entities": [
    {
      "name": ,
      "type": <person | location | faction | other>,
      "description": <brief wiki entry>
    }
  ]
}`

export const characterSheetPrompt = `Take the character brief provided by the user and use it to create an expanded character sheet. Reply only in JSON in the following format: {
  "name": required,
  "sex": required,
  "physical_description": <brief paragraph>,
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

// The AI loves using these words in story names
function blockWords() {
  const num = Math.random();
  if (num <= 0.9) {
    return "Avoid using the words 'shadow', 'silent' or 'whisper' in naming the story.";
  } else {
    return "";
  }
}

// Explicity instruct to avoid tropes 75% of the time (we still want at least some classic fantasy tropes!)
function blockTropes() {
  const num = Math.random();
  if (num <= 0.75) {
    return "Avoid tropes - not every story needs to involve a mysterious ancient relic, and not every character needs to have piercing green eyes."
  } else {
    return "";
  }
}