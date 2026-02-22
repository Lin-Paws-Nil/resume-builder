'use client';

import type { ResumeData } from '@/lib/types/resume';
import { createClient } from '@/lib/supabase/client';

/**
 * Save resume to Supabase (for logged-in users)
 */
export async function saveResumeToSupabase(
  resume: ResumeData,
  userId: string
): Promise<{ success: boolean; resumeId?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Check if resume already exists
    const { data: existingResume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', resume.id)
      .eq('user_id', userId)
      .single();

    if (existingResume) {
      // Update existing resume
      const { data, error } = await supabase
        .from('resumes')
        .update({
          title: resume.title || 'My Resume',
          resume_data: resume,
          template_id: resume.templateId || 'aurora',
          saved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', resume.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating resume:', error);
        return { success: false, error: error.message };
      }

      return { success: true, resumeId: data.id };
    } else {
      // Create new resume
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          id: resume.id,
          user_id: userId,
          title: resume.title || 'My Resume',
          resume_data: resume,
          template_id: resume.templateId || 'aurora',
          saved_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating resume:', error);
        return { success: false, error: error.message };
      }

      return { success: true, resumeId: data.id };
    }
  } catch (error: any) {
    console.error('Error saving resume to Supabase:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Load user's resumes from Supabase
 */
export async function loadUserResumes(userId: string): Promise<ResumeData[]> {
  try {
    const supabase = createClient();

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading resumes:', error);
      return [];
    }

    // Convert database format to ResumeData format
    return (resumes || []).map((dbResume) => ({
      ...(dbResume.resume_data as ResumeData),
      id: dbResume.id,
      title: dbResume.title,
      templateId: dbResume.template_id,
    }));
  } catch (error) {
    console.error('Error loading resumes:', error);
    return [];
  }
}





