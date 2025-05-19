import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  InviteKey,
  InviteKeyListResponseData,
} from "@/types/api/responses/admin/inviteKeyResponses";
import {
  fetchInviteKeys,
  createInviteKey,
  deleteInviteKey,
  deleteAllExpiredInviteKeys,
} from "@/services/api/admin/inviteKeyApi";
import { useInviteKeyStore } from "@/stores/admin/inviteKeyStore";
import { useNotify } from "@/hooks/useNotify";
import { APIResponse } from "@/types/api/responses/responseTypes";

export const useFetchInviteKeys = (page: number = 1, perPage: number = 5) => {
  return useQuery({
    queryKey: ["inviteKeys", page, perPage],
    queryFn: async () => {
      const res: InviteKeyListResponseData = await fetchInviteKeys(
        page,
        perPage
      );
      return res;
    },
  });
};

export const useCreateInviteKey = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: createInviteKey,
    onSuccess: (res: APIResponse<InviteKey>) => {
      success("Success", "New key generated!");
      queryClient.invalidateQueries({ queryKey: ["inviteKeys"] });
    },
    onError: (err: any) => {
      error(err.message || "Failed to create invite key");
    },
  });
};

export const useDeleteInviteKey = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();
  const { setIsDeletingKey } = useInviteKeyStore();

  return useMutation({
    mutationFn: deleteInviteKey,

    onMutate: (key: string) => {
      setIsDeletingKey(key);
    },

    onSuccess: (res: APIResponse<null>) => {
      setIsDeletingKey(null);
      success("Success", "Invite key deleted!");
      queryClient.invalidateQueries({ queryKey: ["inviteKeys"] });
    },

    onError: (err: unknown) => {
      setIsDeletingKey(null);
      error(err || "Error", "Cannot delete invite key!");
    },
  });
};

export const useDeleteAllExpiredInviteKeys = () => {
  const { success, error } = useNotify();
  const { setIsDeletingExpired } = useInviteKeyStore();

  return useMutation({
    mutationFn: deleteAllExpiredInviteKeys,

    onMutate: () => setIsDeletingExpired(true),
    onSuccess: (res: APIResponse<null>) => {
      setIsDeletingExpired(false);
      success("Success", "Deleted all expired invite keys.");
    },

    onError: (err: unknown) => {
      setIsDeletingExpired(false);
      error(err);
    },
  });
};
