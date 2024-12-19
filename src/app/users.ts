import { userRoleEnum } from './userRoleEnum';

export interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  phoneNumber: string;
  role: userRoleEnum;
  firstname: string;
  surname: string;
  birthdate: Date | null;
  age?: number;
}
