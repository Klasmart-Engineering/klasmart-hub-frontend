interface OrganizationUser {
  group: string;
}

export interface User {
  suffixName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthYearMonth: string;
  group: string;
  school: string[];
  email: string;
  date: string;
  invitationStatus: string;
  status: string;
  organizations: OrganizationUser[];
  avatar: any;
  updatedAt: string;
  createdAt: string;
}
