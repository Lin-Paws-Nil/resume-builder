import OpenAI from 'openai';
import https from 'node:https';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import type { ResumeData } from '@/lib/types/resume';

// Initialize OpenAI client with error handling
let openai: OpenAI;
try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ OPENAI_API_KEY is not set in environment variables');
  } else {
    console.log('✅ OpenAI API key found (length:', apiKey.length, ')');
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
  console.error('Failed to initialize OpenAI client:', error);
  throw error;
}

export async function parsePDF(file: File): Promise<string> {
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid PDF file: file is empty or missing');
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Failed to read PDF file: file appears to be empty');
    }

    const buffer = Buffer.from(arrayBuffer);
    
    if (!buffer || buffer.length === 0) {
      throw new Error('Failed to convert PDF to buffer');
    }

    // Parse PDF
    const data = await pdfParse(buffer);
    
    if (!data || !data.text) {
      throw new Error('Failed to extract text from PDF. The PDF might be image-based or corrupted.');
    }

    return data.text;
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
    
    if (error.message?.includes('Could not find file')) {
      throw new Error('Invalid PDF file format. Please ensure the file is a valid PDF document.');
    }
    
    if (error.message?.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please ensure the file is a valid PDF document and not corrupted.');
    }
    
    throw new Error(`Failed to parse PDF file: ${error.message || 'Unknown error'}`);
  }
}

export async function parseDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert ArrayBuffer to Buffer for Node.js environment
    const buffer = Buffer.from(arrayBuffer);
    
    // Mammoth in Node.js can work with buffer directly
    // Try with buffer first (Node.js), fallback to arrayBuffer (browser)
    let result;
    try {
      // For Node.js/server-side, use buffer
      result = await mammoth.extractRawText({ buffer });
    } catch (bufferError) {
      // Fallback to arrayBuffer if buffer doesn't work
      result = await mammoth.extractRawText({ arrayBuffer });
    }
    
    if (result.value) {
      return result.value;
    } else {
      throw new Error('Failed to extract text from DOCX file');
    }
  } catch (error: any) {
    console.error('Error parsing DOCX:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    if (error.message?.includes('Could not find file')) {
      throw new Error('Invalid DOCX file format. Please ensure the file is a valid Word document (.docx format).');
    }
    throw new Error(`Failed to parse DOCX file: ${error.message || 'Unknown error'}`);
  }
}

export async function extractResumeContent(text: string): Promise<Partial<ResumeData>> {
  const prompt = `You are an expert resume parser with deep understanding of resume formats and structures. Your task is to carefully read the resume text below and extract all information accurately, mapping it to the correct sections.

IMPORTANT INSTRUCTIONS:
1. Read the entire resume carefully and identify all sections
2. Extract personal information (name, email, phone, location, LinkedIn, GitHub, website)
3. Extract professional summary/objective
4. Extract all work experiences with company, position, dates, and descriptions
5. Extract all education details including institution, degree, field, dates, GPA, honors
6. Extract all skills and group them by category if categories are mentioned
7. Extract projects with descriptions, technologies, and links
8. Extract certifications with issuer, date, and expiry if mentioned
9. Extract hobbies/interests if present

For experience descriptions:
- Combine all bullet points into a single string
- Use "• " prefix for each bullet point
- Separate multiple bullets with newlines (\\n)
- Preserve the original content and formatting as much as possible

Return ONLY valid JSON in this exact format:

{
  "personalInfo": {
    "fullName": "string (extract full name from header)",
    "email": "string (extract email address)",
    "phone": "string (extract phone number, format as provided)",
    "location": "string (extract city, state, or full address)",
    "linkedin": "string or empty (extract LinkedIn URL if present)",
    "github": "string or empty (extract GitHub URL if present)",
    "website": "string or empty (extract personal website if present)"
  },
  "summary": "string (extract professional summary, objective, or profile section)",
  "experiences": [
    {
      "company": "string (company name)",
      "position": "string (job title/position)",
      "startDate": "MM/YYYY (extract start date, use format MM/YYYY)",
      "endDate": "MM/YYYY or Present (extract end date or 'Present' if current)",
      "current": boolean (true if endDate is Present or current role),
      "description": "string (combine all bullet points with '• ' prefix and \\n separators)"
    }
  ],
  "education": [
    {
      "institution": "string (school/university name)",
      "degree": "string (degree type like B.E., B.S., M.S., Ph.D.)",
      "field": "string (field of study/major, if mentioned)",
      "startDate": "MM/YYYY (start date)",
      "endDate": "MM/YYYY (graduation date)",
      "gpa": "string or empty (GPA if mentioned)",
      "honors": "string or empty (honors, awards, if mentioned)"
    }
  ],
  "skills": [
    {
      "category": "string (category name like 'Programming Languages', 'Tools', 'Frameworks', or 'General' if no category)",
      "items": ["skill1", "skill2", "skill3"] (array of skills in this category)
    }
  ],
  "projects": [
    {
      "name": "string (project name)",
      "description": "string (project description)",
      "technologies": ["tech1", "tech2"] (technologies used),
      "link": "string or empty (project URL if mentioned)",
      "github": "string or empty (GitHub URL if mentioned)"
    }
  ],
  "certifications": [
    {
      "name": "string (certification name)",
      "issuer": "string (issuing organization)",
      "date": "MM/YYYY (certification date)",
      "expiryDate": "string or empty (expiry date if mentioned)"
    }
  ],
  "hobbies": [
    {
      "name": "string (hobby name)",
      "description": "string or empty (description if provided)"
    }
  ]
}

Resume text to parse:
${text}

CRITICAL: 
- Return ONLY the JSON object
- No markdown formatting
- No code blocks
- No explanations or comments
- Ensure all dates are in MM/YYYY format
- For experience descriptions, use "• " prefix for bullets and \\n for line breaks
- If a section is missing, use empty string for strings, empty array for arrays
- Be thorough and extract ALL information present in the resume`;

  // Retry logic for rate limits with exponential backoff
  const maxRetries = 5; // Increased retries
  let lastError: any = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Log API call
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 Calling OpenAI API...');
      console.log('Model: gpt-4o-mini');
      console.log('Attempt:', attempt + 1, '/', maxRetries);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume parser. You accurately extract and structure resume information. Always return valid JSON only, following the exact format specified. Pay special attention to date formats (MM/YYYY), experience descriptions (use bullet points with • prefix and \\n separators), and skill categorization.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2, // Lower temperature for more consistent parsing
        response_format: { type: 'json_object' },
        max_tokens: 4000, // Increased for longer resumes
      });

      console.log('✅ OpenAI API call successful');

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
        
        costInfo = {
          model: 'gpt-4o-mini',
          inputTokens,
          outputTokens,
          totalTokens,
          inputCost,
          outputCost,
          totalCost,
          totalCostINR: totalCost * 91, // Approximate conversion (1 USD = 91 INR)
        };
        
        // Server-side logging
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 OpenAI API Usage & Cost');
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
      
      // Always log that API was called, even if usage info is missing
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ OpenAI API call completed');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      // Parse JSON response
      let parsed: any;
      try {
        // Try direct parsing first (since we're using json_object format)
        parsed = JSON.parse(content);
      } catch (parseError) {
        // Fallback: try to extract JSON from markdown or text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }

      // Post-process and normalize the data
      const normalizedData = normalizeParsedData(parsed);
      
      // Attach cost info to the result (we'll use a special property)
      if (costInfo) {
        (normalizedData as any).__costInfo = costInfo;
      }
      
      return normalizedData;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error and we have retries left
      const isRateLimit = error.message?.includes('rate limit') || 
                         error.message?.includes('429') || 
                         error.name === 'RateLimitError' ||
                         error.status === 429;
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Calculate wait time: exponential backoff with longer waits
        // Attempt 0: 2 seconds, Attempt 1: 4 seconds, Attempt 2: 8 seconds, etc.
        // But cap at 60 seconds for rate limits
        const baseWaitTime = Math.min(Math.pow(2, attempt) * 1000, 60000); // Max 60 seconds
        const waitTime = baseWaitTime;
        
        console.log(`⚠️ Rate limit hit. Waiting ${waitTime / 1000} seconds before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue; // Retry the request
      }
      
      // If not a rate limit error or no retries left, break and throw
      break;
    }
  }
  
  // Handle the error (either rate limit after retries or other error)
  if (!lastError) {
    throw new Error('Failed to parse resume after multiple attempts');
  }
  
  const error = lastError;
  console.error('Error parsing resume:', error);
  
  // Check for specific OpenAI errors
  if (error instanceof Error) {
    const errorMsg = error.message || '';
    const errorName = error.name || '';
    const causeMsg = (error.cause as Error)?.message || '';
    const causeCode = (error.cause as NodeJS.ErrnoException)?.code || '';

    // TLS / certificate errors (e.g. corporate proxy, SSL inspection)
    if (
      errorMsg.includes('self-signed') ||
      errorMsg.includes('SELF_SIGNED') ||
      causeMsg.includes('self-signed') ||
      causeCode === 'SELF_SIGNED_CERT_IN_CHAIN'
    ) {
      throw new Error(
        'TLS certificate verification failed (often due to a corporate proxy or VPN). ' +
          'In development, add OPENAI_INSECURE_TLS=1 to .env.local and restart. Use only behind trusted proxies.'
      );
    }

    // Connection errors
    if (errorMsg.includes('Connection error') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ENOTFOUND') || errorMsg.includes('ETIMEDOUT')) {
      console.error('OpenAI API connection failed. Possible causes:');
      console.error('1. Check if OPENAI_API_KEY is set:', !!process.env.OPENAI_API_KEY);
      console.error('2. Check internet connection');
      console.error('3. Check if OpenAI API is accessible');
      throw new Error('Cannot connect to OpenAI API. Please check your internet connection and ensure the API key is valid. If the issue persists, check OpenAI service status.');
    }
    
    if (errorMsg.includes('API key') || errorMsg.includes('Invalid API key') || errorMsg.includes('401') || errorName === 'AuthenticationError') {
      throw new Error('OpenAI API key is missing or invalid. Please check your .env.local file and restart the server.');
    }
    if (errorMsg.includes('rate limit') || errorMsg.includes('429') || errorName === 'RateLimitError') {
      const retryAfter = (error as any).headers?.['retry-after'] || (error as any).headers?.['Retry-After'] || '60';
      throw new Error(
        `API rate limit exceeded. Please wait ${retryAfter} seconds before trying again. ` +
        `You can check your usage at https://platform.openai.com/usage`
      );
    }
    if (errorMsg.includes('insufficient_quota') || errorMsg.includes('quota') || errorMsg.includes('402') || errorName === 'InsufficientQuotaError') {
      throw new Error('OpenAI API quota exceeded. Please check your account billing and add credits.');
    }
    if (errorMsg.includes('timeout') || errorMsg.includes('time') || errorName === 'TimeoutError') {
      throw new Error('Request timed out. Please try again with a smaller file.');
    }
    if (errorMsg.includes('Invalid JSON')) {
      throw new Error('AI returned invalid response. Please try again.');
    }
  }
  
  // Log full error for debugging
  console.error('Full error details:', {
    message: error?.message,
    name: error?.name,
    status: error?.status,
    code: error?.code,
    cause: error?.cause,
  });
  
  throw new Error(error?.message || 'Failed to parse resume. Please check the server console for details.');
}

// Normalize and clean the parsed data
function normalizeParsedData(data: any): Partial<ResumeData> {
  const normalized: any = {};

  // Normalize personal info
  if (data.personalInfo) {
    normalized.personalInfo = {
      fullName: data.personalInfo.fullName || '',
      email: data.personalInfo.email || '',
      phone: data.personalInfo.phone || '',
      location: data.personalInfo.location || '',
      linkedin: data.personalInfo.linkedin || '',
      github: data.personalInfo.github || '',
      website: data.personalInfo.website || '',
    };
  }

  // Normalize summary
  normalized.summary = data.summary || '';

  // Normalize experiences - convert description array to string if needed
  if (Array.isArray(data.experiences)) {
    normalized.experiences = data.experiences.map((exp: any) => {
      let description = '';
      if (Array.isArray(exp.description)) {
        // Convert array of bullets to string with • prefix
        description = exp.description
          .map((bullet: string) => {
            const trimmed = bullet.trim();
            return trimmed.startsWith('•') ? trimmed : `• ${trimmed}`;
          })
          .join('\n');
      } else if (typeof exp.description === 'string') {
        description = exp.description;
      }

      return {
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || exp.endDate === 'Present' || exp.endDate?.toLowerCase() === 'present',
        description: description,
      };
    });
  } else {
    normalized.experiences = [];
  }

  // Normalize education
  if (Array.isArray(data.education)) {
    normalized.education = data.education.map((edu: any) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: edu.gpa || '',
      honors: edu.honors || '',
    }));
  } else {
    normalized.education = [];
  }

  // Normalize skills
  if (Array.isArray(data.skills)) {
    normalized.skills = data.skills.map((skill: any) => ({
      category: skill.category || 'General',
      items: Array.isArray(skill.items) ? skill.items.filter(Boolean) : [],
    }));
  } else {
    normalized.skills = [];
  }

  // Normalize projects
  if (Array.isArray(data.projects)) {
    normalized.projects = data.projects.map((proj: any) => ({
      name: proj.name || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      link: proj.link || '',
      github: proj.github || '',
    }));
  } else {
    normalized.projects = [];
  }

  // Normalize certifications
  if (Array.isArray(data.certifications)) {
    normalized.certifications = data.certifications.map((cert: any) => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      expiryDate: cert.expiryDate || '',
    }));
  } else {
    normalized.certifications = [];
  }

  // Normalize hobbies
  if (Array.isArray(data.hobbies)) {
    normalized.hobbies = data.hobbies.map((hobby: any) => ({
      name: hobby.name || '',
      description: hobby.description || '',
    }));
  } else {
    normalized.hobbies = [];
  }

  return normalized;
}

export async function parseResumeFile(file: File): Promise<Partial<ResumeData>> {
  let text = '';

  console.log('Parsing resume file:', {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  // Check file type by MIME type and extension
  const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isDOCX = 
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.docx');

  if (isPDF) {
    console.log('Detected PDF file, parsing...');
    text = await parsePDF(file);
  } else if (isDOCX) {
    console.log('Detected DOCX file, parsing...');
    text = await parseDOCX(file);
  } else {
    throw new Error(
      `Unsupported file type: ${file.type || 'unknown'}. ` +
      `Please upload a PDF (.pdf) or DOCX (.docx) file.`
    );
  }

  if (!text || text.trim().length === 0) {
    throw new Error('No text could be extracted from the file. The file might be image-based, corrupted, or password-protected.');
  }

  console.log(`Extracted ${text.length} characters from file`);
  return extractResumeContent(text);
}



