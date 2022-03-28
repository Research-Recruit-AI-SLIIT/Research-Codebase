
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def preprocess_answer(answer):
    """
    Preprocess the answer to lowercase, remove punctuation, stopwords, and lemmatize
    """
    #lowercase
    answer = answer.lower()
    #remove punctuation
    answer = re.sub(r'[^\w\s]','',answer)
    #remove stopwords
    stop_words = set(stopwords.words('english'))
    answer = [word for word in answer.split() if word not in stop_words]
    #lemmatize
    lemmatizer = WordNetLemmatizer()
    answer = [lemmatizer.lemmatize(word) for word in answer]

    return answer

