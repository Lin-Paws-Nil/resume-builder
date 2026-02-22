// Color options for template customization

export interface ColorOption {
  name: string;
  hex: string;
  isPastel: boolean;
}

// Regular colors (vibrant)
export const regularColors: ColorOption[] = [
  { name: 'Blue', hex: '#3B82F6', isPastel: false },
  { name: 'Purple', hex: '#8B5CF6', isPastel: false },
  { name: 'Green', hex: '#10B981', isPastel: false },
  { name: 'Teal', hex: '#14B8A6', isPastel: false },
  { name: 'Indigo', hex: '#6366F1', isPastel: false },
  { name: 'Pink', hex: '#EC4899', isPastel: false },
  { name: 'Red', hex: '#EF4444', isPastel: false },
  { name: 'Orange', hex: '#F97316', isPastel: false },
  { name: 'Amber', hex: '#F59E0B', isPastel: false },
  { name: 'Gray', hex: '#6B7280', isPastel: false },
];

// Pastel colors
export const pastelColors: ColorOption[] = [
  { name: 'Pastel Blue', hex: '#93C5FD', isPastel: true },
  { name: 'Pastel Purple', hex: '#C4B5FD', isPastel: true },
  { name: 'Pastel Green', hex: '#86EFAC', isPastel: true },
  { name: 'Pastel Teal', hex: '#5EEAD4', isPastel: true },
  { name: 'Pastel Pink', hex: '#F9A8D4', isPastel: true },
  { name: 'Pastel Yellow', hex: '#FDE047', isPastel: true },
  { name: 'Pastel Orange', hex: '#FCD34D', isPastel: true },
  { name: 'Pastel Peach', hex: '#FED7AA', isPastel: true },
  { name: 'Pastel Lavender', hex: '#E9D5FF', isPastel: true },
  { name: 'Pastel Mint', hex: '#A7F3D0', isPastel: true },
];

// Clear/No color option
export const clearColor: ColorOption = {
  name: 'Clear',
  hex: 'transparent',
  isPastel: false,
};

// All colors combined
export const allColors: ColorOption[] = [
  clearColor,
  ...regularColors,
  ...pastelColors,
];

// Get text color based on background color
export function getTextColorForBackground(hexColor: string | undefined): string {
  if (!hexColor || hexColor === 'transparent') {
    return '#000000'; // Black text for transparent/clear
  }

  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white text based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Get background color class for Tailwind (if using predefined colors)
export function getBackgroundColorClass(hexColor: string | undefined): string {
  if (!hexColor || hexColor === 'transparent') {
    return 'bg-transparent';
  }
  
  // For custom hex colors, we'll use inline styles
  // This function can be extended to map common colors to Tailwind classes
  return '';
}

// Check if a template uses pastel colors by default
export function isPastelTemplate(templateId: string): boolean {
  const pastelTemplates = ['stellar', 'astralis', 'cosmos'];
  return pastelTemplates.includes(templateId.toLowerCase());
}

// Get color options for a template
export function getColorOptionsForTemplate(templateId: string): ColorOption[] {
  const isPastel = isPastelTemplate(templateId);
  
  if (isPastel) {
    return [clearColor, ...pastelColors];
  }
  
  return [clearColor, ...regularColors, ...pastelColors];
}

// Templates that support color customization
export const colorCustomizableTemplates = [
  'aurora',
  'stellar',
  'modern',
  'creative',
  'aether',
  'nebula',
  'cosmos',
  'lunar',
  'astralis',
  'eclipse',
  'orbit',
];

// Check if template supports color customization
export function supportsColorCustomization(templateId: string): boolean {
  return colorCustomizableTemplates.includes(templateId.toLowerCase());
}

// Lighten a hex color (for borders, etc.)
export function lightenColor(hex: string, percent: number = 0.3): string {
  if (!hex || hex === 'transparent') {
    return '#E5E7EB'; // Default light gray
  }
  
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * percent));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * percent));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

