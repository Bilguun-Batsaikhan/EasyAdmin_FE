import { userRoleEnum } from './userRoleEnum';

export interface User {
  id: number;
  firstname: string;
  surname: string;
  username: string;
  phoneNumber: string;
  email: string;
  role: userRoleEnum;
  birthdate: Date;
  age: number;
}
