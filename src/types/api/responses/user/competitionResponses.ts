export interface CompetitionStatusUserResponse {
  phase: 'setup' | 'submission' | 'finished_submission' | 'attack' | 'finished';
  isPaused: boolean;
} 