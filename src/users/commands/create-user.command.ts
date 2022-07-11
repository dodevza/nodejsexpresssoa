import { injectable } from "tsyringe";
import { UserExtended } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";

export interface CreateUserCommand {
    FirstName: string;
    LastName: string;
    Email: string;
    Roles: string[];
    Password: string;
}

export interface CreateUserCommandResponse {
    Id: number;
}

@injectable()
export class CreateUserCommandHandler {
    constructor(private userRepository: UserRepository) {

    }

    public async execute(command: CreateUserCommand): Promise<CreateUserCommandResponse> {
        const user = this.buildUser(command);
        const createdUser = await this.userRepository.insert(user);
        return {
            Id: createdUser.Id ?? 0,
        }
    }


    private buildUser(command: CreateUserCommand): UserExtended {
        return {
            Email: command.Email,
            FirstName: command.FirstName,
            LastName: command.LastName,
            UserRoles: [],
            HashedPassword: command.Password, //TODO: Haspassword
        }
    }
}