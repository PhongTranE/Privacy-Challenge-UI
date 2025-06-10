import { useNotify } from "@/hooks/useNotify";
import { 
  fetchGroups, 
  deleteGroup, 
  toggleGroupBan, 
  fetchGroupDetailFull,
  updateGroupName,
  removeGroupMember,
  fetchGroupFiles,
  downloadGroupFile,
  deleteGroupFile,
} from "@/services/api/admin/groupApi";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { UpdateGroupNameRequest } from "@/types/api/requests/adminRequests";
import { useChangeGroupNameModalStore, useDeleteGroupModalStore, useDetailGroupModalStore, useRemoveGroupMemberModalStore } from "@/stores/admin/groupManageStore";
import { RemoveGroupMemberResponseData } from "@/types/api/responses/admin/groupResponses";

export const useFetchGroups = (page: number = 1, perPage: number = 5, search: string = "",) => {
  return useQuery({
    queryKey: ["groups", page, perPage, search],
    queryFn: async () => {
      const res = await fetchGroups(page, perPage, search);
      return res;
    },
  });
};

export const useFetchGroupDetailFull = (groupId: number) => {
  return useQuery({
    queryKey: ["groupDetailFull", groupId],
    queryFn: () => fetchGroupDetailFull(groupId),
    enabled: !!groupId,
  });
};

export const useFetchGroupFiles = (groupId: number, fileType?: 'anonymous' | 'attack' | 'all') => {
  return useQuery({
    queryKey: ["groupFiles", groupId, fileType],
    queryFn: () => fetchGroupFiles(groupId, fileType),
    enabled: !!groupId,
  });
};

export const useUpdateGroupName = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();
  const { closeModal } = useChangeGroupNameModalStore();
  const { updateGroupName: updateModalGroupName } = useDetailGroupModalStore();


  return useMutation({
    mutationFn: async ({ groupId, data }: { groupId: number; data: UpdateGroupNameRequest }) => {
      return await updateGroupName(groupId, data);
    },
    onSuccess: (res: APIResponse<null>, { groupId, data }) => {
      success("Success", typeof res?.message === "string" ? res.message : "Group name updated successfully!");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetailFull", groupId] });
      updateModalGroupName(data.name);
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
    },
    onError: (err: unknown) => {
      error(err, "Cannot update group name!");
    },
  });
};

export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();
  const { closeModal } = useRemoveGroupMemberModalStore();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) => removeGroupMember(groupId, userId),

    onSuccess: (res: APIResponse<RemoveGroupMemberResponseData>) => {
      if (res.status !== "success") {
        error(res, "Cannot delete member!");
        return;
      }
      success("Success", typeof res?.message === "string" ? res.message : "Member deleted successfully!");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["groupDetailFull"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },

    onError: (err: unknown) => {
      console.error(err);
      error(err);
    },
  });
};

export const useDownloadGroupFile = () => {
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: async ({
      groupId,
      fileType,
      fileId,
    }: {
      groupId: number;
      fileType: "anonymous" | "attack";
      fileId: number;
    }) => {
      await downloadGroupFile(groupId, fileType, fileId);
    },
    onSuccess: () => {
      success("Success", "File downloaded successfully!");
    },
    onError: (err: unknown) => {
      error(err, "Cannot download file!");
    },
  });
};

export const useDeleteGroupFile = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: ({
      groupId,
      fileType,
      fileId,
    }: {
      groupId: number;
      fileType: 'anonymous' | 'attack';
      fileId: number;
    }) => deleteGroupFile(groupId, fileType, fileId),

    onSuccess: (res) => {
        success("Success", typeof res?.message === "string" ? res.message : "File deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["groupFiles"] });
        queryClient.invalidateQueries({ queryKey: ["groupDetailFull"] });
        queryClient.invalidateQueries({ queryKey: ["groupStatistics"] });
        queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (err) => {
      error(err, "Cannot delete file!");
    },
  });
};

export const useToggleGroupBan = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: async (groupId: number) => {
      return await toggleGroupBan(groupId);
    },
    onSuccess: (res: APIResponse<{isBanned: boolean}>) => {
      success("Success", typeof res?.message === "string" ? res.message : "Group banned successfully!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err: unknown) => {
      error(err, "Cannot toggle group ban!");
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();
  const { closeModal } = useDeleteGroupModalStore();

  return useMutation({
    mutationFn: async (groupId: number) => {
      return await deleteGroup(groupId);
    },
    onSuccess: (res: APIResponse<null>) => {
      success("Success", typeof res?.message === "string" ? res.message : "Group deleted successfully!");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: unknown) => {
      error(err, "Cannot delete group!");
    },
  });
}; 