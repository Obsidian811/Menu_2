'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../lib/types';
import { getMenuItems, getCategoryItems } from '../lib/menu-data';
import { FoodItem, FoodDetailsModal, CategoryButton } from '../components/MenuComponents';
import Image from 'next/image';

const categories: { id: MenuCategory; name: string; icon: string }[] = [
  { id: 'starters', name: 'Starters', icon: '🍳' },
  { id: 'main-course', name: 'Main Course', icon: '🍽️' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'alcohol', name: 'Alcohol', icon: '🍷' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export default function EnglishMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('starters');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const handleBack = () => {
    // Set flag before navigating back
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  useEffect(() => {
    async function loadMenuItems() {
      const items = await getMenuItems('English');
      setMenuItems(items);
    }
    loadMenuItems();
  }, []);

  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);

useEffect(() => {
  async function loadCategoryItems() {
    const items = await getCategoryItems(menuItems, selectedCategory);
    setCategoryItems(items);
  }
  loadCategoryItems();
}, [menuItems, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <button 
        onClick={handleBack}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors z-50"
      >
        Back to Languages
      </button>
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-amber-200 to-yellow-400 text-transparent bg-clip-text">
            Our Menu
          </h1>
          
          {/* Category Navigation */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium whitespace-nowrap">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu Items Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryItems.map(item => (
            <div
              key={item.id}
              className="group bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                  item.type === 'veg' 
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                }`}>
                  {item.type}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-400">₹{item.price.toFixed(2)}</span>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="relative h-96">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedItem.name}</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  selectedItem.type === 'veg'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {selectedItem.type}
                </span>
              </div>
              <p className="text-gray-400 mb-6">{selectedItem.longDescription || selectedItem.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-amber-400">₹{selectedItem.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}