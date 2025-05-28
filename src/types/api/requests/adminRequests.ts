export interface AdminChangeUserPasswordRequest {
  new_password: string;
}

export interface AdminEditGroupRequest {
  is_banned: boolean;
  name: string;
}

export interface UpdateGroupNameRequest {
  name: string;
}