from gensim.models.doc2vec import Doc2Vec
from sklearn.metrics.pairwise import cosine_similarity
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import answer_preprocess

def calculate_simililarity(base_answer, sample_answer):
    """
    Calculate the cosine similarity of Doc2Vec vectorized answers
    """
    file = "C:\\Users\\USER\\Downloads\\enwiki_dbow\\doc2vec.bin"
    model = Doc2Vec.load(file)

    preprocessed_base_answer = answer_preprocess.preprocess_answer(base_answer)
    preprocessed_sample_answer = answer_preprocess.preprocess_answer(sample_answer)

    preprocessed_base_answer = list(filter(lambda x : x in model.wv.vocab.key(), preprocessed_base_answer))
    preprocessed_sample_answer = list(filter(lambda x : x in model.wv.vocab.key(), preprocessed_sample_answer))

    base_answer_vector = model.infer_vector(preprocessed_base_answer)
    sample_answer_vector = model.infer_vector(preprocessed_sample_answer)

    similarity = cosine_similarity([base_answer_vector], [sample_answer_vector])[0][0]

    return similarity