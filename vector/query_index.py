import faiss, pickle, sys
from sentence_transformers import SentenceTransformer
import numpy as np
import json

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load index and metadata
index = faiss.read_index("../vector/career_index.faiss")
with open("../vector/career_chunks.pkl", "rb") as f:
    data = pickle.load(f)

# Take user query from CLI arg
query = sys.argv[1]
q_vec = model.encode([query])

# Search for top 3 results
_, I = index.search(np.array(q_vec), 3)
results = [data[i]['text'] for i in I[0]]

# Return as JSON string
print(json.dumps(results))
