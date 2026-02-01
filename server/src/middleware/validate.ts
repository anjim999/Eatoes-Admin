import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Extend Express Request to include validated data
declare global {
    namespace Express {
        interface Request {
            validated?: {
                body?: any;
                query?: any;
                params?: any;
            };
        }
    }
}

/**
 * Middleware factory to validate request data against a Joi schema
 */
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                })),
            });
        }

        // Store validated values - for body we can directly assign,
        // for query/params we store in req.validated
        if (property === 'body') {
            req.body = value;
        } else {
            // Initialize validated object if not present
            if (!req.validated) {
                req.validated = {};
            }
            req.validated[property] = value;
        }
        next();
    };
};
