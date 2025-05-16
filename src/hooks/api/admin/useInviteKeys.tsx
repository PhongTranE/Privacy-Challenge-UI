import { useMutation, useQuery } from "@tanstack/react-query";
import {
  InviteKey,
  InviteKeyListResponseData,
} from "@/types/api/responses/admin/inviteKeyResponses";
import {
  createInviteKey,
  fetchInviteKeys,
} from "@/services/api/admin/inviteKeyApi";
import { useInviteKeyStore } from "@/stores/admin/inviteKeyStore";
import { useNotify } from "@/hooks/useNotify";
import { APIResponse } from "@/types/api/responses/responseTypes";

export const useFetchInviteKeys = (page: number = 1, perPage: number = 5) => {
  const { setInviteKeys, setTotalItems } = useInviteKeyStore();

  return useQuery({
    queryKey: ["inviteKeys", page, perPage],
    queryFn: async () => {
      const res: InviteKeyListResponseData = await fetchInviteKeys(
        page,
        perPage
      );
      setInviteKeys(res.data ?? []);
      setTotalItems(res.meta.totalItems);
      return res;
    },
  });
};

export const useCreateInviteKey = () => {
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: createInviteKey,

    onSuccess: (res: APIResponse<InviteKey>) => {
      if (res.status !== "success") {
        error(res);
        return;
      }

      const message = res.message as string;
      success(message, "New key generated.");
    },

    onError: (err: unknown) => {
      error(err);
    },
  });
};
