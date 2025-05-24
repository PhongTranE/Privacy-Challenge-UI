import { useNotify } from "@/hooks/useNotify";

import { UsersInfoResponseData } from "@/types/api/responses/admin/usersInfoResponses";
import { AdminChangeUserPasswordRequest } from "@/types/api/requests/adminRequests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserPassword, deleteUser, fetchUsersList } from "@/services/api/admin/usersManageAPi";

export const useFetchUsersList = (
  page: number = 1,
  perPage: number = 5,
  search: string = ""
) => {
  return useQuery({
    queryKey: ["users", page, perPage, search],
    queryFn: async () => {
      const res: UsersInfoResponseData = await fetchUsersList(
        page,
        perPage,
        search
      );
      return res;
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      success("Success", "User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      error("Error", err?.response?.data?.message || "Failed to delete user!");
    },
  });
};

export const useChangePassword = () => {
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: ({
      userId,
      body,
    }: {
      userId: number;
      body: AdminChangeUserPasswordRequest;
    }) => changeUserPassword(userId, body),
    onSuccess: () => {
      success("Success", "Change password successful!");
    },
    onError: (err: any) => {
      error("Error", err?.response?.data?.message || "Change password failed!");
    },
  });
};
