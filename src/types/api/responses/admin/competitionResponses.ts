export interface CompetitionStatusResponse {
  phase: 'setup' | 'submission' | 'finished_submission' | 'attack' | 'finished';
  isPaused: boolean;
  metricsLocked: boolean;
  aggregationLocked: boolean;
  metrics: Array<{
    name: string;
    isSelected: boolean;
  }>;
  aggregations: Array<{
    name: string;
    isSelected: boolean;
  }>;
  activeRawFile: string | null;
}

export type PhaseAction = 'start_submission' | 'end_submission' | 'start_attack' | 'end' | 'pause' | 'resume';

export interface PhaseControlRequest {
  action: PhaseAction;
}

export interface PhaseStatus {
  phase: 'setup' | 'submission' | 'finished_submission' | 'attack' | 'finished';
  isPaused: boolean;
  metricsLocked: boolean;
  aggregationLocked: boolean;
}

export interface RestartCompetitionResponse {
  message: string;
  phase: 'setup' | 'submission' | 'finished_submission' | 'attack' | 'finished';
  isPaused: boolean;
}