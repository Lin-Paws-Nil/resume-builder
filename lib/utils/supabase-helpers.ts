import { createClient } from '@/lib/supabase/server';
import type { ResumeData } from '@/lib/types/resume';

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

/**
 * Get user's resumes
 */
export async function getUserResumes(userId: string) {
  const supabase = await createClient();
  
  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }

  return resumes || [];
}

/**
 * Save resume to database
 */
export async function saveResumeToDatabase(
  userId: string,
  resume: ResumeData,
  resumeId?: string
) {
  const supabase = await createClient();
  
  const resumeData = {
    user_id: userId,
    title: resume.title || 'My Resume',
    resume_data: resume,
    template_id: resume.templateId || 'aurora',
    saved_at: new Date().toISOString(),
  };

  if (resumeId) {
    // Update existing resume
    const { data, error } = await supabase
      .from('resumes')
      .update(resumeData)
      .eq('id', resumeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating resume:', error);
      throw error;
    }

    return data;
  } else {
    // Create new resume
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        ...resumeData,
        id: resume.id || crypto.randomUUID(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating resume:', error);
      throw error;
    }

    return data;
  }
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string) {
  const supabase = await createClient();
  
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // No active subscription found
    return null;
  }

  return subscription;
}





