import os
import re
import argparse
from collections import defaultdict

def search_texts(query_terms, context_words=50):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(current_dir, "extracted_text")
    
    if not os.path.exists(output_dir):
        print(f"Error: {output_dir} does not exist. Run extract_pdfs.py first.")
        return

    results = defaultdict(list)
    
    # Process each query term for case-insensitive exact matching or phrase matching
    regex_terms = [re.compile(re.escape(term), re.IGNORECASE) for term in query_terms]

    try:
        for filename in os.listdir(output_dir):
            if filename.endswith(".txt"):
                filepath = os.path.join(output_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Tokenize content loosely for context extraction
                    words = content.split()
                    content_lower = content.lower()
                    
                    for term, regex_term in zip(query_terms, regex_terms):
                        # Find all occurrences of the term
                        for match in regex_term.finditer(content):
                            start_idx = match.start()
                            end_idx = match.end()
                            
                            # Naive mapping of character index to word index (approximate context)
                            pre_text = content[max(0, start_idx - context_words*5):start_idx]
                            post_text = content[end_idx:min(len(content), end_idx + context_words*5)]
                            
                            # Clean up the snippet
                            snippet = f"...{pre_text.strip()} >>>{content[start_idx:end_idx]}<<< {post_text.strip()}..."
                            snippet = re.sub(r'\s+', ' ', snippet) # flatten newlines
                            
                            results[filename].append({
                                'term': term,
                                'snippet': snippet
                            })
                            
    except Exception as e:
         print(f"Error during search: {e}")
         
    # Print results
    total_matches = sum(len(matches) for matches in results.values())
    print(f"\nFound {total_matches} matches across {len(results)} files.\n")
    
    for filename, matches in results.items():
        print(f"--- File: {filename} ({len(matches)} matches) ---")
        for i, match in enumerate(matches[:10]): # Limit to top 10 per file to avoid spam
            print(f"Match {i+1} for '{match['term']}':\n{match['snippet']}\n")
        if len(matches) > 10:
            print(f"... and {len(matches) - 10} more matches in this file.\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Search extracted PDF texts.")
    parser.add_argument("terms", nargs="+", help="Terms to search for.")
    parser.add_argument("--context", type=int, default=30, help="Approximate number of characters for context.")
    
    args = parser.parse_args()
    search_texts(args.terms, context_words=args.context)
