import { Body, Post, Route } from "tsoa";
import { injectable } from "tsyringe";
import { AuthToken } from "../shared/auth/auth-token";
import { AuthService } from "../shared/auth/auth.service";

interface AuthenticationLoginRequest {
    userName: string
    password: string
}

@injectable()
@Route('auth')
export class AuthController {

    constructor(private authenticationService: AuthService) {

    }
    @Post()
    public async login(@Body()command: AuthenticationLoginRequest): Promise<AuthToken> {
        return await this.authenticationService.generateToken(command.userName, command.password);
    }
}