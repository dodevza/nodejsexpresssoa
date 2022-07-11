export interface Role {
    Id: number;
    Name: string;
}

export interface RoleExtended extends Role {
    RoleFeatures?: RoleFeature[];
}

export interface RoleFeature {
    Id: number;
    RoleId: number;
    FeatureId: number;
}

export interface UserRole {
    Id: number;
    RoleId: number;
    UserId: number;
}