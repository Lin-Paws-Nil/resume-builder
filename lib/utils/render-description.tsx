import React from 'react';
import { renderHTML } from './render-html';

export function renderDescription(description: string | string[] | undefined): React.ReactNode {
  if (!description) return null;

  if (Array.isArray(description)) {
    // Legacy array format - check if any item contains HTML
    const hasHTML = description.some(desc => /<[a-z][\s\S]*>/i.test(desc));
    
    if (hasHTML) {
      // Render as HTML
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: description.join('') }}
          className="rich-text-content"
        />
      );
    }
    
    // Legacy array format - plain text
    return (
      <ul className="list-disc list-inside space-y-1">
        {description.map((desc: string, idx: number) => (
          <li key={idx}>{desc}</li>
        ))}
      </ul>
    );
  }

  // Check if description contains HTML tags
  const hasHTML = /<[a-z][\s\S]*>/i.test(description);

  if (hasHTML) {
    // Render as HTML
    return renderHTML(description);
  }

  // New string format with manual bullets (plain text)
  const lines = description.split('\n');
  return (
    <div className="whitespace-pre-line">
      {lines.map((line: string, idx: number) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 mb-1">
              <span className="text-gray-700 mt-0.5">•</span>
              <span>{trimmedLine.substring(2)}</span>
            </div>
          );
        }
        return <div key={idx} className={trimmedLine ? 'mb-1' : 'h-2'}>{line}</div>;
      })}
    </div>
  );
}


