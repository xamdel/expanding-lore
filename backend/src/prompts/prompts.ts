export const narrativePrompt = `Invent an outline for a narrative thread taking place in the vast fantasy world of Elysia. Don't reference the name of the world, but include specific such as the names of places and people, factions, history and lore. Include 1-2 characters related to the narrative thread (directly or tangentially) who the player may encounter in a tavern/inn called The Prancing Griffin, located in the bustling town of Crosswind Hold in the centrally located region Verdant Vale, and why they are there. Respond in JSON format:
{
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