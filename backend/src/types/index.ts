import { ObjectId } from "mongodb";

export interface CharacterBrief {
  name: string;
  brief_description: string;
  relationship_to_narrative: string;
  reason_for_being_in_Crosswind_Hold: string;
}

export interface Entity {
  name: string;
  type: string;
  description: string;
}

export interface IdStorage {
  narratives: ObjectId[];
  characters: ObjectId[];
  locations: ObjectId[];
  factions: ObjectId[];
  other: ObjectId[];
}