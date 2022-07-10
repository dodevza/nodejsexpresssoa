# NodeJS Express and TSOA

## Getting Started

Ensure you have the latest LTS version of NodeJs installed.

Install npm packages

```bash
npm install
```

Start the server

```bash
npm start 
```

Alternatively debug in VSCode just start a debuggin session with F5

Run unit tests

```bash
npm test
```

Run static code analysis

```bash
npm run lint
```

## Packages & Middleware

* expressjs - Webserver
* tsoa - Generate routes from controllers and generate swagger.json files
* jest - Test framework
* eslint - Static Code Analysis
* jsonwebtoken - Generate JWT Bearer tokens and use to validate tokens (Single server usage)
* tsyringe - IoC Inversion of Control for dependency injection
* swagger-ui-express - Provide SwaggerUI to discover / test endpoints
* dotenv-flow - Inject environment variables using .env / .env.local / .env.development / .env.development.local files

## Generated Routes

TSOA automaticall generate expressjs routes and is located under `src/middleware/routes.ts`
For TSOA to discover the routes there is two things you need to ensure.

Please checkout the [TSOA Comunity Website](https://tsoa-community.github.io/docs) for usage and examples.

1. The path of the controller is specified in the `tsoa.config` in `routes.controllerPathGlobs`.
2. The controller is included int the index.ts file inside the `src/controllers` folder. Or referenced directly or indirectly in the startup.ts file.

## JWT Auth Bearer Security

This example project use jwt bearer authentication without an external OpenID Connect / OAuth server

### Generating PEM files for Production Use

See [Generating PEM files](/config/jwt/README.md)

### RBAC with Features

For this example project we are using a basic User -> Role -> Feature permission structure

To allow TSOA to generate the required authorization OpenAPI documents and include authorization checks in the routes it generates we need to decorate the Controller or the Methods of the controller with a @Security decorator

```typescript
@Route("users")
export class UsersController {
    @Security("features", ["users.list"])
    @Get("/")
    public async getAll(): Promise<PagedData<User>> {
      return this.userRepository.getAll();
    }

    @Security("features", ["users.add"])
    @Post("/")
    public async create(@Body()payload: User): Promise<SuccessMessage> {
      return this.userRepository.create(payload);
    }

    @Security("features", ["users.edit"])
    @Put("/{id}")
    public async update(@Path()id: number, @Body()payload: User): Promise<SuccessMessage> {
      payload.Id = id ?? payload.Id;
      return this.userRepository.update(payload);
    }

    @Security("features", ["users.delete"])
    @Delete("/{id}")
    public async update(@Path()id: number): Promise<SuccessMessage> {
      return this.userRepository.delete(id);
    }
}
```

The example project use relation entities to represent Users, Roles and Features. The data below is what you would expect after combining the roles and features.

```yaml
roles:
  Admin:
    - users.list
    - users.add
    - users.edit
    - users.delete
  SalesRep:
    - users.list
```

After combining the users and the roles you will have a mapping to each feature

```yaml
users:
  Mike: 
    roles:
      - Admin
      - SalesRep
    combinedFeatures:
      - users.list
      - users.add
      - users.edit
      - users.delete
  Steve:
    roles:
      - SalesRep
    combinedFeatures:
      - users.list
```

### Authentication / Authorization Middleware

When TSOA generates the routes, it allows for a IoC container module to be used to inject services into the controllers.

For this project we have created a module that creates a tsyringe childContainer. This will allow you to specify ```@scoped(Lifecycle.ContainerScoped)``` on your services and can expect that a instance of that service will be created for only once per request.

In addition to this an ```HttpContextService``` has been added to get values from the the request object. This allows the ```AuthService``` to provide you with a ```getCurrentUserClaims``` method. That can be used to identify the current user without accessing the request objects anywhere. The business logic stays clean of any middleware code.

## Exception Handling

A catch all error handler has been added and caters for specic erros

* ValidateError: TSOA
* BusinessRuleError: [business-rule.error.ts](/src/shared/exceptions/business-rule.ts)
* NotFoundError: [notfound.error.ts](/src/shared/exceptions/notfound.error.ts)
* UnAuthorizedError: [un-authorized.error.ts](/src/shared/exceptions/un-authorized.error.ts)
* UnAuthenticatedError: [un-authenticated.error.ts](/src/shared/exceptions/un-authorized.error.ts)
* Error

## Logging

All request are being logged using Morgan library
All exception being thrown are logged in the exception handler

Initialize the logger in ```startup.ts```

```typescript
import { Logger } from "./shared/logging/logger";

Logger.initialize();

```

The logger is a work in progress but the API to call the logger will unlikely change
Please use the ```Logger``` class provided instead of using console.log directly.

## CORS

To be completed with Orgin Allow List etc

## Testing

For unit testing the project makes use of [Jest](https://jestjs.io/)

A very usefull vscode extention to run the unit tests insde vscode is [vscode-jest-runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)

Running tests in the command line

```bash
npm test
```

To view the test coverage

```bash
npm run coverage
```
