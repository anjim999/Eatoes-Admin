import mongoose from 'mongoose';
import { MenuItem } from '../models/MenuItem';
import { Order } from '../models/Order';
import { config } from '../config/env';

const menuItems = [
    // Appetizers
    {
        name: 'Crispy Spring Rolls',
        description: 'Golden fried vegetable spring rolls served with sweet chili sauce',
        category: 'Appetizer',
        price: 8.99,
        ingredients: ['cabbage', 'carrots', 'mushrooms', 'glass noodles', 'spring roll wrappers'],
        isAvailable: true,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76978e8e5e0?w=400',
    },
    {
        name: 'Garlic Butter Shrimp',
        description: 'Succulent shrimp sautéed in garlic butter with herbs',
        category: 'Appetizer',
        price: 12.99,
        ingredients: ['shrimp', 'garlic', 'butter', 'parsley', 'lemon'],
        isAvailable: true,
        preparationTime: 12,
        imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400',
    },
    {
        name: 'Bruschetta Trio',
        description: 'Toasted bread topped with tomato basil, mushroom, and olive tapenade',
        category: 'Appetizer',
        price: 9.99,
        ingredients: ['baguette', 'tomatoes', 'basil', 'mushrooms', 'olives', 'garlic'],
        isAvailable: true,
        preparationTime: 10,
        imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    },
    {
        name: 'Stuffed Jalapeños',
        description: 'Cream cheese stuffed jalapeños wrapped in crispy bacon',
        category: 'Appetizer',
        price: 10.99,
        ingredients: ['jalapeños', 'cream cheese', 'bacon', 'cheddar'],
        isAvailable: false,
        preparationTime: 18,
        imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
    },

    // Main Courses
    {
        name: 'Grilled Ribeye Steak',
        description: '12oz prime ribeye grilled to perfection with herb butter',
        category: 'Main Course',
        price: 34.99,
        ingredients: ['ribeye steak', 'herb butter', 'garlic', 'rosemary', 'thyme'],
        isAvailable: true,
        preparationTime: 25,
        imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    },
    {
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with lemon dill sauce and seasonal vegetables',
        category: 'Main Course',
        price: 28.99,
        ingredients: ['salmon', 'lemon', 'dill', 'asparagus', 'cherry tomatoes'],
        isAvailable: true,
        preparationTime: 20,
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    },
    {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast with marinara and melted mozzarella',
        category: 'Main Course',
        price: 22.99,
        ingredients: ['chicken breast', 'breadcrumbs', 'marinara sauce', 'mozzarella', 'parmesan'],
        isAvailable: true,
        preparationTime: 22,
        imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
    },
    {
        name: 'Mushroom Risotto',
        description: 'Creamy arborio rice with wild mushrooms and truffle oil',
        category: 'Main Course',
        price: 19.99,
        ingredients: ['arborio rice', 'wild mushrooms', 'parmesan', 'white wine', 'truffle oil'],
        isAvailable: true,
        preparationTime: 30,
        imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
    },
    {
        name: 'Lobster Linguine',
        description: 'Fresh linguine with lobster meat in a creamy tomato sauce',
        category: 'Main Course',
        price: 38.99,
        ingredients: ['linguine', 'lobster', 'tomatoes', 'cream', 'garlic', 'basil'],
        isAvailable: false,
        preparationTime: 28,
        imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
    },

    // Desserts
    {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
        category: 'Dessert',
        price: 9.99,
        ingredients: ['ladyfingers', 'mascarpone', 'espresso', 'cocoa', 'eggs'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98c038c29?w=400',
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        category: 'Dessert',
        price: 11.99,
        ingredients: ['dark chocolate', 'butter', 'eggs', 'flour', 'vanilla ice cream'],
        isAvailable: true,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    },
    {
        name: 'Crème Brûlée',
        description: 'Rich vanilla custard with a caramelized sugar crust',
        category: 'Dessert',
        price: 8.99,
        ingredients: ['cream', 'vanilla', 'eggs', 'sugar'],
        isAvailable: true,
        preparationTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
    },

    // Beverages
    {
        name: 'Fresh Lemonade',
        description: 'House-made lemonade with fresh mint',
        category: 'Beverage',
        price: 4.99,
        ingredients: ['lemon', 'sugar', 'mint', 'sparkling water'],
        isAvailable: true,
        preparationTime: 3,
        imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    },
    {
        name: 'Mango Smoothie',
        description: 'Tropical mango blended with yogurt and honey',
        category: 'Beverage',
        price: 6.99,
        ingredients: ['mango', 'yogurt', 'honey', 'ice'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
    },
    {
        name: 'Espresso Martini',
        description: 'Vodka, coffee liqueur, and fresh espresso',
        category: 'Beverage',
        price: 12.99,
        ingredients: ['vodka', 'kahlua', 'espresso', 'simple syrup'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1545438102-799c3991ffef?w=400',
    },
    {
        name: 'Berry Blast Shake',
        description: 'Mixed berries blended with vanilla ice cream',
        category: 'Beverage',
        price: 7.99,
        ingredients: ['strawberries', 'blueberries', 'raspberries', 'vanilla ice cream', 'milk'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
    },
];

const generateOrderNumber = () => {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
};

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await MenuItem.deleteMany({});
        await Order.deleteMany({});

        // Insert menu items
        console.log('Seeding menu items...');
        const insertedMenuItems = await MenuItem.insertMany(menuItems);
        console.log(`Inserted ${insertedMenuItems.length} menu items`);

        // Create sample orders
        console.log('Seeding orders...');
        const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'] as const;
        const customerNames = [
            'John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis',
            'James Wilson', 'Jessica Martinez', 'David Anderson', 'Ashley Thomas',
            'Robert Taylor', 'Amanda White'
        ];

        const orders = [];
        for (let i = 0; i < 12; i++) {
            // Random 1-4 items per order
            const numItems = Math.floor(Math.random() * 4) + 1;
            const orderItems = [];
            let totalAmount = 0;

            for (let j = 0; j < numItems; j++) {
                const randomItem = insertedMenuItems[Math.floor(Math.random() * insertedMenuItems.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const itemTotal = randomItem.price * quantity;

                orderItems.push({
                    menuItem: randomItem._id,
                    quantity,
                    price: randomItem.price,
                });
                totalAmount += itemTotal;
            }

            orders.push({
                orderNumber: generateOrderNumber(),
                items: orderItems,
                totalAmount: Math.round(totalAmount * 100) / 100,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                customerName: customerNames[i % customerNames.length],
                tableNumber: Math.floor(Math.random() * 20) + 1,
            });
        }

        const insertedOrders = await Order.insertMany(orders);
        console.log(`Inserted ${insertedOrders.length} orders`);

        console.log('\n✅ Database seeded successfully!');
        console.log(`   - ${insertedMenuItems.length} Menu Items`);
        console.log(`   - ${insertedOrders.length} Orders`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
