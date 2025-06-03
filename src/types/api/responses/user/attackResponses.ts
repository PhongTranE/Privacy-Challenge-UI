export interface AttackTeam {
    id: number;
    name: string;
    num_published: number;
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

