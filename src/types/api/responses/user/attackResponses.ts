export interface AttackTeam {
    id: number;
    name: string;
    numPublished: number;
}

export interface PublishedFile {
    id: number;
    name: string;
}
  
export interface AttackHistory {
    id: number;
    score: number;
    file: string;
}

export interface MyAttackScore {
    score: number;
} 

export interface AttackUploadResult {
    id: number;
    file: string;
}
  