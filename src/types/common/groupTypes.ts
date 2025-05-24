import { UserInterface } from "@/types/common/userTypes";

export interface GroupUser {
  id: number;
  name: string;
}

export interface GroupInterface {
  id: number;
  name: string;
  defenseScore: number;
  attackScore: number;
  totalScore: number;
  users?: UserInterface[];
} 