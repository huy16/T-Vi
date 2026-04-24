/**
 * RAG Service - Retrieval-Augmented Generation
 * Searches Supabase pgvector for relevant Tử Vi book excerpts.
 */

import { supabase } from './supabaseClient';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const EMBEDDING_MODEL = 'gemini-embedding-001';

/**
 * Generate embedding vector for a query text using Gemini API.
 */
async function generateEmbedding(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!response.ok) {
    console.error('Embedding API error:', response.status);
    return null;
  }

  const data = await response.json();
  return data?.embedding?.values || null;
}

/**
 * Search for relevant book excerpts using vector similarity.
 * @param {string} query - The user's question
 * @param {number} matchCount - Number of results to return
 * @returns {Array} Matching document chunks with content and metadata
 */
export async function searchRelevantContext(query, matchCount = 5) {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    if (!embedding) {
      console.warn('RAG: Could not generate embedding');
      return [];
    }

    // Search Supabase for similar documents
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: matchCount,
    });

    if (error) {
      console.error('RAG search error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('RAG service error:', err);
    return [];
  }
}

/**
 * Format RAG results into a context string for the chatbot.
 * @param {Array} results - Results from searchRelevantContext
 * @returns {string} Formatted context for system prompt injection
 */
export function formatRAGContext(results) {
  if (!results || results.length === 0) return '';

  const contextParts = results.map((doc, i) => {
    const meta = doc.metadata || {};
    const source = meta.book || 'Sách Tử Vi';
    const page = meta.page ? ` (trang ${meta.page})` : '';
    return `[${i + 1}] ${source}${page}:\n${doc.content}`;
  });

  return `
📚 KIẾN THỨC THAM KHẢO TỪ SÁCH TỬ VI KINH ĐIỂN:
${contextParts.join('\n\n')}

Hãy tham khảo và trích dẫn các đoạn sách trên khi luận giải nếu liên quan. Ghi rõ nguồn trích dẫn.
`;
}
