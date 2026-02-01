import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';

class OrderController {
    // GET /api/orders - Get all orders with filters and pagination
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await orderService.getAll(req.query);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/stats - Get order statistics
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await orderService.getStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/:id - Get single order with details
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderService.getById(req.params.id);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/orders - Create new order
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderService.create(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/orders/:id/status - Update order status
    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.body;
            const order = await orderService.updateStatus(req.params.id, status);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }
}

export const orderController = new OrderController();
