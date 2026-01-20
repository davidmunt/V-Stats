export type LiberoSubstitutionStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

export interface LiberoSubstitution {
  id_substitution: string;
  id_match: string;
  id_team: string;
  id_libero: string;
  id_replaced_player: string;
  position: number;
  created_at: Date;
  status: LiberoSubstitutionStatus;
  is_active: boolean;
}
