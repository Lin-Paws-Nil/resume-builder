'use client';

import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    preview: 'bg-gradient-to-br from-blue-500 to-purple-600',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: 'bg-gradient-to-br from-gray-700 to-gray-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and expressive style',
    preview: 'bg-gradient-to-br from-pink-500 to-orange-500',
  },
];

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border rounded-lg bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
      >
        <h3 className="font-semibold">Select Template</h3>
        {expanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {expanded && (
        <div className="p-4 border-t space-y-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary'
                  : 'hover:bg-accent'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-20 rounded ${template.preview} flex-shrink-0`}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="w-4 h-4 rounded-full bg-primary" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



