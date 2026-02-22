import React from 'react';

/**
 * Safely renders HTML content. Detects if content is HTML or plain text.
 * For HTML content, uses dangerouslySetInnerHTML to render it.
 * For plain text, renders it normally.
 */
export function renderHTML(content: string | undefined | null): React.ReactNode {
  if (!content) return null;

  // Check if content contains HTML tags
  const hasHTML = /<[a-z][\s\S]*>/i.test(content);

  if (hasHTML) {
    // Render as HTML
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
        className="rich-text-content"
      />
    );
  }

  // Render as plain text (preserve line breaks)
  return (
    <div className="whitespace-pre-line">
      {content}
    </div>
  );
}





