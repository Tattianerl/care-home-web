import type { UserRole } from "./enums";

export interface UserSummary {
  id:string;
  nome:string;
  cargo:UserRole;
}


export interface PatientSummary {
  id:string;
  nome:string;
}