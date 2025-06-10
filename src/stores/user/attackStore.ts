import { create } from "zustand";
import {
  AttackTeam,
  PublishedFile,
  AttackHistory,
  MyAttackScore,
  AttackUploadResult,
} from "@/types/api/responses/user/attackResponses";
import {
  fetchTeamsWithPublished,
  fetchPublishedFiles,
  fetchMyAttackScore,
  fetchMyAttackHistory,
  uploadAttackFile,
} from "@/services/api/user/attackApi";

interface AttackPhaseStoreState {
  teams: AttackTeam[];
  teamsLoading: boolean;
  teamsError: string | null;

  expandedTeamId: number | null;
  filesByTeam: Record<number, PublishedFile[]>;
  filesLoadingByTeam: Record<number, boolean>;
  filesErrorByTeam: Record<number, string | null>;

  expandedFileId: number | null;
  attackScoreByFile: Record<number, number>;
  attackScoreLoadingByFile: Record<number, boolean>;
  attackScoreErrorByFile: Record<number, string | null>;

  attackHistoryByFile: Record<number, AttackHistory[]>;
  attackHistoryLoadingByFile: Record<number, boolean>;
  attackHistoryErrorByFile: Record<number, string | null>;

  // Upload attack file
  uploadLoading: boolean;
  uploadError: string | null;
  uploadResult: AttackUploadResult | null;
  fileUpload: Record<number, File | null>;
  expandedDetailId: number | null;

  setTeams: (teams: AttackTeam[]) => void;
  setTeamsLoading: (loading: boolean) => void;
  setTeamsError: (error: string | null) => void;

  setExpandedTeamId: (teamId: number | null) => void;
  setFilesByTeam: (teamId: number, files: PublishedFile[]) => void;
  setFilesLoadingByTeam: (teamId: number, loading: boolean) => void;
  setFilesErrorByTeam: (teamId: number, error: string | null) => void;

  setExpandedFileId: (fileId: number | null) => void;
  setAttackScoreByFile: (fileId: number, score: number) => void;
  setAttackScoreLoadingByFile: (fileId: number, loading: boolean) => void;
  setAttackScoreErrorByFile: (fileId: number, error: string | null) => void;

  setAttackHistoryByFile: (fileId: number, history: AttackHistory[]) => void;
  setAttackHistoryLoadingByFile: (fileId: number, loading: boolean) => void;
  setAttackHistoryErrorByFile: (fileId: number, error: string | null) => void;

  setUploadLoading: (loading: boolean) => void;
  setUploadError: (error: string | null) => void;
  setUploadResult: (result: AttackUploadResult | null) => void;

  setFileUpload: (fileId: number, file: File | null) => void;
  setExpandedDetailId: (fileId: number | null) => void;

  fetchTeams: () => Promise<void>;
  fetchFilesByTeam: (teamId: number) => Promise<void>;
  fetchAttackScoreByFile: (fileId: number) => Promise<void>;
  fetchAttackHistoryByFile: (fileId: number) => Promise<void>;
  doUploadAttackFile: (anonymId: number, file: File) => Promise<void>;

  reset: () => void;
}

export const useAttackPhaseStore = create<AttackPhaseStoreState>((set) => ({
  teams: [],
  teamsLoading: false,
  teamsError: null,

  expandedTeamId: null,
  filesByTeam: {},
  filesLoadingByTeam: {},
  filesErrorByTeam: {},

  expandedFileId: null,
  attackScoreByFile: {},
  attackScoreLoadingByFile: {},
  attackScoreErrorByFile: {},

  attackHistoryByFile: {},
  attackHistoryLoadingByFile: {},
  attackHistoryErrorByFile: {},

  uploadLoading: false,
  uploadError: null,
  uploadResult: null,
  fileUpload: {},
  expandedDetailId: null,

  setTeams: (teams) => set({ teams }),
  setTeamsLoading: (loading) => set({ teamsLoading: loading }),
  setTeamsError: (error) => set({ teamsError: error }),

  setExpandedTeamId: (teamId) => set({ expandedTeamId: teamId }),
  setFilesByTeam: (teamId, files) =>
    set((state) => ({
      filesByTeam: {
        ...state.filesByTeam,
        [teamId]: Array.isArray(files) ? files : [],
      },
    })),
  setFilesLoadingByTeam: (teamId, loading) =>
    set((state) => ({
      filesLoadingByTeam: { ...state.filesLoadingByTeam, [teamId]: loading },
    })),
  setFilesErrorByTeam: (teamId, error) =>
    set((state) => ({
      filesErrorByTeam: { ...state.filesErrorByTeam, [teamId]: error },
    })),

  setExpandedFileId: (fileId) => set({ expandedFileId: fileId }),
  setAttackScoreByFile: (fileId, score) =>
    set((state) => ({
      attackScoreByFile: { ...state.attackScoreByFile, [fileId]: score },
    })),
  setAttackScoreLoadingByFile: (fileId, loading) =>
    set((state) => ({
      attackScoreLoadingByFile: {
        ...state.attackScoreLoadingByFile,
        [fileId]: loading,
      },
    })),
  setAttackScoreErrorByFile: (fileId, error) =>
    set((state) => ({
      attackScoreErrorByFile: {
        ...state.attackScoreErrorByFile,
        [fileId]: error,
      },
    })),

  setAttackHistoryByFile: (fileId, history) =>
    set((state) => ({
      attackHistoryByFile: {
        ...state.attackHistoryByFile,
        [fileId]: Array.isArray(history) ? history : [],
      },
    })),
  setAttackHistoryLoadingByFile: (fileId, loading) =>
    set((state) => ({
      attackHistoryLoadingByFile: {
        ...state.attackHistoryLoadingByFile,
        [fileId]: loading,
      },
    })),
  setAttackHistoryErrorByFile: (fileId, error) =>
    set((state) => ({
      attackHistoryErrorByFile: {
        ...state.attackHistoryErrorByFile,
        [fileId]: error,
      },
    })),

  setUploadLoading: (loading) => set({ uploadLoading: loading }),
  setUploadError: (error) => set({ uploadError: error }),
  setUploadResult: (result) => set({ uploadResult: result }),
  setFileUpload: (fileId, file) => set((state) => ({ fileUpload: { ...state.fileUpload, [fileId]: file } })),
  setExpandedDetailId: (fileId) => set({ expandedDetailId: fileId }),

  fetchTeams: async () => {
    set({ teamsLoading: true, teamsError: null });
    try {
      const res = await fetchTeamsWithPublished();
      set({ teams: res.data, teamsLoading: false });
    } catch (e: any) {
      set({
        teamsError: e?.message || "Failed to fetch teams",
        teamsLoading: false,
      });
    }
  },
  fetchFilesByTeam: async (teamId: number) => {
    set((state) => ({
      filesLoadingByTeam: { ...state.filesLoadingByTeam, [teamId]: true },
      filesErrorByTeam: { ...state.filesErrorByTeam, [teamId]: null },
    }));
    try {
      const res = await fetchPublishedFiles(teamId);
      set((state) => ({
        filesByTeam: {
          ...state.filesByTeam,
          [teamId]: Array.isArray(res.data) ? res.data : [],
        },
        filesLoadingByTeam: { ...state.filesLoadingByTeam, [teamId]: false },
      }));
    } catch (e: any) {
      set((state) => ({
        filesErrorByTeam: {
          ...state.filesErrorByTeam,
          [teamId]: e?.message || "Failed to fetch files",
        },
        filesLoadingByTeam: { ...state.filesLoadingByTeam, [teamId]: false },
      }));
    }
  },
  fetchAttackScoreByFile: async (fileId: number) => {
    set((state) => ({
      attackScoreLoadingByFile: {
        ...state.attackScoreLoadingByFile,
        [fileId]: true,
      },
      attackScoreErrorByFile: {
        ...state.attackScoreErrorByFile,
        [fileId]: null,
      },
    }));
    try {
      const res = await fetchMyAttackScore(fileId);
      set((state) => ({
        attackScoreByFile: {
          ...state.attackScoreByFile,
          [fileId]: res.data?.score ?? 0,
        },
        attackScoreLoadingByFile: {
          ...state.attackScoreLoadingByFile,
          [fileId]: false,
        },
      }));
    } catch (e: any) {
      set((state) => ({
        attackScoreErrorByFile: {
          ...state.attackScoreErrorByFile,
          [fileId]: e?.message || "Failed to fetch score",
        },
        attackScoreLoadingByFile: {
          ...state.attackScoreLoadingByFile,
          [fileId]: false,
        },
      }));
    }
  },
  fetchAttackHistoryByFile: async (fileId: number) => {
    set((state) => ({
      attackHistoryLoadingByFile: {
        ...state.attackHistoryLoadingByFile,
        [fileId]: true,
      },
      attackHistoryErrorByFile: {
        ...state.attackHistoryErrorByFile,
        [fileId]: null,
      },
    }));
    try {
      const res = await fetchMyAttackHistory(fileId);
      set((state) => ({
        attackHistoryByFile: {
          ...state.attackHistoryByFile,
          [fileId]: Array.isArray(res.data) ? res.data : [],
        },
        attackHistoryLoadingByFile: {
          ...state.attackHistoryLoadingByFile,
          [fileId]: false,
        },
      }));
    } catch (e: any) {
      set((state) => ({
        attackHistoryErrorByFile: {
          ...state.attackHistoryErrorByFile,
          [fileId]: e?.message || "Failed to fetch history",
        },
        attackHistoryLoadingByFile: {
          ...state.attackHistoryLoadingByFile,
          [fileId]: false,
        },
      }));
    }
  },
  doUploadAttackFile: async (anonymId: number, file: File) => {
    set({ uploadLoading: true, uploadError: null, uploadResult: null });
    try {
      const res = await uploadAttackFile(anonymId, file);
      set({ uploadResult: res.data ?? null, uploadLoading: false });
    } catch (e: any) {
      set({
        uploadError: e?.message || "Failed to upload attack file",
        uploadLoading: false,
        uploadResult: null,
      });
      throw e;
    }
  },
  reset: () =>
    set({
      teams: [],
      teamsLoading: false,
      teamsError: null,
      expandedTeamId: null,
      filesByTeam: {},
      filesLoadingByTeam: {},
      filesErrorByTeam: {},
      expandedFileId: null,
      attackScoreByFile: {},
      attackScoreLoadingByFile: {},
      attackScoreErrorByFile: {},
      attackHistoryByFile: {},
      attackHistoryLoadingByFile: {},
      attackHistoryErrorByFile: {},
      uploadLoading: false,
      uploadError: null,
      uploadResult: null,
      fileUpload: {},
      expandedDetailId: null,
    }),
}));
