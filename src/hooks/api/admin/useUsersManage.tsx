import { fetchUsersList } from "@/services/api/admin/usersManageAPi";
import { useUsersManageStore } from "@/stores/admin/usersManageStore";
import { UsersInfoResponseData } from "@/types/api/responses/admin/usersInfoResponses";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsersList = (page: number = 1, perPage: number = 10) => {
  const { setUsers, setTotalItems } = useUsersManageStore();

  return useQuery({
    queryKey: ["usersList", page, perPage],
    queryFn: async () => {
      const res: UsersInfoResponseData = await fetchUsersList(page, perPage);
      setUsers(res.data ?? []);
      setTotalItems(res.meta.totalItems);
      return res;
    },
  });
};
