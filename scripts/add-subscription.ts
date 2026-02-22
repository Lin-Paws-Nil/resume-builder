/**
 * Script to add a 3-day subscription for a user
 * Usage: npx tsx scripts/add-subscription.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const envVars: Record<string, string> = {};
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env.local:', error);
    return {};
  }
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addSubscription() {
  const userEmail = 'swapnilbilimale32@gmail.com';
  
  try {
    // First, find the user by email in auth.users
    console.log(`Looking for user with email: ${userEmail}`);
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return;
    }
    
    const user = authUsers.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return;
    }
    
    console.log(`Found user: ${user.id} (${user.email})`);
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
      return;
    }
    
    if (!profile) {
      console.log('Profile does not exist, creating one...');
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: userEmail,
          username: userEmail.split('@')[0],
        });
      
      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        return;
      }
      console.log('Profile created successfully');
    }
    
    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3); // 3 days from now
    
    // Check if subscription already exists
    const { data: existingSub, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking subscription:', checkError);
      return;
    }
    
    if (existingSub) {
      console.log('Subscription already exists, updating it...');
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          plan: 'weekly', // Using weekly plan but with 3-day duration
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return;
      }
      console.log('Subscription updated successfully');
    } else {
      console.log('Creating new subscription...');
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: 'weekly', // Using weekly plan but with 3-day duration
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: true,
        });
      
      if (insertError) {
        console.error('Error creating subscription:', insertError);
        return;
      }
      console.log('Subscription created successfully');
    }
    
    console.log('\n✅ Success!');
    console.log(`User: ${userEmail}`);
    console.log(`Subscription: Weekly plan (3-day duration)`);
    console.log(`Start Date: ${startDate.toISOString()}`);
    console.log(`End Date: ${endDate.toISOString()}`);
    console.log(`Active: true`);
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
  }
}

addSubscription();

