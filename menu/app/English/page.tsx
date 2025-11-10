'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../lib/types';
import { getMenuItems, getCategoryItems } from '../lib/db';
import { FoodItem, FoodDetailsModal, CategoryButton } from '../components/MenuComponents';

const categories: { id: MenuCategory; name: string }[] = [
  { id: 'starters', name: 'Starters' },
  { id: 'main-course', name: 'Main Course' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'alcohol', name: 'Alcohol' },
  { id: 'desserts', name: 'Desserts' },
];

export default function EnglishMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('starters');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function loadMenuItems() {
      const items = await getMenuItems('English');
      setMenuItems(items);
    }
    loadMenuItems();
  }, []);

  const categoryItems = getCategoryItems(menuItems, selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Our Menu</h1>
        
        {/* Category Navigation */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              name={category.name}
              isSelected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      </header>

      {/* Menu Items Grid */}
      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryItems.map(item => (
            <FoodItem
              key={item.id}
              item={item}
              onClick={setSelectedItem}
            />
          ))}
        </div>
      </main>

      {/* Item Details Modal */}
      <FoodDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}