export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: number;
          title: string;
          content: string;
          excerpt: string | null;
          author_id: string;
          author_name: string;
          featured_image: string | null;
          status: 'draft' | 'published' | 'archived';
          category: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          excerpt?: string | null;
          author_id: string;
          author_name: string;
          featured_image?: string | null;
          status?: 'draft' | 'published' | 'archived';
          category?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          excerpt?: string | null;
          author_id?: string;
          author_name?: string;
          featured_image?: string | null;
          status?: 'draft' | 'published' | 'archived';
          category?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      events: {
        Row: {
          id: number;
          title: string;
          description: string;
          date: string;
          time: string;
          end_time: string | null;
          location: string;
          category: string | null;
          image: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          date: string;
          time: string;
          end_time?: string | null;
          location: string;
          category?: string | null;
          image?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          end_time?: string | null;
          location?: string;
          category?: string | null;
          image?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {
        Row: {
          id: number;
          name: string;
          website: string;
          level: 'platinum' | 'gold' | 'silver' | 'bronze';
          logo: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          website: string;
          level: 'platinum' | 'gold' | 'silver' | 'bronze';
          logo?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          website?: string;
          level?: 'platinum' | 'gold' | 'silver' | 'bronze';
          logo?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin' | 'editor' | 'member';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'admin' | 'editor' | 'member';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'admin' | 'editor' | 'member';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
      };
      volunteer_opportunities: {
        Row: {
          id: number;
          title: string;
          description: string;
          date: string | null;
          time_commitment: string;
          spots_available: number;
          spots_filled: number;
          category: string | null;
          contact_email: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          date?: string | null;
          time_commitment: string;
          spots_available: number;
          spots_filled?: number;
          category?: string | null;
          contact_email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          date?: string | null;
          time_commitment?: string;
          spots_available?: number;
          spots_filled?: number;
          category?: string | null;
          contact_email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

