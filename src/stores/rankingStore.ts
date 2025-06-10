import { create } from 'zustand';
import { SubmissionFile } from '@/types/api/responses/user/submissionResponses';
import { AttackHistory } from '@/types/api/responses/user/attackResponses';
import { GetGroupSubmissionResponseData, AttackListResponseData, AttackedFilesResponseData } from '@/types/api/responses/rankingResponses';

interface RankingStoreState {
  ranking: any[];
  rankingLoading: boolean;
  rankingError: string | null;

  filesByTeam: Record<number, SubmissionFile[]>;
  filesLoadingByTeam: Record<number, boolean>;
  filesErrorByTeam: Record<number, string | null>;

  attackHistoryByFile: Record<number, AttackHistory[]>;
  attackHistoryLoadingByFile: Record<number, boolean>;
  attackHistoryErrorByFile: Record<number, string | null>;

  groupSubmissionFilesByTeam: Record<number, GetGroupSubmissionResponseData>;
  groupSubmissionFilesLoadingByTeam: Record<number, boolean>;
  groupSubmissionFilesErrorByTeam: Record<number, string | null>;

  // Attack ranking
  attackListByGroup: Record<number, AttackListResponseData>;
  attackListLoadingByGroup: Record<number, boolean>;
  attackListErrorByGroup: Record<number, string | null>;

  attackedFiles: Record<string, AttackedFilesResponseData>;
  attackedFilesLoading: Record<string, boolean>;
  attackedFilesError: Record<string, string | null>;

  setRanking: (data: any[]) => void;
  setRankingLoading: (loading: boolean) => void;
  setRankingError: (err: string | null) => void;

  setFilesByTeam: (teamId: number, files: SubmissionFile[]) => void;
  setFilesLoadingByTeam: (teamId: number, loading: boolean) => void;
  setFilesErrorByTeam: (teamId: number, err: string | null) => void;

  setAttackHistoryByFile: (fileId: number, history: AttackHistory[]) => void;
  setAttackHistoryLoadingByFile: (fileId: number, loading: boolean) => void;
  setAttackHistoryErrorByFile: (fileId: number, err: string | null) => void;

  setGroupSubmissionFilesByTeam: (teamId: number, files: GetGroupSubmissionResponseData) => void;
  setGroupSubmissionFilesLoadingByTeam: (teamId: number, loading: boolean) => void;
  setGroupSubmissionFilesErrorByTeam: (teamId: number, err: string | null) => void;

  setAttackListByGroup: (groupId: number, data: AttackListResponseData) => void;
  setAttackListLoadingByGroup: (groupId: number, loading: boolean) => void;
  setAttackListErrorByGroup: (groupId: number, err: string | null) => void;

  setAttackedFiles: (key: string, data: AttackedFilesResponseData) => void;
  setAttackedFilesLoading: (key: string, loading: boolean) => void;
  setAttackedFilesError: (key: string, err: string | null) => void;

  clearCache: () => void;
}

export const useRankingStore = create<RankingStoreState>((set) => ({
  ranking: [],
  rankingLoading: false,
  rankingError: null,

  filesByTeam: {},
  filesLoadingByTeam: {},
  filesErrorByTeam: {},

  attackHistoryByFile: {},
  attackHistoryLoadingByFile: {},
  attackHistoryErrorByFile: {},

  groupSubmissionFilesByTeam: {},
  groupSubmissionFilesLoadingByTeam: {},
  groupSubmissionFilesErrorByTeam: {},

  // Attack ranking
  attackListByGroup: {},
  attackListLoadingByGroup: {},
  attackListErrorByGroup: {},

  attackedFiles: {},
  attackedFilesLoading: {},
  attackedFilesError: {},

  setRanking: (data) => set({ ranking: data }),
  setRankingLoading: (loading) => set({ rankingLoading: loading }),
  setRankingError: (err) => set({ rankingError: err }),

  setFilesByTeam: (teamId, files) => set((state) => ({ filesByTeam: { ...state.filesByTeam, [teamId]: files } })),
  setFilesLoadingByTeam: (teamId, loading) => set((state) => ({ filesLoadingByTeam: { ...state.filesLoadingByTeam, [teamId]: loading } })),
  setFilesErrorByTeam: (teamId, err) => set((state) => ({ filesErrorByTeam: { ...state.filesErrorByTeam, [teamId]: err } })),

  setAttackHistoryByFile: (fileId, history) => set((state) => ({ attackHistoryByFile: { ...state.attackHistoryByFile, [fileId]: history } })),
  setAttackHistoryLoadingByFile: (fileId, loading) => set((state) => ({ attackHistoryLoadingByFile: { ...state.attackHistoryLoadingByFile, [fileId]: loading } })),
  setAttackHistoryErrorByFile: (fileId, err) => set((state) => ({ attackHistoryErrorByFile: { ...state.attackHistoryErrorByFile, [fileId]: err } })),

  setGroupSubmissionFilesByTeam: (teamId, files) => set((state) => ({ groupSubmissionFilesByTeam: { ...state.groupSubmissionFilesByTeam, [teamId]: files } })),
  setGroupSubmissionFilesLoadingByTeam: (teamId, loading) => set((state) => ({ groupSubmissionFilesLoadingByTeam: { ...state.groupSubmissionFilesLoadingByTeam, [teamId]: loading } })),
  setGroupSubmissionFilesErrorByTeam: (teamId, err) => set((state) => ({ groupSubmissionFilesErrorByTeam: { ...state.groupSubmissionFilesErrorByTeam, [teamId]: err } })),

  setAttackListByGroup: (groupId, data) => set((state) => ({ attackListByGroup: { ...state.attackListByGroup, [groupId]: data } })),
  setAttackListLoadingByGroup: (groupId, loading) => set((state) => ({ attackListLoadingByGroup: { ...state.attackListLoadingByGroup, [groupId]: loading } })),
  setAttackListErrorByGroup: (groupId, err) => set((state) => ({ attackListErrorByGroup: { ...state.attackListErrorByGroup, [groupId]: err } })),

  setAttackedFiles: (key, data) => set((state) => ({ attackedFiles: { ...state.attackedFiles, [key]: data } })),
  setAttackedFilesLoading: (key, loading) => set((state) => ({ attackedFilesLoading: { ...state.attackedFilesLoading, [key]: loading } })),
  setAttackedFilesError: (key, err) => set((state) => ({ attackedFilesError: { ...state.attackedFilesError, [key]: err } })),

  clearCache: () => set({
    filesByTeam: {},
    filesLoadingByTeam: {},
    filesErrorByTeam: {},
    attackHistoryByFile: {},
    attackHistoryLoadingByFile: {},
    attackHistoryErrorByFile: {},
    groupSubmissionFilesByTeam: {},
    groupSubmissionFilesLoadingByTeam: {},
    groupSubmissionFilesErrorByTeam: {},
    attackListByGroup: {},
    attackListLoadingByGroup: {},
    attackListErrorByGroup: {},
    attackedFiles: {},
    attackedFilesLoading: {},
    attackedFilesError: {},
  }),
}));
