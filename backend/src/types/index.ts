export interface CharacterBrief {
  name: string;
  brief_description: string;
  relationship_to_narrative: string;
  reason_for_being_in_Crosswind_Hold: string;
}

export interface Entity {
  entity_group: string;
  score: number;
  word: string;
  start: number;
  end: number;
}