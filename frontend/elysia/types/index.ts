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