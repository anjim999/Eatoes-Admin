import { Request, Response, NextFunction } from 'express';
import { menuService } from '../services/menu.service';

class MenuController {
    // GET /api/menu - Get all menu items with filters
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await menuService.getAll(req.query);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/menu/search?q=query - Search menu items
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const { q } = req.query;
            const results = await menuService.search(q as string);
            res.json({ success: true, data: results });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/menu/top-sellers - Get top selling items (Challenge 2)
    async getTopSellers(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const results = await menuService.getTopSellers(limit);
            res.json({ success: true, data: results });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/menu/:id - Get single menu item
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const item = await menuService.getById(req.params.id);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/menu - Create new menu item
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const item = await menuService.create(req.body);
            res.status(201).json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/menu/:id - Update menu item
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const item = await menuService.update(req.params.id, req.body);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/menu/:id - Delete menu item
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const item = await menuService.delete(req.params.id);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }
            res.json({ success: true, message: 'Menu item deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/menu/:id/availability - Toggle availability
    async toggleAvailability(req: Request, res: Response, next: NextFunction) {
        try {
            const item = await menuService.toggleAvailability(req.params.id);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Menu item not found' });
            }
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    }
}

export const menuController = new MenuController();
