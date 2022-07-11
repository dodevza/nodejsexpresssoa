import fs from 'fs';
import { singleton } from "tsyringe";
import { UserRepository } from "../../users/repositories/user.repository";
import { AuthToken } from "./auth-token";
import jwt, {JwtPayload, SignOptions, VerifyOptions} from 'jsonwebtoken';
import { AuthClaims } from './auth-claims';
import { HttpContextService } from '../../middleware/http-context';
import { RoleFeatureStore } from './roles-store';
import { UnAuthorizedError } from '../exceptions/un-authorized.error';
import { ValidateError } from 'tsoa';
import { UnAuthenticatedError } from '../exceptions/un-authenticated.error';
import { Logger } from '../logging/logger';

interface PrivateSecret {
    key: Buffer;
    passphrase: string;
}
interface JwtConfig {
    privateSecret: PrivateSecret,
    signOptions: SignOptions,
    publicKey: Buffer,
    verifyOptions: VerifyOptions
}

@singleton()
export class AuthService {
    private config: JwtConfig | null = null;

    constructor(
        private httpContext: HttpContextService,
        private userRepository: UserRepository,
        private roleFeatureStore: RoleFeatureStore,
        ) {

    }
    
    async generateToken(userName: string, password: string): Promise<AuthToken>  {
        const conf = this.getConfig();
        const user = this.userRepository.getUserByEmailAndPassword(userName, password);
        if (!user) {
            throw new ValidateError({ userName: { message: "Not Found", value: userName }}, "Username or Password incorrect");
        }
        const roleNames = await this.roleFeatureStore.getRoleNames();

        const roles = user.UserRoles
            ?.map((role) => roleNames.get(role.RoleId))
            ?.filter((name) => !!name)
            ?.join(',') ?? '';

        const token = jwt.sign({
            firstName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
            roles,
            iss: process.env.JWT_ISSUER
        }, conf.privateSecret?.passphrase ? conf.privateSecret : conf.privateSecret.key, conf.signOptions);

        return {
            token,
        }
    }

    async authorize(authorizationHeader: string, scopes?: string[]) {
        if (!authorizationHeader) throw new UnAuthenticatedError("No token provided")
        const conf = this.getConfig();
        const split = authorizationHeader.split(' ')
        const token = split[1] ?? split[0];
        
        try
        {
            jwt.verify(token, conf.publicKey, conf.verifyOptions)
        } catch {
            throw new UnAuthorizedError("Unable to verify token");
        }

        if (!scopes?.length) return;

        const claims = this.getAuthClaimsFromHeader(authorizationHeader);

        const features = await this.roleFeatureStore.getCombinedFeatures(...claims.Roles);
        for(const scopedFeature of scopes) {
            if (features.has(scopedFeature))
                return;
        }

        throw new UnAuthorizedError("User doesn't have the correct permissions to access this resource");

    }

    getCurrentUserClaims(): AuthClaims {
        const authorizationHeader = this.httpContext.getHeaders()?.["authorization"] as string;
        return this.getAuthClaimsFromHeader(authorizationHeader);
    }

    private getAuthClaimsFromHeader(authorizationHeader: string): AuthClaims {
        if (!authorizationHeader) throw new Error("No token provided")
        const split = authorizationHeader.split(' ')
        const token = split[1] ?? split[0];
        
        const data = jwt.decode(token) as JwtPayload;
        if (!data) throw new Error("Token not formatted correctly");

        return {
            Email: data['email'],
            FirstName: data['firstName'],
            LastName: data['lastName'],
            Roles: data['roles']?.split(',')?.filter((role: string) => !!role)
        }
    }

    private getConfig() {
        if (this.config) return this.config;
        const cwd = process.cwd();
        Logger.info('Server CWD', cwd);
        Logger.info('Loading Private Key File: ', process.env.JWT_PRIVATE_KEY_FILE ?? 'JWT_PRIVATE_KEY_FILE NOT PROVIDED');
        const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILE ?? '')
         
        const privateSecret = {
            key: privateKey, 
            passphrase: process.env.privateKeyPassphrase ?? '',
            }
        const signOptions: SignOptions = {
            algorithm: 'RS512',
            expiresIn: '14d'
            }

        Logger.info('Loading Public Key File: ', process.env.JWT_PRIVATE_KEY_FILE ?? 'JWT_PUBLIC_KEY_FILE NOT PROVIDED');
        const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_FILE ?? '')
        const verifyOptions: VerifyOptions = {
            algorithms: ['RS512'],
            issuer: process.env.JWT_ISSUER,
        }

        this.config = {
            privateSecret,
            publicKey,
            signOptions,
            verifyOptions,
        }

        return this.config;
    }
}
