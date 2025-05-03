export class InvalidDriverActionError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = "InvalidDriverActionError";

    Object.setPrototypeOf(this, InvalidDriverActionError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidDriverActionError);
    }
  }
}
