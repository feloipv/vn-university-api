export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: any[]
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
