import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import type { ResumeData } from '@/lib/types/resume';

// GET /api/resumes - Get all user's resumes
export async function GET() {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching resumes:', error);
      return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
    }

    return NextResponse.json({ resumes: resumes || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// POST /api/resumes - Create new resume
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const body = await request.json();
    const { resumeData, title, templateId } = body;

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: title || 'My Resume',
        resume_data: resumeData,
        template_id: templateId || 'aurora',
        saved_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating resume:', error);
      return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
    }

    return NextResponse.json({ resume });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// PUT /api/resumes - Update existing resume
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const body = await request.json();
    const { resumeId, resumeData, title, templateId } = body;

    if (!resumeId || !resumeData) {
      return NextResponse.json({ error: 'Resume ID and data are required' }, { status: 400 });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .update({
        title: title || 'My Resume',
        resume_data: resumeData,
        template_id: templateId || 'aurora',
        saved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating resume:', error);
      return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
    }

    return NextResponse.json({ resume });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}





