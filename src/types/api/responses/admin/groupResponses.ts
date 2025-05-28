import { PaginatedResponse } from "@/types/api/responses/responseTypes";
import { GroupInterface, GroupDetail, GroupFile } from "@/types/common/groupTypes";

export interface GroupListResponseData extends PaginatedResponse<GroupInterface> {}

export interface GroupDetailFullResponseData extends GroupDetail {}

export type GroupFilesResponseData = GroupFile[];

export interface RemoveGroupMemberResponseData {
  groupDeleted: boolean;
}