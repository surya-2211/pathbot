import json
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

# Load knowledge
with open('../knowledge_base/career_docs.json', 'r') as f:
    docs = json.load(f)

texts = [doc['text'] for doc in docs]
ids = [doc['id'] for doc in docs]

# Embed
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(texts)

# Save index + metadata
index = faiss.IndexFlatL2(embeddings[0].shape[0])
index.add(np.array(embeddings))

with open("career_chunks.pkl", "wb") as f:
    pickle.dump(docs, f)

faiss.write_index(index, "career_index.faiss")

print("✅ Vector index built and saved!")
