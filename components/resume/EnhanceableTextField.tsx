'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { EnhancePopup } from '@/components/ui/enhance-popup';
import { Sparkles, Loader2, SpellCheck, FileText, Lock, Crown } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSubscription } from '@/lib/hooks/use-subscription';

interface EnhanceableTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  type?: 'textarea' | 'input';
  sectionType?: string;
  fieldName?: string;
  context?: Record<string, any>; // Additional context like company, position, etc.
  className?: string;
}

export function EnhanceableTextField({
  value,
  onChange,
  placeholder,
  rows = 5,
  type = 'textarea',
  sectionType,
  fieldName,
  context,
  className,
}: EnhanceableTextFieldProps) {
  const router = useRouter();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFixingSpelling, setIsFixingSpelling] = useState(false);
  const [isFixingGrammar, setIsFixingGrammar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const { user, isGuest } = useAuth();
  const { subscription } = useSubscription(user?.id || null);

  const isPremium = !!(user && !isGuest && subscription?.canDownload);

  // Extract plain text from HTML
  const getPlainText = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleEnhance = async () => {
    // Check premium access first
    if (!isPremium) {
      if (!user || isGuest) {
        alert('Please log in to use AI enhancement features.');
        router.push('/login?redirect=' + encodeURIComponent('/builder'));
      } else {
        const shouldUpgrade = confirm('AI enhancement requires a premium subscription. Would you like to upgrade your plan?');
        if (shouldUpgrade) {
          router.push('/subscribe?return=' + encodeURIComponent('/builder'));
        }
      }
      return;
    }

    // Extract plain text from HTML for API call
    const plainText = type === 'textarea' ? getPlainText(value) : value;
    
    if (!plainText.trim() || isEnhancing) return;

    setIsEnhancing(true);

    try {
      // Calculate popup position relative to the field
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popupWidth = 700; // max-w-[700px]
        const popupHeight = 500; // approximate height
        
        let left = containerRect.left;
        let top = containerRect.bottom + 10;
        
        // Adjust if popup would go off right edge
        if (left + popupWidth > viewportWidth) {
          left = viewportWidth - popupWidth - 20;
        }
        
        // Adjust if popup would go off bottom edge
        if (top + popupHeight > viewportHeight) {
          top = containerRect.top - popupHeight - 10;
        }
        
        // Ensure popup doesn't go off left edge
        if (left < 20) {
          left = 20;
        }
        
        // Ensure popup doesn't go off top edge
        if (top < 20) {
          top = 20;
        }
        
        setPopupPosition({
          top,
          left,
        });
      }

      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: plainText,
          sectionType,
          fieldName,
          context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enhance text');
      }

      const data = await response.json();
      const { variations: apiVariations, costInfo } = data;

      // Log cost information to browser console
      if (costInfo) {
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log('%c📊 OpenAI API Usage & Cost (Text Enhancement)', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log(`%cModel: ${costInfo.model}`, 'color: #2196F3; font-weight: bold;');
        console.log(`%cInput Tokens:  ${costInfo.inputTokens.toLocaleString()}`, 'color: #666;');
        console.log(`%cOutput Tokens: ${costInfo.outputTokens.toLocaleString()}`, 'color: #666;');
        console.log(`%cTotal Tokens:  ${costInfo.totalTokens.toLocaleString()}`, 'color: #666;');
        console.log('%c──────────────────────────────────────────────────────', 'color: #ccc;');
        console.log(`%cInput Cost:    $${costInfo.inputCost.toFixed(6)}`, 'color: #FF9800; font-weight: bold;');
        console.log(`%cOutput Cost:   $${costInfo.outputCost.toFixed(6)}`, 'color: #FF9800; font-weight: bold;');
        console.log(`%cTotal Cost:    $${costInfo.totalCost.toFixed(6)}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log(`%cTotal Cost:    ₹${costInfo.totalCostINR.toFixed(4)} (approx @ ₹91/$)`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
      }

      if (!apiVariations || !Array.isArray(apiVariations) || apiVariations.length !== 3) {
        throw new Error('Invalid response: expected 3 variations');
      }

      setVariations(apiVariations);
      setShowPopup(true);
    } catch (error: any) {
      console.error('Error enhancing text:', error);
      alert(error.message || 'Failed to enhance text. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSelectVariation = (selectedText: string) => {
    // If using rich text editor, convert plain text to HTML with line breaks
    if (type === 'textarea') {
      // Convert line breaks to <br> tags and preserve formatting
      const htmlText = selectedText
        .split('\n')
        .map(line => line.trim() || '<br>')
        .join('<br>');
      onChange(htmlText);
    } else {
      onChange(selectedText);
    }
    setShowPopup(false);
    setVariations([]);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setVariations([]);
  };

  const handleFixSpelling = async () => {
    // Check premium access first
    if (!isPremium) {
      if (!user || isGuest) {
        alert('Please log in to use spelling correction features.');
        router.push('/login?redirect=' + encodeURIComponent('/builder'));
      } else {
        const shouldUpgrade = confirm('Spelling correction requires a premium subscription. Would you like to upgrade your plan?');
        if (shouldUpgrade) {
          router.push('/subscribe?return=' + encodeURIComponent('/builder'));
        }
      }
      return;
    }

    // Extract plain text from HTML for API call
    const plainText = type === 'textarea' ? getPlainText(value) : value;
    
    if (!plainText.trim() || isFixingSpelling) return;

    setIsFixingSpelling(true);

    try {
      const response = await fetch('/api/fix-spelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: value, // Send HTML to preserve formatting
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fix spelling');
      }

      const data = await response.json();
      const { correctedText, costInfo } = data;

      // Log cost information to browser console
      if (costInfo) {
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log('%c📊 OpenAI API Usage & Cost (Spelling Fix)', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log(`%cModel: ${costInfo.model}`, 'color: #2196F3; font-weight: bold;');
        console.log(`%cInput Tokens:  ${costInfo.inputTokens.toLocaleString()}`, 'color: #666;');
        console.log(`%cOutput Tokens: ${costInfo.outputTokens.toLocaleString()}`, 'color: #666;');
        console.log(`%cTotal Tokens:  ${costInfo.totalTokens.toLocaleString()}`, 'color: #666;');
        console.log('%c──────────────────────────────────────────────────────', 'color: #ccc;');
        console.log(`%cInput Cost:    $${costInfo.inputCost.toFixed(6)}`, 'color: #FF9800; font-weight: bold;');
        console.log(`%cOutput Cost:   $${costInfo.outputCost.toFixed(6)}`, 'color: #FF9800; font-weight: bold;');
        console.log(`%cTotal Cost:    $${costInfo.totalCost.toFixed(6)}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log(`%cTotal Cost:    ₹${costInfo.totalCostINR.toFixed(4)} (approx @ ₹91/$)`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
      }

      // Clean the corrected text: remove quotes and trim spaces
      let cleanedText = correctedText.trim();
      // Remove surrounding quotes if present
      if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) ||
          (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
        cleanedText = cleanedText.slice(1, -1).trim();
      }

      // Update the value with corrected text (preserves HTML formatting)
      // onChange will trigger updateSection/updateItem which automatically tracks history
      onChange(cleanedText);
    } catch (error: any) {
      console.error('Error fixing spelling:', error);
      alert(error.message || 'Failed to fix spelling. Please try again.');
    } finally {
      setIsFixingSpelling(false);
    }
  };

  const handleFixGrammar = async () => {
    // Check premium access first
    if (!isPremium) {
      if (!user || isGuest) {
        alert('Please log in to use grammar correction features.');
        router.push('/login?redirect=' + encodeURIComponent('/builder'));
      } else {
        const shouldUpgrade = confirm('Grammar correction requires a premium subscription. Would you like to upgrade your plan?');
        if (shouldUpgrade) {
          router.push('/subscribe?return=' + encodeURIComponent('/builder'));
        }
      }
      return;
    }

    // Extract plain text from HTML for API call
    const plainText = type === 'textarea' ? getPlainText(value) : value;
    
    if (!plainText.trim() || isFixingGrammar) return;

    setIsFixingGrammar(true);

    try {
      const response = await fetch('/api/fix-grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: value, // Send HTML to preserve formatting
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fix grammar');
      }

      const data = await response.json();
      const { correctedText, costInfo } = data;

      // Log cost information to browser console
      if (costInfo) {
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log('%c📊 OpenAI API Usage & Cost (Grammar Fix)', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log(`%cModel: ${costInfo.model}`, 'color: #2196F3; font-weight: bold;');
        console.log(`%cInput Tokens:  ${costInfo.inputTokens.toLocaleString()}`, 'color: #666;');
        console.log(`%cOutput Tokens: ${costInfo.outputTokens.toLocaleString()}`, 'color: #666;');
        console.log(`%cTotal Tokens:  ${costInfo.totalTokens.toLocaleString()}`, 'color: #666;');
        console.log('%c──────────────────────────────────────────────────────', 'color: #ccc;');
        console.log(`%cInput Cost:    $${costInfo.inputCost.toFixed(6)}`, 'color: #FF9800; font-weight: bold;');
        console.log(`%cOutput Cost:   $${costInfo.outputCost.toFixed(6)}`, 'color: #FF9800; font-weight: bold;');
        console.log(`%cTotal Cost:    $${costInfo.totalCost.toFixed(6)}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log(`%cTotal Cost:    ₹${costInfo.totalCostINR.toFixed(4)} (approx @ ₹91/$)`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
      }

      // Clean the corrected text: remove quotes and trim spaces
      let cleanedText = correctedText.trim();
      // Remove surrounding quotes if present
      if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) ||
          (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
        cleanedText = cleanedText.slice(1, -1).trim();
      }

      // Update the value with corrected text (preserves HTML formatting)
      // onChange will trigger updateSection/updateItem which automatically tracks history
      onChange(cleanedText);
    } catch (error: any) {
      console.error('Error fixing grammar:', error);
      alert(error.message || 'Failed to fix grammar. Please try again.');
    } finally {
      setIsFixingGrammar(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {type === 'textarea' ? (
            <RichTextEditor
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={className}
            />
          ) : (
            <Input
              ref={fieldRef as React.RefObject<HTMLInputElement>}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={className}
            />
          )}
        </div>
      </div>
      
      {/* Premium AI Features Box - Always Visible */}
      <div className="border-2 border-purple-200 rounded-lg p-3 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-900">AI-Powered Features</span>
          </div>
          {isPremium ? (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Premium</span>
          ) : (
            <Lock className="h-3 w-3 text-amber-600" />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFixSpelling}
            disabled={!value.trim() || isFixingSpelling || isFixingGrammar || isEnhancing}
            className="h-8 px-3 text-xs bg-white hover:bg-green-50 border-green-300 text-green-600 hover:text-green-700 disabled:opacity-50"
            title={isPremium ? "Fix spelling errors" : "Premium feature - Upgrade to use"}
          >
            {isFixingSpelling ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <SpellCheck className="h-3 w-3 mr-1" />
                Fix Spelling
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFixGrammar}
            disabled={!value.trim() || isFixingSpelling || isFixingGrammar || isEnhancing}
            className="h-8 px-3 text-xs bg-white hover:bg-purple-50 border-purple-300 text-purple-600 hover:text-purple-700 disabled:opacity-50"
            title={isPremium ? "Fix grammar errors" : "Premium feature - Upgrade to use"}
          >
            {isFixingGrammar ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-1" />
                Fix Grammar
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEnhance}
            disabled={!value.trim() || isEnhancing || isFixingSpelling || isFixingGrammar}
            className="h-8 px-3 text-xs bg-white hover:bg-blue-50 border-blue-300 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            title={isPremium ? "Get AI-enhanced variations" : "Premium feature - Upgrade to use"}
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Enhance using AI
              </>
            )}
          </Button>
        </div>
      </div>

      {showPopup && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-[9999]"
            onClick={handleCancel}
          />
          <EnhancePopup
            variations={variations}
            onSelect={handleSelectVariation}
            onCancel={handleCancel}
            position={popupPosition}
          />
        </>
      )}
    </div>
  );
}
