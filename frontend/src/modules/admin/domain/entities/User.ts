import type { Role } from "./Role";
export type User = {
  id: number;
  role: Role,
  email: string;
  personId: string;
  name: string;
  lastname: string;
  fullname: string;
  phone: string;
  username: string;
};
