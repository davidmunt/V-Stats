export type LiberoSubstitutionStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

export interface LiberoSubstitution {
  id_substitution: number;
  id_match: number;
  id_team: number;
  id_libero: number;
  id_replaced_player: number;
  position: number;
  created_at: Date;
  status: LiberoSubstitutionStatus;
  is_active: boolean;
}
