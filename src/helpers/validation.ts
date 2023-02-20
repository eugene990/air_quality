import { validate, ValidationError } from '@nestjs/class-validator';
import { plainToClass } from 'class-transformer';
import { BodyValidationError, QueryStringValidationError } from './api-errors';

type ClassType<T> = new (...arguments_: unknown[]) => T;
type CustomValidationError = { property: string; children?: CustomValidationError[]; errorsDescription?: string[] };

/**
 * Converts errors from class-validator format to custom format for displaying
 * @param errors Errors array returned from validator library
 */
const mapErrors = (errors: ValidationError[]): CustomValidationError[] =>
  errors.map((error: ValidationError) => {
    return {
      property: error.property,
      children: error.children && error.children.length > 0 ? mapErrors(error.children) : undefined,
      errorsDescription: error.constraints ? Object.values(error.constraints) : undefined,
    };
  });

/**
 * Parses and validates object against class model. If validation is incorrect throws a `BodyValidationError`
 * @param modelType Model class
 * @param object Object to be validated
 */
export const validateBody = async <T extends object>(modelType: ClassType<T>, object: object): Promise<T> => {
  const model = plainToClass(modelType, object);

  const errors = await validate(model, {
    validationError: { target: false, value: false },
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const validationError = new BodyValidationError();
    validationError.errors = mapErrors(errors);
    throw validationError;
  }

  return model;
};

/**
 * Parses and validates object against class model. If validation is incorrect throws a `QueryStringValidationError`
 * @param modelType Model class
 * @param object Object to be validated
 */
export const validateQuery = async <T extends object>(modelType: ClassType<T>, object: object): Promise<T> => {
  const model = plainToClass(modelType, object);

  const errors = await validate(model, { validationError: { target: false } });

  if (errors.length > 0) {
    const validationError = new QueryStringValidationError();
    validationError.errors = mapErrors(errors);
    throw validationError;
  }

  return model;
};
