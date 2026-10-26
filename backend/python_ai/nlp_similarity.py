"""
CareerMatch AI - Python NLP & Similarity Matching Microservice
Provides TF-IDF Vectorization, Cosine Similarity matching, and Natural Language Skill Extraction.
Can be executed as a standalone script or invoked via CLI/API.
"""

import sys
import json
import math
import re
from collections import Counter

def tokenize(text):
    text = text.lower()
    tokens = re.findall(r'[a-zA-Z0-9+#]+', text)
    stopwords = {
        'the', 'and', 'for', 'with', 'in', 'on', 'at', 'to', 'from', 'by', 'an', 'a',
        'is', 'are', 'was', 'were', 'or', 'of', 'as', 'be', 'this', 'that', 'it', 'we', 'you'
    }
    return [t for t in tokens if t not in stopwords and len(t) > 1]

def compute_tf(tokens):
    tf = Counter(tokens)
    total = len(tokens) or 1
    return {k: v / total for k, v in tf.items()}

def compute_idf(corpus_tokens):
    n_docs = len(corpus_tokens) or 1
    doc_freq = Counter()
    for tokens in corpus_tokens:
        unique = set(tokens)
        for term in unique:
            doc_freq[term] += 1
    return {k: math.log((1 + n_docs) / (1 + count)) + 1 for k, count in doc_freq.items()}

def compute_tfidf(tf, idf):
    vec = {}
    for term, val in tf.items():
        vec[term] = val * idf.get(term, 1.0)
    return vec

def cosine_similarity(vec1, vec2):
    all_terms = set(vec1.keys()).union(set(vec2.keys()))
    if not all_terms:
        return 0.0
    dot_product = sum(vec1.get(t, 0.0) * vec2.get(t, 0.0) for t in all_terms)
    norm1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
    norm2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot_product / (norm1 * norm2)

def calculate_match(user_profile_text, job_descriptions):
    user_tokens = tokenize(user_profile_text)
    all_docs = [user_tokens] + [tokenize(j) for j in job_descriptions]
    idf = compute_idf(all_docs)
    user_vec = compute_tfidf(compute_tf(user_tokens), idf)
    
    scores = []
    for j_desc in job_descriptions:
        j_tokens = tokenize(j_desc)
        j_vec = compute_tfidf(compute_tf(j_tokens), idf)
        sim = cosine_similarity(user_vec, j_vec)
        # Normalize to 0-100%
        scores.append(round(sim * 100, 2))
    return scores

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # CLI invocation: pass JSON input {"profile": "...", "opportunities": ["...", "..."]}
        try:
            input_data = json.loads(sys.argv[1])
            profile_text = input_data.get('profile', '')
            opportunities = input_data.get('opportunities', [])
            results = calculate_match(profile_text, opportunities)
            print(json.dumps({'status': 'success', 'scores': results}))
        except Exception as e:
            print(json.dumps({'status': 'error', 'message': str(e)}))
    else:
        # Demonstration test
        test_profile = "Skilled Python Developer with experience in React, Machine Learning, SQL, and REST APIs."
        test_jobs = [
            "Looking for a Python Developer Intern with Machine Learning and SQL database skills.",
            "Marketing Specialist with digital communication and social media strategy experience."
        ]
        test_scores = calculate_match(test_profile, test_jobs)
        print("CareerMatch AI Python NLP Similarity Engine Active!")
        print(f"Match Score for Tech Role: {test_scores[0]}%")
        print(f"Match Score for Non-Tech Role: {test_scores[1]}%")
