import { PaginatedResponse } from "../responseTypes";

export interface InviteKey {
  key: string;
  created: string;
}

export interface InviteKeyListResponseData
  extends PaginatedResponse<InviteKey> {}
