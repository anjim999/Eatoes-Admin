import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import {
    createOrderSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
} from '../validators/order.validator';

const router = Router();

// GET /api/orders - Get all orders with filters and pagination
router.get('/', orderController.getAll);

// GET /api/orders/stats - Get order statistics (MUST be before :id)
router.get('/stats', orderController.getStats);

// GET /api/orders/:id - Get single order with details
router.get('/:id', orderController.getById);

// POST /api/orders - Create new order
router.post('/', validate(createOrderSchema), orderController.create);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', validate(updateOrderStatusSchema), orderController.updateStatus);

export default router;
