import { singleton } from "tsyringe";
import { FeatureRepository } from "../../users/feature.repository";
import { Role, RoleExtended } from "../../users/role.model";
import { RoleRepository } from "../../users/role.repository";

@singleton()
export class RoleFeatureStore {
    private roles: Role[] | null = null; 
    private roleNames: Map<number, string> | null = null;
    private roleFeatures: Map<string, string[]> | null = null;
    constructor(
        private roleRepository: RoleRepository,
        private featureRepository: FeatureRepository ) {
    }

    public async getCombinedFeatures(...roles: string[]): Promise<Set<string>> {
        const map = await this.getAllRoleFeatures();
        const set = new Set<string>();
        for(const roleName of roles) {
            const features = map.get(roleName);
            if (!features) continue;
            for(const feature of features) {
                set.add(feature);
            }
        }
        return set;
    }

    public async getRoleName(id: number): Promise<string | undefined> {
        const roleNames = await this.getRoleNames();
        return roleNames.get(id);
    } 
    
    public async getRoleNames(): Promise<Map<number,string>> {
        if (this.roleNames) return this.roleNames;

        const roles = await this.getRoles();

        const map = new Map<number, string>();
        for(const role of roles) {
            map.set(role.Id, role.Name);
        }
        this.roleNames = map;
        return map;
    } 
    
    private async getRoles(): Promise<RoleExtended[]> {
        if (this.roles) return this.roles;
        const roles = await this.roleRepository.getAllWithFeatures();
        this.roles = roles.items;
        return roles.items;
    }


    private async getAllRoleFeatures(): Promise<Map<string, string[]>>  {
        if (this.roleFeatures) return this.roleFeatures;

        const roles = await this.getRoles();
        const features = await this.featureRepository.getAll();

        const featureMap = new Map<number, string>();
        for(const feature of features.items) {
            featureMap.set(feature.Id, feature.Name)
        }
        const roleMap = new Map<string, string[]>() 
        for(const role of roles) {
            const featureSet = new Set<string>();
            for(const roleFeature of role.RoleFeatures ?? []) {
                const featureKey = featureMap.get(roleFeature.FeatureId);
                if (featureKey) {
                    featureSet.add(featureKey);
                }
            }
            roleMap.set(role.Name, Array.from(featureSet))
        }
        this.roleFeatures = roleMap;
        return roleMap;
    }

    

}