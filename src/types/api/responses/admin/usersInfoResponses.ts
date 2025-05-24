import { UserInterface } from "@/types/common/userTypes";
import { PaginatedResponse } from "../responseTypes";


export interface UsersInfoResponseData
  extends PaginatedResponse<UserInterface> {}
