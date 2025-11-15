'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../lib/types';
import { getMenuItems, getCategoryItems } from '../lib/menu-data-hin';
import Image from 'next/image';

const categories: { id: MenuCategory; name: string; icon: string }[] = [
  { id: 'starters', name: 'स्टार्टर्स', icon: '🍳' },
  { id: 'main-course', name: 'मुख्य भोजन', icon: '🍽️' },
  { id: 'cold-drinks', name: 'पेय पदार्थ', icon: '🥤' },
  { id: 'alcohol', name: 'मदिरा', icon: '🍷' },
  { id: 'desserts', name: 'मिठाई', icon: '🍰' },
];

export default function HindiMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('starters');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);

  const handleBack = () => {
    // Set flag before navigating back
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  useEffect(() => {
    async function loadMenuItems() {
      const items = await getMenuItems('Hindi');
      setMenuItems(items);
    }
    loadMenuItems();
  }, []);

  useEffect(() => {
    async function loadCategoryItems() {
      // Only filter items if menuItems has been loaded
      if (menuItems.length > 0) {
        const items = await getCategoryItems(menuItems, selectedCategory);
        setCategoryItems(items);
      }
    }
    loadCategoryItems();
  }, [menuItems, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <button 
        onClick={handleBack}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors z-50"
      >
        भाषा चयन
      </button>
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-amber-200 to-yellow-400 text-transparent bg-clip-text">
            हमारा मेन्यू
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

      {/* Menu Items List - Single Column (Refactored) */}
      <main className="max-w-4xl mx-auto px-4 py-8"> {/* Adjusted max-width for single column */}
        <div className="grid grid-cols-1 gap-4"> {/* Changed to a single column grid */}
          {categoryItems.map(item => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl p-6 flex justify-between items-center transition-all duration-300 border border-gray-700 hover:border-amber-500"
            >
              {/* Left side: Name, Description, Price */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold mr-3">{item.name}</h3>
                    {/* Veg/Non-Veg Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === 'veg' 
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                    }`}>
                        {item.type === 'veg' ? 'शाकाहारी' : 'मांसाहारी'}
                    </span>
                </div>
                <p className="text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                <span className="text-xl font-bold text-amber-400">₹{item.price.toFixed(2)}</span>
              </div>
              
              {/* Right side: View Details Button */}
              <button
                onClick={() => setSelectedItem(item)}
                className="ml-6 flex-shrink-0 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium whitespace-nowrap"
              >
                विवरण देखें
              </button>
            </div>
          ))}
          {categoryItems.length === 0 && (
             <p className="text-center text-gray-400 py-10 text-lg">इस श्रेणी में कोई आइटम नहीं मिला।</p>
          )}
        </div>
      </main>

      {/* Item Details Modal (Now includes the image) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            {/* Dish Photo is now visible inside the modal */}
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
                  {selectedItem.type === 'veg' ? 'शाकाहारी' : 'मांसाहारी'}
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