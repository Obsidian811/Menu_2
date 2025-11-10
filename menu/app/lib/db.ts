import fs from 'fs/promises';
import path from 'path';
import { MenuItem } from './types';

export async function getMenuItems(language: string): Promise<MenuItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', `${language.toLowerCase()}.csv`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const rows = fileContent.split('\n').slice(1); // Skip header row
    return rows.map(row => {
      const [id, name, description, price, category, type, image, longDescription] = row.split(',');
      return {
        id,
        name,
        description,
        price: parseFloat(price),
        category,
        type: type as 'veg' | 'non-veg',
        image,
        longDescription: longDescription || undefined,
        language: language as 'English' | 'Hindi' | 'Gujarati' | 'Marathi'
      };
    });
  } catch (error) {
    console.error('Error reading menu items:', error);
    return [];
  }
}

export function getCategoryItems(items: MenuItem[], category: string): MenuItem[] {
  return items
    .filter(item => item.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => {
      // Sort non-veg first, then veg
      if (a.type === 'non-veg' && b.type === 'veg') return -1;
      if (a.type === 'veg' && b.type === 'non-veg') return 1;
      return 0;
    });
}