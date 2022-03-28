from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(base_answer, sample_answer):
    """
    Calculate the cosine similarity of tfid vectorized answers
    """
    tfidf = TfidfVectorizer().fit_transform([base_answer, sample_answer])
    similarity = cosine_similarity(tfidf[0], tfidf[1]).flatten()[0]

    return similarity
