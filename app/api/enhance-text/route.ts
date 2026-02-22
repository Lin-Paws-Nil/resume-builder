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
    console.log('✅ OpenAI API key found for text enhancement (length:', apiKey.length, ')');
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
  console.error('Failed to initialize OpenAI client for text enhancement:', error);
  throw error;
}

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sectionType, fieldName, context } = body;

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
    console.log('🚀 Calling OpenAI API for Text Enhancement...');
    console.log('Model: gpt-4o-mini');
    console.log('Section Type:', sectionType || 'general');
    console.log('Field Name:', fieldName || 'N/A');
    console.log('Context:', context ? JSON.stringify(context, null, 2) : 'None');
    console.log('Text Length:', text.length, 'characters');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Build context string for the prompt
    let contextString = '';
    if (context && Object.keys(context).length > 0) {
      const contextParts: string[] = [];
      if (context.company) contextParts.push(`Company: ${context.company}`);
      if (context.position) contextParts.push(`Position: ${context.position}`);
      if (context.startDate || context.endDate) {
        const dateRange = context.current 
          ? `${context.startDate || 'N/A'} - Present`
          : `${context.startDate || 'N/A'} - ${context.endDate || 'N/A'}`;
        contextParts.push(`Date Range: ${dateRange}`);
      }
      if (context.name) contextParts.push(`Name: ${context.name}`);
      if (context.institution) contextParts.push(`Institution: ${context.institution}`);
      if (context.degree) contextParts.push(`Degree: ${context.degree}`);
      if (context.field) contextParts.push(`Field: ${context.field}`);
      if (context.technologies && Array.isArray(context.technologies)) {
        contextParts.push(`Technologies: ${context.technologies.join(', ')}`);
      }
      if (context.issuer) contextParts.push(`Issuer: ${context.issuer}`);
      if (context.date) contextParts.push(`Date: ${context.date}`);
      
      if (contextParts.length > 0) {
        contextString = `\n\nAdditional Context:\n${contextParts.join('\n')}`;
      }
    }

    // Create prompt for text enhancement with section-specific guidance
    const sectionDescription = sectionType 
      ? `${sectionType} section${fieldName ? ` (${fieldName} field)` : ''}`
      : 'resume';
    
    // Section-specific enhancement guidelines
    let sectionGuidelines = '';
    switch (sectionType) {
      case 'summary':
        sectionGuidelines = `- This is a professional summary/objective section
- Make it compelling, concise (2-4 sentences), and tailored to the candidate's profile
- Highlight key strengths, years of experience, and career focus
- Use strong opening statements that grab attention`;
        break;
      case 'experience':
        sectionGuidelines = `- This is a work experience description
- Focus on achievements, quantifiable results, and impact
- Use strong action verbs (e.g., "Led", "Developed", "Increased", "Managed", "Optimized")
- Quantify achievements with numbers, percentages, or metrics when possible
- Highlight skills, technologies, and tools used
- Show progression and growth
- Format as bullet points if the original uses them`;
        break;
      case 'project':
        sectionGuidelines = `- This is a project description
- Emphasize technical skills, technologies used, and project outcomes
- Highlight challenges solved and solutions implemented
- Show impact and results achieved
- Mention team size or collaboration if relevant`;
        break;
      case 'hobby':
        sectionGuidelines = `- This is a hobby/interest description
- Keep it professional but personal
- Highlight transferable skills or unique qualities
- Show passion and commitment`;
        break;
      default:
        sectionGuidelines = `- Maintain professional resume language
- Focus on clarity, impact, and relevance
- Ensure ATS-friendly formatting`;
    }
    
    const prompt = `You are an expert resume writer specializing in creating ATS-optimized, impactful resume content. Given the following text from a ${sectionDescription}, provide exactly 3 improved variations that are:
1. More professional and polished
2. More impactful and achievement-oriented (use action verbs, quantify achievements where possible)
3. Better suited for resume/ATS systems (use relevant keywords naturally, avoid over-stuffing)
4. Concise yet comprehensive
5. Contextually appropriate for the given section and related information${contextString ? '\n6. Aligned with and leveraging the context provided below' : ''}

${contextString ? `\nCONTEXT INFORMATION:\n${contextString}\n\nUse this context to make the enhanced text more specific, relevant, and impactful. For example:
- If company/position is provided, tailor language to that industry/role
- If dates are provided, ensure tense consistency (past tense for completed roles, present for current)
- If technologies are listed, naturally incorporate relevant technical terms
- If it's a current position, use present tense; if past, use past tense` : ''}

SECTION-SPECIFIC GUIDELINES:
${sectionGuidelines}

Original text to enhance:
"${text}"

IMPORTANT:
- Maintain the same format structure (bullet points, paragraphs, etc.) as the original
- Each variation should be distinctly different in approach while maintaining quality
- Variation 1: Focus on quantifiable achievements and metrics
- Variation 2: Emphasize skills, technologies, and technical expertise
- Variation 3: Highlight leadership, collaboration, and soft skills impact
- Use industry-standard resume language
- Ensure ATS-friendly formatting (avoid special characters that might break parsing)
- Keep the enhanced text similar in length to the original (unless the original is too brief)

Return ONLY a valid JSON object with this exact structure:
{
  "variations": [
    "First enhanced variation here",
    "Second enhanced variation here",
    "Third enhanced variation here"
  ]
}

Do not include any explanations, comments, or additional text. Only return the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Always return valid JSON only, following the exact format specified. Provide exactly 3 variations of the given text that are more professional, impactful, and resume-appropriate.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7, // Slightly higher for more creative variations
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    console.log('✅ OpenAI API call successful for text enhancement');

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
      console.log('📊 OpenAI API Usage & Cost (Text Enhancement)');
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
      console.log('Note: Cost calculation requires usage data from OpenAI response');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ OpenAI API call completed (Text Enhancement)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid JSON response from OpenAI');
    }

    if (!parsedResponse.variations || !Array.isArray(parsedResponse.variations) || parsedResponse.variations.length !== 3) {
      console.error('Invalid response structure:', parsedResponse);
      throw new Error('Invalid response format: expected 3 variations');
    }

    return NextResponse.json({
      variations: parsedResponse.variations,
      costInfo,
    });
  } catch (error: any) {
    console.error('Error enhancing text:', error);

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
          { error: `API rate limit exceeded. Please wait ${retryAfter} seconds before trying again. You can check your usage at https://platform.openai.com/usage` },
          { status: 429 }
        );
      }
      if (error.status === 402 || error.status === 403) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your account billing and add credits.' },
          { status: 500 }
        );
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message?.includes('fetch')) {
        return NextResponse.json(
          { error: 'Cannot connect to OpenAI API. Please check your internet connection and ensure the API key is valid. If the issue persists, check OpenAI service status.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to enhance text. Please try again.' },
      { status: 500 }
    );
  }
}

