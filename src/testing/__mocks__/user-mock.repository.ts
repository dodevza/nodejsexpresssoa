import { PagedData } from "../../shared/repositories/PagedData";
import { User, UserExtended } from "../../users/user.model";

export class UserMockRepository {
    public getAll(): PagedData<User> {
        const users = this.getData();
        return {
            items: users.map(this.mapUser),
            count: users.length,
            pageSize: 10,
            pageOffset: 1,
        }
    }

    private getData(): UserExtended[] {
        return [{ 
            Id: 1, 
            FirstName: 'Mike', 
            LastName: 'Laurie', 
            Email: 'mike@example.com', 
            HashedPassword: 'Pass123',
            UserRoles: [{
                Id: 1,
                RoleId: 1,
                UserId: 1,
            }] 
        }];
    }

    private mapUser(user: UserExtended): User {
        return {
            Id: user.Id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
        }
    }
    
    public getUserByEmailAndPassword(email: string, password: string): UserExtended | undefined {
        const emailLower = email?.toLowerCase();
        const hashedPassword = password; // Add hashing algorith
        const findUser = this.getData()
            .find((user) => user.Email?.toLowerCase() === emailLower &&
                            user.HashedPassword === hashedPassword )

        if (!findUser) return;
        
        return findUser;
    }
}