'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Minus,
  Type,
  ChevronDown,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const fonts = [
  { value: 'Arial', label: 'Arial', family: 'Arial, sans-serif' },
  { value: 'Helvetica', label: 'Helvetica', family: 'Helvetica, sans-serif' },
  { value: 'Times New Roman', label: 'Times New Roman', family: 'Times New Roman, serif' },
  { value: 'Courier New', label: 'Courier New', family: 'Courier New, monospace' },
  { value: 'Georgia', label: 'Georgia', family: 'Georgia, serif' },
  { value: 'Verdana', label: 'Verdana', family: 'Verdana, sans-serif' },
  { value: 'Calibri', label: 'Calibri', family: 'Calibri, sans-serif' },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentFontFamily, setCurrentFontFamily] = useState('Arial');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      // Only update if the value actually changed (avoid infinite loops)
      if (value !== currentContent && (value !== undefined)) {
        // Save cursor position
        const selection = window.getSelection();
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
        
        editorRef.current.innerHTML = value || '';
        
        // Restore cursor position if possible
        if (range && selection && editorRef.current.contains(range.commonAncestorContainer)) {
          try {
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            // Ignore selection restoration errors
          }
        }
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Debounce typing to reduce history entries from rapid keystrokes
  const debouncedHandleInput = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      handleInput();
    }, 500); // Debounce typing by 500ms to reduce history entries
  }, [handleInput]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const getSelection = () => {
    return window.getSelection();
  };

  const isCommandActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  const handleFontSize = (size: string) => {
    const selection = getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size;
      try {
        range.surroundContents(span);
      } catch (e) {
        // If surroundContents fails, use execCommand as fallback
        execCommand('fontSize', '3');
        const selectedElements = editorRef.current?.querySelectorAll('font[size="3"]');
        selectedElements?.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.fontSize = size;
            el.removeAttribute('size');
          }
        });
      }
    } else {
      // Apply to current selection or create a span
      execCommand('fontSize', '3');
      const selectedElements = editorRef.current?.querySelectorAll('font[size="3"]');
      selectedElements?.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.fontSize = size;
          el.removeAttribute('size');
        }
      });
    }
    editorRef.current?.focus();
    handleInput();
  };

  const handleFontFamily = (font: string) => {
    execCommand('fontName', font);
    setCurrentFontFamily(font);
    setIsFontDropdownOpen(false);
    handleInput();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };

    if (isFontDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isFontDropdownOpen]);

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('bold')}
            className={`h-8 w-8 p-0 ${isCommandActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('italic')}
            className={`h-8 w-8 p-0 ${isCommandActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('underline')}
            className={`h-8 w-8 p-0 ${isCommandActive('underline') ? 'bg-gray-200' : ''}`}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        {/* Font Family - Custom Dropdown */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1 relative" ref={fontDropdownRef}>
          <button
            type="button"
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className="h-8 px-2 text-sm border rounded bg-white hover:bg-gray-50 flex items-center gap-1 min-w-[120px] justify-between"
            title="Font Family"
            style={{ fontFamily: fonts.find(f => f.value === currentFontFamily)?.family || 'Arial, sans-serif' }}
          >
            <span>{currentFontFamily}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {isFontDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-[120px] max-h-48 overflow-y-auto">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => handleFontFamily(font.value)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                  style={{ fontFamily: font.family }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <select
            onChange={(e) => handleFontSize(e.target.value)}
            className="h-8 px-2 text-sm border rounded bg-white"
            title="Font Size"
            defaultValue="14px"
          >
            <option value="10px">10px</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            className={`h-8 w-8 p-0 ${isCommandActive('justifyLeft') ? 'bg-gray-200' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            className={`h-8 w-8 p-0 ${isCommandActive('justifyCenter') ? 'bg-gray-200' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyRight')}
            className={`h-8 w-8 p-0 ${isCommandActive('justifyRight') ? 'bg-gray-200' : ''}`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyFull')}
            className={`h-8 w-8 p-0 ${isCommandActive('justifyFull') ? 'bg-gray-200' : ''}`}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
            className={`h-8 w-8 p-0 ${isCommandActive('insertUnorderedList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
            className={`h-8 w-8 p-0 ${isCommandActive('insertOrderedList') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Horizontal Rule */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertHorizontalRule')}
            className="h-8 w-8 p-0"
            title="Insert Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={debouncedHandleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          // Save immediately on blur to ensure changes are tracked in history
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
          }
          handleInput();
        }}
        className={`min-h-[120px] p-3 focus:outline-none ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

