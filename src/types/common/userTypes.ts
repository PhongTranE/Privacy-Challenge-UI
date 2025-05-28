import { GroupInterface } from "@/types/common/groupTypes";

export interface Role {
  name: string;
}

export interface UserInterface {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  roles: Role[];
  group: GroupInterface;
  invite_key: string;
}
