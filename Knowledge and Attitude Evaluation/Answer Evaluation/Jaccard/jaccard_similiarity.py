#import libraries for Jaccard similarity
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def jaccard_similarity(base_answer, sample_answer):
    """
    Calculate the Jaccard similarity between two sets of answers
    """
    #convert the two sets of answers to sets
    base_answer = set(base_answer)
    sample_answer = set(sample_answer)
    #calculate the Jaccard similarity
    jaccard_similarity = len(base_answer & sample_answer) / len(base_answer | sample_answer)
    return jaccard_similarity
