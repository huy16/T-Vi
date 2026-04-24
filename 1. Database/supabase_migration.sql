-- ============================================
-- RAG Pipeline: Supabase pgvector Setup
-- Chạy toàn bộ SQL này trong Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Documents table (lưu text chunks + embeddings)
create table if not exists documents (
  id bigserial primary key,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(768),
  created_at timestamp with time zone default now()
);

-- 3. Index for fast similarity search
create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. Search function: tìm chunks liên quan nhất theo embedding
create or replace function match_documents(
  query_embedding vector(768),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. RLS (Row Level Security) - cho phép anon key đọc
alter table documents enable row level security;

create policy "Allow public read access"
  on documents for select
  using (true);

create policy "Allow service role insert"
  on documents for insert
  with check (true);
