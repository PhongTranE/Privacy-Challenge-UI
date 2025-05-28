import { UserInterface } from "@/types/common/userTypes";

export interface GroupBase {
  id: number;
  name: string;
  isBanned: boolean;
  memberCount: number;
}

export interface GroupInterface extends GroupBase {
  defenseScore: number;
  attackScore: number;
  totalScore: number;
  users?: UserInterface[];
}

export interface GroupMember {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
}

export interface GroupFile {
  id: number;
  name: string;
  fileType: 'anonymous' | 'attack';
  createdAt: string | null;
  score: number;
  isPublished: boolean;
  filePath: string;
}

export interface GroupStatistics {
  totalAnonymousFiles: number;
  publishedAnonymousFiles: number;
  totalAttackFiles: number;
  defenseScore: number;
  attackScore: number;
  totalScore: number;
}

export interface GroupDetail {
  group: GroupBase;
  members: GroupMember[];
  statistics: GroupStatistics;
  recentFiles: GroupFile[];
}