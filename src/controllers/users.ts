import { Body, Get, Post, Route, Security, Tags } from "tsoa";
import { injectable } from "tsyringe";
import { AuthClaims } from "../shared/auth/auth-claims";
import { AuthService } from "../shared/auth/auth.service";
import { PagedData } from "../shared/repositories/PagedData";
import { CreateUserCommand, CreateUserCommandHandler, CreateUserCommandResponse } from "../users/commands/create-user.command";
import { User } from "../users/entities/user";
import { UserRepository } from "../users/repositories/user.repository";

@injectable()
@Tags("User")
@Route("users")
export class UsersController {

    constructor(
      private userRepository: UserRepository,
      private createUserCommandHandler: CreateUserCommandHandler,
      private authService: AuthService) {
      
      
    }
    
    @Security("features", ["users.list"])
    @Get("/")
    public async getAll(): Promise<PagedData<User>> {
      return this.userRepository.getAll();
    }

    @Security("features", ["users.add"])
    @Post("/")
    public async create(@Body()command: CreateUserCommand): Promise<CreateUserCommandResponse> {
        return await this.createUserCommandHandler.execute(command);
    }

    @Get("/current")
    public async getCurrent(): Promise<AuthClaims> {
      return this.authService.getCurrentUserClaims();
    }
}