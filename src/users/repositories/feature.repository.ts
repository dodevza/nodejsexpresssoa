import { injectable } from "tsyringe";
import { PagedData } from "../../shared/repositories/PagedData";
import { Feature } from "../entities/feature";

@injectable()
export class FeatureRepository {
    public async getAll(): Promise<PagedData<Feature>> {
        const data = this.getData();
        return {
            items: data,
            count: data.length,
            pageSize: 10,
            pageOffset: 1,
        }
    }

    private getData(): Feature[] {
        return [{ 
            Id: 1, 
            Name: 'users.list',
        },{ 
            Id: 2, 
            Name: 'users.add',
        },{ 
            Id: 3, 
            Name: 'users.edit',
        },{ 
            Id: 4, 
            Name: 'users.delete',
        }];
    }
}