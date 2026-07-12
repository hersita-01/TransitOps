import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { asyncHandler } from '../utils/async-handler';

interface ValidationSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (schema: ValidationSchema) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (schema.body) {
      req.body = await schema.body.parseAsync(req.body);
    }
    if (schema.query) {
      req.query = await schema.query.parseAsync(req.query);
    }
    if (schema.params) {
      req.params = await schema.params.parseAsync(req.params);
    }
    next();
  });
};
