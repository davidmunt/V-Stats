export type LiberoSubstitutionStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

export interface LiberoSubstitution {
  slug_substitution: string;
  slug_match: string;
  slug_team: string;
  slug_libero: string;
  slug_replaced_player: string;
  position: number;
  created_at: Date;
  status: LiberoSubstitutionStatus;
  is_active: boolean;
}
