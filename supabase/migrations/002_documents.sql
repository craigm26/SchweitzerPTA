-- Document Management System Migration
-- Run this in your Supabase SQL Editor after creating a 'documents' storage bucket

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT CHECK (category IN ('newsletters', 'forms', 'policies', 'meeting-minutes', 'flyers', 'other')),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policies for documents (all documents are public)
CREATE POLICY "Documents are viewable by everyone" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Editors and admins can insert documents" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can update documents" ON public.documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete documents" ON public.documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Apply updated_at trigger
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- NEWS DOCUMENTS JUNCTION TABLE (for attaching documents to news)
-- ============================================
CREATE TABLE IF NOT EXISTS public.news_documents (
  id SERIAL PRIMARY KEY,
  news_id INTEGER REFERENCES public.news(id) ON DELETE CASCADE,
  document_id INTEGER REFERENCES public.documents(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(news_id, document_id)
);

-- Enable RLS
ALTER TABLE public.news_documents ENABLE ROW LEVEL SECURITY;

-- Policies for news_documents
CREATE POLICY "News documents viewable by everyone" ON public.news_documents
  FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage news documents" ON public.news_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ============================================
-- STORAGE BUCKET SETUP (run manually in Supabase dashboard)
-- ============================================
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket called 'documents'
-- 3. Set it to public
-- 4. Add policy: Allow public read access
-- 5. Add policy: Allow authenticated users with admin/editor role to upload
