import { Get, Route, Security, Tags } from "tsoa";
import { injectable } from "tsyringe";
import { AuthClaims } from "../shared/auth/auth-claims";
import { AuthService } from "../shared/auth/auth.service";
import { PagedData } from "../shared/repositories/PagedData";
import { User } from "../users/user.model";
import { UserRepository } from "../users/user.repository";

@injectable()
@Tags("User")
@Route("users")
export class UsersController {

    constructor(
      private userRepository: UserRepository,
      private authService: AuthService) {
      
      
    }
    
    @Security("features", ["users.list"])
    @Get("/")
    public async getAll(): Promise<PagedData<User>> {
      return this.userRepository.getAll();
    }

    @Get("/current")
    public async getCurrent(): Promise<AuthClaims> {
      return this.authService.getCurrentUserClaims();
    }
}