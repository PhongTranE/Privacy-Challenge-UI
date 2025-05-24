import { GroupUser } from "@/types/common/groupTypes";

export interface Role {
  name: string;
}

export interface UserInterface {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  roles: Role[];
  group: GroupUser;
  invite_key: string;
}
