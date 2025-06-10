import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubmissionList,
  uploadSubmission,
  togglePublish,
  getSubmissionDetail,
} from '@/services/api/user/submissionApi';
import { useNotify } from '@/hooks/useNotify';

export const useSubmissionList = () => {
  return useQuery({
    queryKey: ['submission', 'list'],
    queryFn: getSubmissionList,
  });
};

export const useUploadSubmission = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();
  return useMutation({
    mutationFn: uploadSubmission,
    onSuccess: () => {
      success('Success', 'File has been submitted!');
      queryClient.invalidateQueries({ queryKey: ['submission', 'list'] });
    },
    onError: (err: any) => {
      // Throw from backend
      // error('Error', err?.response?.data?.message || 'Failed to submit file');
    },
  });
};

export const useTogglePublish = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();
  return useMutation({
    mutationFn: togglePublish,
    onSuccess: () => {
      success('Success', 'Update publish status!');
      queryClient.invalidateQueries({ queryKey: ['submission', 'list'] });
    },
    onError: (err: any) => {
      error('Error', err?.response?.data?.message || 'Failed to update publish status');
    },
  });
};

export const useSubmissionDetail = (anonymId: number) => {
  return useQuery({
    queryKey: ['submission', 'detail', anonymId],
    queryFn: () => getSubmissionDetail(anonymId),
    enabled: !!anonymId,
  });
};
