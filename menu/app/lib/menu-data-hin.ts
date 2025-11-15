'use client';

import { MenuItem } from './types';

// This is just mock data for now. In a real application, this would be fetched from an API
const mockMenuData: Record<string, MenuItem[]> = {

Hindi: [
    {
      id: 's1',
      name: 'चिकन विंग्स',
      description: 'मसालेदार बीबीक्यू चिकन विंग्स ब्लू चीज़ डिप के साथ',
      price: 399,
      category: 'starters',
      type: 'non-veg',
      image: '/images/chicken-wings.jpg',
      longDescription: 'हमारी विशेष चिकन विंग्स जो 24 घंटे मैरीनेट की गई हैं और परफेक्ट ग्रिल की गई हैं। होममेड ब्लू चीज़ डिप और सेलरी स्टिक्स के साथ परोसी जाती हैं।',
      language: 'Hindi'
    },
    {
      id: 's2',
      name: 'पनीर टिक्का',
      description: 'भारतीय मसालों के साथ ग्रिल्ड पनीर',
      price: 349,
      category: 'starters',
      type: 'veg',
      image: '/images/paneer-tikka.jpg',
      longDescription: 'ताजा पनीर दही और भारतीय मसालों में मैरीनेट किया गया, तंदूर में पकाया गया। पुदीने की चटनी और प्याज के रिंग्स के साथ परोसा जाता है।',
      language: 'Hindi'
    },
    {
      id: 'm1',
      name: 'बटर चिकन',
      description: 'मखमली टमाटर ग्रेवी में नरम चिकन',
      price: 499,
      category: 'main-course',
      type: 'non-veg',
      image: '/images/butter-chicken.jpg',
      longDescription: 'क्लासिक नॉर्थ इंडियन डिश जिसमें नरम चिकन के टुकड़े समृद्ध और क्रीमी टमाटर ग्रेवी में पकाए जाते हैं, मक्खन और क्रीम के साथ फिनिश किया जाता है।',
      language: 'Hindi'
    },
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