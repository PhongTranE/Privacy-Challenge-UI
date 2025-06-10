import axiosInstance from "@/services/axiosInstance";
import { UpdateGroupNameRequest } from "@/types/api/requests/adminRequests";
import { GroupDetailFullResponseData, GroupFilesResponseData, GroupListResponseData, RemoveGroupMemberResponseData } from "@/types/api/responses/admin/groupResponses";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { downloadBlobFile } from "@/utils/downloadBlobFile";

export const fetchGroups = async (
  page: number = 1,
  perPage: number = 5,
  search: string = "",
): Promise<GroupListResponseData> => {
  const res = await axiosInstance.get<GroupListResponseData>(
    "/admin/group_user",
    {
      params: {
        page,
        per_page: perPage,
        search: search,
        count: true,
      },
    }
  );
  return res.data;
};


export const fetchGroupDetailFull = async (
  groupId: number
): Promise<GroupDetailFullResponseData> => {
  const res = await axiosInstance.get<APIResponse<GroupDetailFullResponseData>>(`/admin/group_user/${groupId}/details`);
  return res.data.data!;
};

export const updateGroupName = async (
  groupId: number,
  data: UpdateGroupNameRequest
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.put<APIResponse<null>>(
    `/admin/group_user/${groupId}/name`,
    data
  );
  return res.data;
};

export const fetchGroupFiles = async (
  groupId: number,
  fileType?: 'anonymous' | 'attack' | 'all',
  limit: number = 20
): Promise<GroupFilesResponseData> => {
  const params: any = { limit };
  if (fileType) params.type = fileType;
  
  const res = await axiosInstance.get<APIResponse<GroupFilesResponseData>>(
    `/admin/group_user/${groupId}/files`,
    { params }
  );
  return res.data.data!;
};

export const removeGroupMember = async (
  groupId: number,
  userId: number
): Promise<APIResponse<RemoveGroupMemberResponseData>> => {
  const res = await axiosInstance.delete<APIResponse<RemoveGroupMemberResponseData>>(
    `/admin/group_user/${groupId}/members/${userId}`
  );
  return res.data;
};

export const downloadGroupFile = async (
  groupId: number,
  fileType: 'anonymous' | 'attack',
  fileId: number
): Promise<void> => {
  const res = await axiosInstance.get(
    `/admin/group_user/${groupId}/files/${fileType}/${fileId}/download`,
    { responseType: 'blob' }
  );
  const contentDisposition = res.headers['content-disposition'];
  downloadBlobFile(res.data, contentDisposition);
};

export const deleteGroupFile = async (
  groupId: number,
  fileType: 'anonymous' | 'attack',
  fileId: number
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.delete<APIResponse<null>>(
    `/admin/group_user/${groupId}/files/${fileType}/${fileId}`
  );
  return res.data;
};

export const toggleGroupBan = async (
  groupId: number
): Promise<APIResponse<{isBanned: boolean}>> => {
  const res = await axiosInstance.put<APIResponse<{isBanned: boolean}>>(`/admin/group_user/toggle-ban/${groupId}`);
  return res.data;
};

export const deleteGroup = async (
  groupId: number
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.delete<APIResponse<null>>(
    `/admin/group_user/${groupId}`
  );
  return res.data;
};
