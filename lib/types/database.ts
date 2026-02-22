export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          profile_picture_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'weekly' | 'monthly' | 'annual';
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'free' | 'weekly' | 'monthly' | 'annual';
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'free' | 'weekly' | 'monthly' | 'annual';
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          resume_data: any; // JSONB
          template_id: string;
          bucket_name: string | null;
          created_at: string;
          updated_at: string;
          saved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          resume_data: any;
          template_id?: string;
          bucket_name?: string | null;
          created_at?: string;
          updated_at?: string;
          saved_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          resume_data?: any;
          template_id?: string;
          bucket_name?: string | null;
          created_at?: string;
          updated_at?: string;
          saved_at?: string | null;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_method_id: string;
          type: string;
          last4: string | null;
          brand: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_payment_method_id: string;
          type: string;
          last4?: string | null;
          brand?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_payment_method_id?: string;
          type?: string;
          last4?: string | null;
          brand?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          amount: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          amount: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          amount?: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}





