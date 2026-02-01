import Joi from 'joi';

export const createMenuItemSchema = Joi.object({
    name: Joi.string().required().min(2).max(100).trim(),
    description: Joi.string().max(500).trim().allow(''),
    category: Joi.string()
        .valid('Appetizer', 'Main Course', 'Dessert', 'Beverage')
        .required(),
    price: Joi.number().required().positive().precision(2),
    ingredients: Joi.array().items(Joi.string().trim()).default([]),
    isAvailable: Joi.boolean().default(true),
    preparationTime: Joi.number().integer().positive().allow(null),
    imageUrl: Joi.string().uri().allow('', null),
});

export const updateMenuItemSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim(),
    description: Joi.string().max(500).trim().allow(''),
    category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Beverage'),
    price: Joi.number().positive().precision(2),
    ingredients: Joi.array().items(Joi.string().trim()),
    isAvailable: Joi.boolean(),
    preparationTime: Joi.number().integer().positive().allow(null),
    imageUrl: Joi.string().uri().allow('', null),
}).min(1); // At least one field required for update

export const menuQuerySchema = Joi.object({
    category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Beverage'),
    isAvailable: Joi.boolean(),
    minPrice: Joi.number().positive(),
    maxPrice: Joi.number().positive(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
});

export const searchQuerySchema = Joi.object({
    q: Joi.string().required().min(1).max(100).trim(),
});
