import { injectable } from "tsyringe";
import { PagedData } from "../shared/repositories/PagedData";
import { Role, RoleExtended } from "./role.model";

@injectable()
export class RoleRepository {
    public getAll(): PagedData<Role> {
        const data = this.getData();
        return {
            items: data.map(this.mapUser),
            count: data.length,
            pageSize: 10,
            pageOffset: 1,
        }
    }

    public async getAllWithFeatures(): Promise<PagedData<RoleExtended>> {
        const data = this.getData();
        return {
            items: data,
            count: data.length,
            pageSize: 10,
            pageOffset: 1,
        }
    }

    private getData(): RoleExtended[] {
        return [{ 
            Id: 1, 
            Name: 'Admin',
            RoleFeatures: [{
                Id: 1,
                FeatureId: 1,
                RoleId: 1,
            },
            {
                Id: 2,
                FeatureId: 2,
                RoleId: 1,
            },
            {
                Id: 3,
                FeatureId: 3,
                RoleId: 1,
            },
            {
                Id: 4,
                FeatureId: 4,
                RoleId: 1,
            }] 
        }];
    }

    private mapUser(role: RoleExtended): Role {
        return {
            Id: role.Id,
            Name: role.Name,
        }
    }
}