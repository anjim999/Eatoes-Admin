import Joi from 'joi';

export const createOrderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                menuItemId: Joi.string().required().length(24), // MongoDB ObjectId length
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
    customerName: Joi.string().required().min(2).max(100).trim(),
    tableNumber: Joi.number().integer().min(1).max(100).required(),
});

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled')
        .required(),
});

export const orderQuerySchema = Joi.object({
    status: Joi.string().valid('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
});
