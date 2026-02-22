import { NextRequest, NextResponse } from 'next/server';
import { parseResumeFile } from '@/lib/services/resume-parser';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File upload received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });

    if (!file) {
      console.error('No file found in formData');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name) {
      console.error('File has no name property');
      return NextResponse.json({ error: 'Invalid file: missing filename' }, { status: 400 });
    }

    // Validate file type
    if (
      file.type !== 'application/pdf' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
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

    const parsedData = await parseResumeFile(file);

    // Extract cost info if present
    const costInfo = (parsedData as any).__costInfo;
    const cleanData = { ...parsedData };
    delete (cleanData as any).__costInfo;

    // Log cost info for debugging
    if (costInfo) {
      console.log('Cost info being sent to client:', costInfo);
    } else {
      console.warn('No cost info found in parsed data');
    }

    return NextResponse.json({ 
      data: cleanData,
      costInfo: costInfo || null,
    });
  } catch (error: any) {
    console.error('Parse error:', error);
    console.error('Error stack:', error.stack);
    
    // Return more detailed error message
    const errorMessage = error.message || 'Failed to parse resume. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

