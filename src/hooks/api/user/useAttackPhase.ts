import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTeamsWithPublished,
  fetchPublishedFiles,
  fetchMyAttackScore,
  fetchMyAttackHistory,
  uploadAttackFile,
} from '@/services/api/user/attackApi';

// Lấy danh sách các team có file publish (trừ team mình)
export const useTeamsWithPublished = () => {
  return useQuery({
    queryKey: ['attack', 'teams-with-published'],
    queryFn: fetchTeamsWithPublished,
  });
};

// Lấy danh sách file đã publish của 1 team
export const usePublishedFiles = (groupId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['attack', 'published-files', groupId],
    queryFn: () => fetchPublishedFiles(groupId),
    enabled: !!groupId && enabled,
  });
};

// Lấy điểm attack của team mình lên 1 file
export const useMyAttackScore = (anonymId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['attack', 'my-score', anonymId],
    queryFn: () => fetchMyAttackScore(anonymId),
    enabled: !!anonymId && enabled,
  });
};

// Lấy lịch sử các lần attack của team mình lên 1 file
export const useMyAttackHistory = (anonymId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['attack', 'my-attacks', anonymId],
    queryFn: () => fetchMyAttackHistory(anonymId),
    enabled: !!anonymId && enabled,
  });
};

// Upload attack file
export const useUploadAttackFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ anonymId, file }: { anonymId: number; file: File }) =>
      uploadAttackFile(anonymId, file),
    onSuccess: () => {
      // Refetch các query liên quan nếu cần
      queryClient.invalidateQueries({ queryKey: ['attack'] });
    },
  });
}; 