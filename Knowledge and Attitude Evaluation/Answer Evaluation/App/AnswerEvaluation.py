from abc import abstractmethod
from keras.models import load_model
import tensorflow as tf
import keras
import tensorflow_hub as hub
import tensorflow_text
import pandas as pd
import numpy as np
from sklearn.metrics import pairwise

class AnswerEvaluation:
    def __init__(self, model_path="./model.h5"):
        print("Loading Model")
        self.model_path = model_path
        self.model = tf.keras.models.load_model((model_path), custom_objects={
                                                'KerasLayer': hub.KerasLayer})
        self.BERT_MODEL = "https://tfhub.dev/tensorflow/bert_en_uncased_L-12_H-768_A-12/4"
        self.PREPROCESS_MODEL = "https://tfhub.dev/tensorflow/bert_en_uncased_preprocess/3"
        self.preprocess = hub.load(self.PREPROCESS_MODEL)
        self.bert = hub.load(self.BERT_MODEL)
        print("Model Loading Completed")

    @abstractmethod
    def preprocess_data(self, text):
        """
        Preprocesses the data

        Parameters
        ----------
        text : list
            The text to be preprocessed

        Returns
        -------
        list
        """
        text = [t.lower() for t in text]
        text = [t.translate(str.maketrans(
            '', '', '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')) for t in text]
        text = [t.translate(str.maketrans('', '', '0123456789')) for t in text]

        return text

    @abstractmethod
    def calCosineSimilarity(self, model_ans, ans):
        model_ans_embed = self.bert(self.preprocess([model_ans]))[
            "pooled_output"]
        ans_embed = self.bert(self.preprocess([ans]))["pooled_output"]

        cosine_sim = pairwise.cosine_similarity(model_ans_embed, ans_embed)

        print("Cosine Similarity: ", cosine_sim[0])

        return cosine_sim[0]

    @abstractmethod
    def get_length_ratio(self, model_ans, ans):
        print("model_ans: ", model_ans)
        print("ans: ", ans)
        length_ration = len(model_ans) / len(ans)
        print("Length Ratio: ", length_ration)
        return length_ration

    def predict(self, sample_answers, candidate_answer):
        """
        Predicts whether the answer is Good, Need Improvement or Not Acceptable
        """
        sample_answers = self.preprocess_data(sample_answers)
        candidate_answer = self.preprocess_data([candidate_answer])[0]

        results = []

        for sample_answer in sample_answers:
            print(
                "\n------------------------------------------------------------------------")
            length_ratio = self.get_length_ratio(
                sample_answer, candidate_answer)
            cosine_similarity = self.calCosineSimilarity(
                sample_answer, candidate_answer)

            testdf = pd.DataFrame(
                columns=['Model_Answer', 'Answer', 'LengthRatio', 'Cosine_Similarity'])
            testdf.loc[0] = [sample_answer, candidate_answer,
                             length_ratio, cosine_similarity]

            prediction = self.model.predict([testdf["Model_Answer"].iloc[0:1], testdf["Answer"].iloc[0:1], np.asarray(
                testdf[['LengthRatio', 'Cosine_Similarity']].iloc[0:1]).astype(np.float32)])
            prediction = np.argmax(prediction)
            results.append(prediction)

            print("Prediction: ", prediction)

            if prediction == 2:
                break

        result = results.index(max(results))

        if result == 0:
            result = "Not Acceptable"
        elif result == 1:
            result = "Need Improvement"
        else:
            result = "Good"

        print("\n------------------------------------------------------------------------")
        print("Final Evaluation : Answer is ", result)
        print("------------------------------------------------------------------------")

        return "Final Evaluation : Answer is ", result
