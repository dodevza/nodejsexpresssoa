import { UserRole } from "./role.model";

export interface User {
    Id: number;
    FirstName: string;
    LastName: string;
    Email: string;
}

export interface UserExtended extends User {
    HashedPassword: string;
    UserRoles?: UserRole[];
}