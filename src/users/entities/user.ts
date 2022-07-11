import { UserRole } from "./role";

export interface User {
    Id?: number;
    FirstName: string;
    LastName: string;
    Email: string;
}

export interface UserExtended extends User {
    HashedPassword: string;
    UserRoles?: UserRole[];
}