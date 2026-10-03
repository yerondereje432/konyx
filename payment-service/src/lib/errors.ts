export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, "not_found", message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, "validation_error", message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, "unauthorized", message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, "conflict", message);
  }
}

export class GatewayError extends AppError {
  constructor(message: string) {
    super(502, "gateway_error", message);
  }
}

export class IllegalTransitionError extends AppError {
  constructor(from: string, to: string) {
    super(409, "illegal_transition", `Illegal payment state transition: ${from} -> ${to}`);
  }
}
