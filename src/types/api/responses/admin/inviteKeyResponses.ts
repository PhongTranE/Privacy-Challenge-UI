import { PaginatedResponse } from "../responseTypes";

export interface InviteKey {
  key: string;
  created: string;
  isExpired: boolean;
}

export interface InviteKeyListResponseData
  extends PaginatedResponse<InviteKey> {}
