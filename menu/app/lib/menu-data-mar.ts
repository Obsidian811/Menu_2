'use client';

import { MenuItem } from './types';

// This is just mock data for now. In a real application, this would be fetched from an API
const mockMenuData: Record<string, MenuItem[]> = {
    Marathi: [
    {
      id: 's1',
      name: 'कोथिंबीर वडे',
      description: 'कोथिंबीर आणि मसाल्यांचे टेस्टी वडे',
      price: 199,
      category: 'starters',
      type: 'veg',
      image: '/images/kothimbir-vada.jpg',
      longDescription: 'ताज्या कोथिंबीर मध्ये मसाले घालून बनवलेले क्रिस्पी वडे. चटणीसोबत सर्व्ह केले जातात.',
      language: 'Marathi'
    },
    {
      id: 'm1',
      name: 'मटण रस्सा',
      description: 'कोल्हापुरी स्टाईल मटण रस्सा',
      price: 449,
      category: 'main-course',
      type: 'non-veg',
      image: '/images/mutton-rassa.jpg',
      longDescription: 'कोल्हापुरी मसाल्यात शिजवलेले टेंडर मटण. गरमागरम भाकरी किंवा वरणभातासोबत सर्व्ह केले जाते.',
      language: 'Marathi'
    },
    {
      id: 'd1',
      name: 'सोल कढी',
      description: 'कोकणी स्टाईल कोकम सरबत',
      price: 129,
      category: 'drinks',
      type: 'veg',
      image: '/images/sol-kadhi.jpg',
      longDescription: 'कोकम आणि नारळाच्या दुधापासून बनवलेले पारंपारिक कोकणी पेय. जेवणानंतर पचनासाठी उत्तम.',
      language: 'Marathi'
    },
  ]
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