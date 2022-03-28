from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
import tensorflow_hub as hub

def calculate_similarity(base_answer, candidate_answer):
    """
    Calculate the cosine similarity of USE vectorized answers
    """
    embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder-large/5")

    base_answer_embedding = embed([base_answer])
    candidate_answer_embedding = embed([candidate_answer])

    similarity = cosine_similarity(base_answer_embedding, candidate_answer_embedding)

    return similarity