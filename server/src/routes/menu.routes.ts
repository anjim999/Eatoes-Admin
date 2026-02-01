import { Router } from 'express';
import { menuController } from '../controllers/menu.controller';
import { validate } from '../middleware/validate';
import {
    createMenuItemSchema,
    updateMenuItemSchema,
    menuQuerySchema,
    searchQuerySchema,
} from '../validators/menu.validator';

const router = Router();

// GET /api/menu - Get all menu items with filters
router.get('/', menuController.getAll);

// GET /api/menu/search - Search menu items (MUST be before :id route)
router.get('/search', menuController.search);

// GET /api/menu/top-sellers - Get top selling items (Challenge 2)
router.get('/top-sellers', menuController.getTopSellers);

// GET /api/menu/:id - Get single menu item
router.get('/:id', menuController.getById);

// POST /api/menu - Create new menu item
router.post('/', validate(createMenuItemSchema), menuController.create);

// PUT /api/menu/:id - Update menu item
router.put('/:id', validate(updateMenuItemSchema), menuController.update);

// DELETE /api/menu/:id - Delete menu item
router.delete('/:id', menuController.delete);

// PATCH /api/menu/:id/availability - Toggle availability (Challenge 3 - Optimistic UI)
router.patch('/:id/availability', menuController.toggleAvailability);

export default router;
