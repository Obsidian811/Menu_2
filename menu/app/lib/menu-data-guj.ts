'use client';

import { MenuItem } from './types';

// This is just mock data for now. In a real application, this would be fetched from an API
const mockMenuData: Record<string, MenuItem[]> = {
    Gujarati: [
    // Starters
    {
      id: 's1',
      name: 'ધાણા મરચાં પનીર ટિક્કા',
      description: 'તાજા પનીર ને ધાણા અને મરચાં સાથે મસાલામાં મેરીનેટ કરેલું',
      price: 349,
      category: 'starters',
      type: 'veg',
      image: '/images/paneer-tikka.jpg',
      longDescription: 'તાજા પનીર ને ધાણા અને લીલા મરચાં સાથે સ્પેશિયલ મસાલામાં મેરીનેટ કરી તંદૂરમાં બનાવેલું. મીઠી ધાણાની ચટણી સાથે પીરસવામાં આવે છે.',
      language: 'Gujarati'
    },

    //Main Course
    {
      id: 'm1',
      name: 'ઉંધીયુ',
      description: 'પરંપરાગત ગુજરાતી શાકભાજી નું મિશ્રણ',
      price: 299,
      category: 'main-course',
      type: 'veg',
      image: '/images/undhiyu.jpg',
      longDescription: 'વિવિધ શાકભાજી જેવા કે રીંગણ, બટાકા, કેળા, વાલ પાપડી વગેરે ને સ્પેશિયલ મસાલા સાથે સ્લો કુક કરેલું. ગરમાગરم પૂરી અથવા રોટલી સાથે પીરસવામાં આવે છે.',
      language: 'Gujarati'
    },

    // Drinks
    {
      id: 'd1',
      name: 'છાસ',
      description: 'મસાલા નાખેલી તાજી છાસ',
      price: 89,
      category: 'drinks',
      type: 'veg',
      image: '/images/chaas.jpg',
      longDescription: 'તાજી દહીં માંથી બનાવેલી છાસ, જેમાં જીરું, મરચું, આદુ અને કોથમીર નાખેલા છે. ગરમીમાં તાજગી આપનારું શીતળ પીણું.',
      language: 'Gujarati'
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