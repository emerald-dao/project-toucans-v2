export type Vote = ToucansActionVote | ToucansGeneralVote;

export interface BaseVote {
  title: string;
  description: string;
  for_total: number;
  against_total: number;
  created_at: string;
  pending: boolean;
  type: 'Toucans' | 'Toucans Action';
}

export interface ToucansGeneralVote extends BaseVote {
  type: 'Toucans';
}

export interface ToucansActionVote extends BaseVote {
  type: 'Toucans Action';
  toucans_action_id: number;
}