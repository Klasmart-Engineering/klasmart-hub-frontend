import { User } from "@/types/graphQL";

export interface CurrentMembership {
  organization_name: string;
  organization_id: string;
  organization_email: string;
  user?: User | null;
}
