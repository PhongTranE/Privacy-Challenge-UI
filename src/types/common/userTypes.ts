export interface Role {
  name: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface UserInterface {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  roles: Role[];
  group: Group;
  invite_key: string;
}
