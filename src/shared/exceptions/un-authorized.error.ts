export class UnAuthorizedError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnAuthorizedError.prototype)
    }
}