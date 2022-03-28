import imp


import preprocess_answers

def calculate_jaccard_similarity(base_answer, sample_answer):
    """
    Calculate the Jaccard similarity between two sets of answers
    """
    base_answer = set(preprocess_answers.preprocess_answer(base_answer))
    sample_answer = set(preprocess_answers.preprocess_answer(sample_answer))

    # Calculate the Jaccard similarity
    similarity = len(base_answer.intersection(sample_answer)) / len(base_answer.union(sample_answer))

    return similarity
