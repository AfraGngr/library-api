import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';
import AppError from '../utils/appError';

export function validateBodyMiddleware(schema: z.ZodSchema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedBody = schema.parse(req.body);
            req.body = validatedBody;
            next();
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return next(new AppError(400, error.issues.map((issue) => issue.message).join(' ')));
            }
            return next(new AppError(500, 'Something went wrong !'));
        }
    };
}
export function validateParamsMiddleware(schema: z.ZodSchema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return next(new AppError(400, error.issues.map((issue) => issue.message).join(' ')));
            }
            return next(new AppError(500, 'Something went wrong !'));
        }
    };
}