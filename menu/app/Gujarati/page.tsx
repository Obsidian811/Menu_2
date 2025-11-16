'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../lib/types';
import { fetchMenuFromGoogleSheet } from '../lib/fetch-google-sheet-guj';
import Image from 'next/image';

const categories: { id: MenuCategory; name: string; icon: string }[] = [
  { id: 'soup', name: 'સૂપ', icon: '🍲' },
  { id: 'starters', name: 'સ્ટાર્ટર્સ', icon: '🍤' },
  { id: 'Snacks', name: 'નાસ્તા', icon: '🥨' },
  { id: 'Sandwich', name: 'સેન્ડવિચ', icon: '🥪' },
  { id: 'Hot beverages', name: 'ગરમ પીણાં', icon: '☕' },
  { id: 'roti-parotha-naan', name: 'રોટી અને નાન', icon: '🫓' },
  { id: 'rice', name: 'ભાતનાં વાનગીઓ', icon: '🍚' },
  { id: 'Punjabi Items', name: 'પંજાબી વિશેષ', icon: '🥘' },
  { id: 'Spl. Punjabi Varieties', name: 'સ્પેશિયલ પંજાબી', icon: '🌶️' },
  { id: 'Sizzlers', name: 'સિઝલર્સ', icon: '🔥' },
  { id: 'Papad / Salad Items', name: 'પાપડ / સલાડ', icon: '🥗' },
  { id: 'Veg. Chinese Varieties (Gravy)', name: 'ચાઈનીઝ (ગ્રેવી)', icon: '🥢' },
  { id: 'Veg. Chinese Varieties', name: 'ચાઈનીઝ વાનગીઓ', icon: '🍜' },
  { id: 'Veg. Chinese Rice Items', name: 'ચાઈનીઝ રાઈસ', icon: '🥡' },
  { id: 'Thali', name: 'થાળી', icon: '🍛' },
  { id: 'cold-drinks', name: 'ઠંડા પીણાં', icon: '🥤' },
  { id: 'milk-shakes', name: 'મિલ્કશેક', icon: '🥛' },
  { id: 'ice-creams-desserts', name: 'આઈસક્રીમ', icon: '🍦' },
  { id: 'alcohol', name: 'દારૂ', icon: '🍷' },
  { id: 'desserts', name: 'મીઠાઈ', icon: '🍰' },
];

export default function EnglishMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('soup');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const GOOGLE_CSV_URL =
    "Sheet url";

  const handleBack = () => {
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  // --------------------------
  // LOAD CSV MENU ITEMS
  // --------------------------
  useEffect(() => {
    async function loadMenuItems() {
      const items = await fetchMenuFromGoogleSheet(GOOGLE_CSV_URL);

      const formatted: MenuItem[] = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: Number(item.price),
        type: item.type,
        description: item.description,
        longDescription: item.longDescription,
        image: item.image,
        language: item.language ?? "english",
      }));

      setMenuItems(formatted);
    }

    loadMenuItems();
  }, []);

  // --------------------------
  // FILTER ITEMS BY CATEGORY
  // --------------------------
  useEffect(() => {
    if (menuItems.length === 0) return;

    const filtered = menuItems.filter(
      (item) => item.category === selectedCategory
    );

    setCategoryItems(filtered);
  }, [menuItems, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center w-full">
        <h1 className="pt-5 text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-200 to-yellow-400 text-transparent bg-clip-text sm:mb-8 sm:w-auto">
          Our Menu
        </h1>

        <button
          onClick={handleBack}
          className="mx-auto mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors z-50 sm:fixed sm:top-4 sm:right-4 sm:mx-0 sm:mb-0"
        >
          Back to Languages
        </button>
      </div>

      {/* CATEGORY TABS */}
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
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
                <span className="font-medium whitespace-nowrap">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MENU ITEMS */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl p-6 flex justify-between items-center transition-all duration-300 border border-gray-700 hover:border-amber-500"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold mr-3">{item.name}</h3>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'veg'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <p className="text-gray-400 mb-2 line-clamp-2">
                  {item.description}
                </p>

                <span className="text-xl font-bold text-amber-400">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="ml-6 flex-shrink-0 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                View Details
              </button>
            </div>
          ))}

          {categoryItems.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-lg">
              No items found in this category.
            </p>
          )}
        </div>
      </main>

      {/* ITEM DETAILS MODAL */}
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

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    selectedItem.type === 'veg'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {selectedItem.type}
                </span>
              </div>

              <p className="text-gray-400 mb-6">
                {selectedItem.longDescription ||
                  selectedItem.description}
              </p>

              <span className="text-3xl font-bold text-amber-400">
                ₹{selectedItem.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
