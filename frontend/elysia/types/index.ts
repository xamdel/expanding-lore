import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

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
  description?: string;
}

export interface Narratives {
  _id: string;
  story_name: string;
  narrative_thread: string;
}

export interface Locations {
  _id: string;
  name: string;
  description: string;
}

export interface Factions {
  _id: string;
  name: string;
  description: string;
}

export interface Other {
  _id: string;
  name: string;
  description: string;
}