// server\src\middlewares\validation.ts
import { Request, Response, NextFunction } from "express"; 
import { validationResult, ValidationError } from "express-validator";
import httpStatus from "http-status";

const extractErrorDetails = (error: ValidationError): { param?: string, message: string } => {
  if (error.type === 'field') {
    return { param: error.path, message: error.msg };
  } else if (error.type === 'alternative' || error.type === 'alternative_grouped') {
    return { message: error.msg };
  } else if (error.type === 'unknown_fields') {
    return { message: error.msg };
  }
  return { message: "Unknown validation error" };
};

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors: { param?: string; message: string }[] = [];

    errors.array().forEach((err: ValidationError) => {
      extractedErrors.push(extractErrorDetails(err));
    });

    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "Validation Error",
      errors: extractedErrors
    });
  }

  next();
};

export default validateRequest;
