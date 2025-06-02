import { create } from 'zustand';
import { SubmissionFile } from '@/types/api/responses/user/submissionResponses';

interface SubmissionState {
  files: SubmissionFile[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  setFiles: (files: SubmissionFile[]) => void;
  setLoading: (loading: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  files: [],
  loading: false,
  isSubmitting: false,
  error: null,
  setFiles: (files) => set({ files }),
  setLoading: (loading) => set({ loading }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  resetState: () => set({ files: [], loading: false, isSubmitting: false, error: null }),
}));
