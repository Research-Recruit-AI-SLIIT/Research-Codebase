import yake
from nltk.corpus import stopwords

def keyPhraseExtraction_yake(text):
    stop_words = set(stopwords.words('english'))
    kw_extractor = yake.KeywordExtractor(top=10, stopwords=stop_words)
    keywords = kw_extractor.extract_keywords(text)
    for kw, v in keywords:
        print("Keyphrase: ", kw, ": score", v)
