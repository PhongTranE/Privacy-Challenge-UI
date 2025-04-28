export interface Role {
  name: string;
}

export interface UserInterface {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  roles: Role[];
  group_id: number;
  invite_key: string;
}
