export class UnAuthenticatedError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnAuthenticatedError.prototype)
    }
}