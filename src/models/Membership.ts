export interface User {
  user_id: string;
  user_name: string;
  email?: string;
  role: string;
}

export interface Membership {
  user: User;
}

export interface Organization {
  memberships: Membership[];
}

export interface Data {
  organization: Organization;
}

export interface RootObject {
  data: Data;
}
