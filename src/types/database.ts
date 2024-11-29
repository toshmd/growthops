import { Database } from "@/integrations/supabase/types";

export type DbCompany = Database["public"]["Tables"]["companies"]["Row"];
export type DbOutcome = Database["public"]["Tables"]["outcomes"]["Row"];
export type DbTask = Database["public"]["Tables"]["tasks"]["Row"];
export type DbTeam = Database["public"]["Tables"]["teams"]["Row"];
export type DbProfile = Database["public"]["Tables"]["profiles"]["Row"];

export type CompanyWithRelations = DbCompany & {
  primary_contact?: DbProfile;
};

export type NewCompany = Omit<DbCompany, "id" | "created_at" | "updated_at">;
export type UpdateCompany = Partial<NewCompany>;