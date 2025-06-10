export type BestOffense = {
    score: number;
    attackerId: number;
    attackerName: string;
  };

  export type GroupSubmissionFile = {
    id: number;
    name: string;
    usefulness: number;
    bestOffense: BestOffense | null;
    defenseScore: number;
  };
  
  export type GetGroupSubmissionResponseData = GroupSubmissionFile[];

  export interface MinimalAttackFile {
    id: number;
    name: string;
  }
  
  export interface AttackListItem {
    attackedGroupId: number;
    attackedGroupName: string;
    minimalAttackFile: MinimalAttackFile;
    attackScore: number;
  }

  export type AttackListResponseData = AttackListItem[];

  export interface AttackedFileItem {
    fileId: number;
    fileName: string;
    maxAttackScore: number;
  }

  export type AttackedFilesResponseData = AttackedFileItem[];