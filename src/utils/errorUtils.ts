export class CustomError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode = 500, errors?: any[]) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
