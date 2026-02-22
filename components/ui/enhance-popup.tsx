'use client';

import { useState } from 'react';
import { Button } from './button';
import { X, Sparkles } from 'lucide-react';

interface EnhancePopupProps {
  variations: string[];
  onSelect: (selectedText: string) => void;
  onCancel: () => void;
  position?: { top: number; left: number };
}

export function EnhancePopup({ variations, onSelect, onCancel, position }: EnhancePopupProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = () => {
    if (selectedIndex !== null && variations[selectedIndex]) {
      onSelect(variations[selectedIndex]);
    }
  };

  const popupStyle = position
    ? {
        position: 'fixed' as const,
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 10000,
      }
    : {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
      };

  return (
    <div
      className="bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-6 min-w-[500px] max-w-[700px]"
      style={popupStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI-Enhanced Suggestions</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
        {variations.map((variation, index) => (
          <label
            key={index}
            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedIndex === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="variation"
              value={index}
              checked={selectedIndex === index}
              onChange={() => setSelectedIndex(index)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Option {index + 1}
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {variation}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSelect}
          disabled={selectedIndex === null}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Select
        </Button>
      </div>
    </div>
  );
}

