import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'node:https';

// Initialize OpenAI client
let openai: OpenAI;
try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ OPENAI_API_KEY is not set in environment variables');
  } else {
    console.log('✅ OpenAI API key found for grammar fix (length:', apiKey.length, ')');
  }
  if (process.env.OPENAI_INSECURE_TLS === '1' || process.env.OPENAI_INSECURE_TLS === 'true') {
    console.warn('⚠️ OPENAI_INSECURE_TLS is set. TLS verification disabled for OpenAI. Use only in dev behind corporate proxies.');
  }
  openai = new OpenAI({
    apiKey: apiKey!,
    ...(process.env.OPENAI_INSECURE_TLS === '1' || process.env.OPENAI_INSECURE_TLS === 'true'
      ? { httpAgent: new https.Agent({ rejectUnauthorized: false }) }
      : {}),
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client for grammar fix:', error);
  throw error;
}

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to .env.local and restart the server.' },
        { status: 500 }
      );
    }

    // Log API call
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Calling OpenAI API for Grammar Fix...');
    console.log('Model: gpt-4o-mini');
    console.log('Text Length:', text.length, 'characters');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Create prompt for grammar fix
    const prompt = `You are an expert grammar checker. Fix all grammar errors in the following text. Return ONLY the corrected text with the same formatting (HTML tags, line breaks, etc.) preserved. Fix grammar, sentence structure, and punctuation, but preserve the original meaning and style.

Original text:
"${text}"

Return ONLY the corrected text with grammar fixed. Preserve all HTML formatting, line breaks, and structure. Do not add explanations, comments, or wrap the text in quotes. Return the text directly without any surrounding quotes or extra formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert grammar checker. Fix grammar errors, sentence structure, and punctuation. Preserve all formatting, HTML tags, and structure. Return only the corrected text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1, // Low temperature for consistent grammar corrections
      max_tokens: 2000,
    });

    console.log('✅ OpenAI API call successful for grammar fix');

    // Calculate and log cost
    const usage = completion.usage;
    let costInfo = null;

    if (usage) {
      const inputTokens = usage.prompt_tokens || 0;
      const outputTokens = usage.completion_tokens || 0;
      const totalTokens = usage.total_tokens || 0;

      // gpt-4o-mini pricing (as of 2024):
      // Input: $0.15 per 1M tokens
      // Output: $0.60 per 1M tokens
      const inputCost = (inputTokens / 1_000_000) * 0.15;
      const outputCost = (outputTokens / 1_000_000) * 0.60;
      const totalCost = inputCost + outputCost;
      const totalCostINR = totalCost * 91; // Approximate conversion (1 USD = 91 INR)

      costInfo = {
        model: 'gpt-4o-mini',
        inputTokens,
        outputTokens,
        totalTokens,
        inputCost,
        outputCost,
        totalCost,
        totalCostINR,
      };

      // Server-side logging
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 OpenAI API Usage & Cost (Grammar Fix)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Model: ${costInfo.model}`);
      console.log(`Input Tokens:  ${costInfo.inputTokens.toLocaleString()}`);
      console.log(`Output Tokens: ${costInfo.outputTokens.toLocaleString()}`);
      console.log(`Total Tokens:  ${costInfo.totalTokens.toLocaleString()}`);
      console.log('──────────────────────────────────────────────────────');
      console.log(`Input Cost:    $${costInfo.inputCost.toFixed(6)}`);
      console.log(`Output Cost:   $${costInfo.outputCost.toFixed(6)}`);
      console.log(`Total Cost:    $${costInfo.totalCost.toFixed(6)}`);
      console.log(`Total Cost:    ₹${costInfo.totalCostINR.toFixed(4)} (approx @ ₹91/$)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.warn('⚠️ No usage information available from OpenAI API');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ OpenAI API call completed (Grammar Fix)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Get the corrected text
    let correctedText = completion.choices[0]?.message?.content;
    if (!correctedText) {
      throw new Error('No response content from OpenAI');
    }

    // Clean the text: remove quotes at start/end and trim spaces
    correctedText = correctedText.trim();
    // Remove surrounding quotes if present
    if ((correctedText.startsWith('"') && correctedText.endsWith('"')) ||
        (correctedText.startsWith("'") && correctedText.endsWith("'"))) {
      correctedText = correctedText.slice(1, -1).trim();
    }

    return NextResponse.json({
      correctedText,
      costInfo,
    });
  } catch (error: any) {
    console.error('Error fixing grammar:', error);

    const errorMsg = error?.message || '';
    const causeMsg = (error?.cause as Error)?.message || '';
    const causeCode = (error?.cause as NodeJS.ErrnoException)?.code || '';
    if (
      errorMsg.includes('self-signed') ||
      errorMsg.includes('SELF_SIGNED') ||
      causeMsg.includes('self-signed') ||
      causeCode === 'SELF_SIGNED_CERT_IN_CHAIN'
    ) {
      return NextResponse.json(
        {
          error:
            'TLS certificate verification failed (often due to a corporate proxy or VPN). In development, add OPENAI_INSECURE_TLS=1 to .env.local and restart. Use only behind trusted proxies.',
        },
        { status: 500 }
      );
    }

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'OpenAI API key is missing or invalid. Please check your .env.local file and restart the server.' },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        const retryAfter = error.headers?.['retry-after'] || '60';
        return NextResponse.json(
          { error: `API rate limit exceeded. Please wait ${retryAfter} seconds before trying again.` },
          { status: 429 }
        );
      }
      if (error.status === 402 || error.status === 403) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your account billing and add credits.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fix grammar. Please try again.' },
      { status: 500 }
    );
  }
}

