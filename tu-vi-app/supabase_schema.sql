-- 1. Bảng lưu thông tin người dùng (Mở rộng từ Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bảng lưu trữ lá số đã lập
CREATE TABLE IF NOT EXISTS public.charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  gender TEXT,
  solar_day INTEGER,
  solar_month INTEGER,
  solar_year INTEGER,
  lunar_day INTEGER,
  lunar_month INTEGER,
  lunar_year INTEGER,
  birth_hour TEXT,
  chart_json JSONB, -- Lưu toàn bộ kết quả từ tuviEngine
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng lưu trữ tài liệu (Vector Store cho RAG)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT, -- Nội dung đoạn văn bản
  metadata JSONB, -- Thông tin về sách, trang, v.v.
  embedding VECTOR(768), -- Vector embedding (768 cho Gemini Embedding)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS charts_user_created_idx
  ON public.charts (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON public.documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM public.documents d
  WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Bật Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can insert own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can update own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can delete own charts" ON public.charts;
DROP POLICY IF EXISTS "Public can read documents" ON public.documents;

-- Policy: Người dùng chỉ xem được profile và chart của mình
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own charts" ON public.charts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own charts" ON public.charts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own charts" ON public.charts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own charts" ON public.charts FOR DELETE USING (auth.uid() = user_id);

-- Policy: Mọi người có thể đọc tài liệu (RAG)
CREATE POLICY "Public can read documents" ON public.documents FOR SELECT USING (true);

GRANT EXECUTE ON FUNCTION public.match_documents(vector(768), float, int) TO anon, authenticated;
