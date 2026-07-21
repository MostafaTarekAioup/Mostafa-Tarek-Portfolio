export type GamePhase = "loading" | "menu" | "exploring";

export type CharacterPose =
  | "idle"
  | "portfolio"
  | "about"
  | "skills"
  | "findMe"
  | "contact"
  | "admin";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  pose: CharacterPose;
  description: string;
}

export type ProjectCategory = "all" | "web" | "mobile" | "fullstack" | "ai";

export interface FastTravelStation {
  id: string;
  name: string;
  platform: string;
  url: string;
  iconName: string;
  flavorText: string;
  status: "active" | "locked";
}

export interface QuestSubmission {
  questGiver: string;
  courierEmail: string;
  questScroll: string;
  questType: string;
}

export interface AchievementBadge {
  id: number;
  title: string;
  institution: string;
  period: string;
  description: string;
  tier: "legendary" | "epic" | "rare" | "common";
}
