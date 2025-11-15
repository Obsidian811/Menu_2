'use client';

import { MenuItem } from './types';

// This is just mock data for now. In a real application, this would be fetched from an API
const mockMenuData: Record<string, MenuItem[]> = {
  English: [
    // Starters
    {
      id: 's1',
      name: 'Chicken Wings',
      description: 'Spicy BBQ chicken wings with blue cheese dip',
      price: 399,
      category: 'starters',
      type: 'non-veg',
      image: '/images/chicken-wings.jpg',
      longDescription: 'Our signature chicken wings marinated for 24 hours and grilled to perfection. Served with homemade blue cheese dip and celery sticks.',
      language: 'English'
    },
    {
      id: 's2',
      name: 'Crispy Calamari',
      description: 'Golden fried calamari rings with tartar sauce',
      price: 449,
      category: 'starters',
      type: 'non-veg',
      image: '/images/calamari.jpg',
      longDescription: 'Fresh squid rings coated in our special seasoned batter and fried until golden. Served with house-made tartar sauce and lemon wedges.',
      language: 'English'
    },
    {
      id: 's3',
      name: 'Bruschetta',
      description: 'Classic Italian appetizer with tomatoes and basil',
      price: 299,
      category: 'starters',
      type: 'veg',
      image: '/images/bruschetta.jpg',
      longDescription: 'Toasted artisanal bread topped with fresh tomatoes, garlic, basil, and extra virgin olive oil. Finished with aged balsamic glaze.',
      language: 'English'
    },
    {
      id: 's4',
      name: 'Spinach & Artichoke Dip',
      description: 'Creamy dip served with tortilla chips',
      price: 349,
      category: 'starters',
      type: 'veg',
      image: '/images/spinach-dip.jpg',
      longDescription: 'A warm, creamy blend of spinach, artichoke hearts, and three cheeses. Served with crispy tortilla chips and fresh salsa.',
      language: 'English'
    },
    {
      id: 's5',
      name: 'Chicken Lollipops',
      description: 'Spicy chicken lollipops with tangy sauce',
      price: 399,
      category: 'starters',
      type: 'non-veg',
      image: '/images/chicken-lollipops.jpg',
      longDescription: 'Spicy chicken lollipops marinated in a blend of hot spices and served with a tangy dipping sauce.',
      language: 'English'
    },

    // Main Course
    {
      id: 'm1',
      name: 'Grilled Ribeye Steak',
      description: '12oz premium ribeye with garlic butter',
      price: 1299,
      category: 'main-course',
      type: 'non-veg',
      image: '/images/ribeye.jpg',
      longDescription: 'Premium aged ribeye grilled to your preference, topped with herb garlic butter. Served with roasted potatoes and seasonal vegetables.',
      language: 'English'
    },
    {
      id: 'm2',
      name: 'Salmon Wellington',
      description: 'Fresh salmon wrapped in puff pastry',
      price: 899,
      category: 'main-course',
      type: 'non-veg',
      image: '/images/salmon-wellington.jpg',
      longDescription: 'Fresh Atlantic salmon with spinach and mushroom duxelles, wrapped in golden puff pastry. Served with lemon butter sauce.',
      language: 'English'
    },
    {
      id: 'm3',
      name: 'Wild Mushroom Risotto',
      description: 'Creamy Italian risotto with assorted mushrooms',
      price: 649,
      category: 'main-course',
      type: 'veg',
      image: '/images/mushroom-risotto.jpg',
      longDescription: 'Arborio rice slowly cooked with white wine and vegetable broth, finished with mixed wild mushrooms, parmesan, and truffle oil.',
      language: 'English'
    },
    {
      id: 'm4',
      name: 'Mediterranean Pasta',
      description: 'Fresh pasta with roasted vegetables',
      price: 549,
      category: 'main-course',
      type: 'veg',
      image: '/images/med-pasta.jpg',
      longDescription: 'Handmade pasta tossed with roasted Mediterranean vegetables, olives, and fresh herbs in a light white wine sauce.',
      language: 'English'
    },

    // Drinks
    {
      id: 'd1',
      name: 'Tropical Paradise',
      description: 'Fresh fruit juice blend with mint',
      price: 199,
      category: 'drinks',
      type: 'veg',
      image: '/images/tropical-juice.jpg',
      longDescription: 'Refreshing blend of pineapple, mango, and orange juice with fresh mint leaves and a splash of lime.',
      language: 'English'
    },
    {
      id: 'd2',
      name: 'Berry Blast Smoothie',
      description: 'Mixed berry smoothie with yogurt',
      price: 249,
      category: 'drinks',
      type: 'veg',
      image: '/images/berry-smoothie.jpg',
      longDescription: 'A creamy blend of strawberries, blueberries, raspberries, and Greek yogurt. Topped with chia seeds.',
      language: 'English'
    },
    {
      id: 'd3',
      name: 'Classic Masala Chai',
      description: 'Indian spiced tea with milk',
      price: 129,
      category: 'drinks',
      type: 'veg',
      image: '/images/masala-chai.jpg',
      longDescription: 'Traditional Indian tea brewed with aromatic spices and herbs, served with milk.',
      language: 'English'
    },

    // Alcohol
    {
      id: 'a1',
      name: 'Signature Martini',
      description: 'Classic gin martini with a twist',
      price: 449,
      category: 'alcohol',
      type: 'non-veg',
      image: '/images/martini.jpg',
      longDescription: 'Premium gin, dry vermouth, and our secret blend of aromatics. Served with olives or a lemon twist.',
      language: 'English'
    },
    {
      id: 'a2',
      name: 'Craft Beer Flight',
      description: 'Selection of four local craft beers',
      price: 499,
      category: 'alcohol',
      type: 'non-veg',
      image: '/images/beer-flight.jpg',
      longDescription: 'A curated selection of four local craft beers. Perfect for discovering new favorites.',
      language: 'English'
    },
    {
      id: 'a3',
      name: 'Red Wine Sangria',
      description: 'Spanish-style sangria with fresh fruits',
      price: 399,
      category: 'alcohol',
      type: 'non-veg',
      image: '/images/sangria.jpg',
      longDescription: 'Red wine infused with citrus fruits, apples, and our special blend of spirits. Served over ice with fresh fruit.',
      language: 'English'
    },

    // Desserts
    {
      id: 'ds1',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 349,
      category: 'desserts',
      type: 'veg',
      image: '/images/lava-cake.jpg',
      longDescription: 'Rich chocolate cake with a gooey molten center. Served with vanilla ice cream and berry compote.',
      language: 'English'
    },
    {
      id: 'ds2',
      name: 'New York Cheesecake',
      description: 'Classic cheesecake with berry sauce',
      price: 399,
      category: 'desserts',
      type: 'veg',
      image: '/images/cheesecake.jpg',
      longDescription: 'Creamy New York style cheesecake with a graham cracker crust. Topped with fresh berry sauce.',
      language: 'English'
    },
    {
      id: 'ds3',
      name: 'Tiramisu',
      description: 'Italian coffee-flavored dessert',
      price: 379,
      category: 'desserts',
      type: 'veg',
      image: '/images/tiramisu.jpg',
      longDescription: 'Layers of coffee-soaked ladyfingers and mascarpone cream. Dusted with cocoa powder.',
      language: 'English'
    },
    {
      id: 'ds4',
      name: 'Ice Cream Sundae',
      description: 'Assorted ice creams with toppings',
      price: 299,
      category: 'desserts',
      type: 'veg',
      image: '/images/sundae.jpg',
      longDescription: 'Three scoops of premium ice cream with hot fudge, caramel, nuts, whipped cream, and a cherry on top.',
      language: 'English'
    }
  ],
};

export async function getMenuItems(language: string): Promise<MenuItem[]> {
  // In a real application, this would be an API call or database query
  return mockMenuData[language] || [];
}

export async function getCategoryItems(items: MenuItem[], category: string): Promise<MenuItem[]> {
  const normalizedCategory = category.toLowerCase();
  return items
    .filter(item => item.category.toLowerCase() === normalizedCategory)
    .sort((a, b) => {
      if (a.type === 'non-veg' && b.type === 'veg') return -1;
      if (a.type === 'veg' && b.type === 'non-veg') return 1;
      return 0;
    });
}