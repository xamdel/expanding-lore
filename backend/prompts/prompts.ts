export const narrativePrompt = `Invent an outline for a narrative thread taking place in the vast fantasy world of Elysia. Don't reference the name of the world, but include specific such as the names of places and people, factions, history and lore. Include 1-2 characters related to the narrative thread (directly or tangentially) who the player may encounter in a tavern/inn called The Prancing Griffin, located in the bustling town of Crosswind Hold in the centrally located region Verdant Vale, and why they are there. Respond in JSON format:
{
  "narrative_thread": paragraph,
    "characters": [
      {
        "name": ,
        "brief description",
        "relationship_to_narrative": ,
        "reason_for_being_in_Crosswind_Hold": ,
      },
    ]
}`