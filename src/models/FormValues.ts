export interface FormValues {
  organization_name: string;
  address1: string;
  address2: string | null;
  email: string;
  phone: string;
  logo: Record<string, unknown>;
  shortCode: string;
  color: string;
}
