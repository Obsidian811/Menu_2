import React from 'react';
import { MenuItem } from '../lib/types';

interface FoodItemProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export function FoodItem({ item, onClick }: FoodItemProps) {
  return (
    <div 
      className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white"
      onClick={() => onClick(item)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600 mt-1">{item.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          item.type === 'veg' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.type}
        </span>
      </div>
      <div className="mt-2 font-semibold">₹{item.price.toFixed(2)}</div>
    </div>
  );
}

interface FoodDetailsModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function FoodDetailsModal({ item, onClose }: FoodDetailsModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="relative h-64 w-full">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              item.type === 'veg' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.type}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{item.longDescription || item.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">₹{item.price.toFixed(2)}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryButtonProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryButton({ name, isSelected, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-black text-white'
          : 'bg-gray-100 text-black hover:bg-gray-200'
      }`}
    >
      {name}
    </button>
  );
}