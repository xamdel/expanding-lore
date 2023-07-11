export interface Character {
  _id: string;
  name: string;
  sex: string;
  physical_description: string;
  backstory: string;
  personality_descriptors: string[];
  motivations: string[];
  reason_for_being_here: string;
  intended_duration_of_stay: string;
  friendliness: number;
}

export interface Narratives {
  _id: string;
  "story name": string;
  narrative_thread: string;
}

export interface Locations {
  name: string;
  description: string;
}

export interface Factions {
  name: string;
  description: string;
}

export interface Other {
  name: string;
  description: string;
}