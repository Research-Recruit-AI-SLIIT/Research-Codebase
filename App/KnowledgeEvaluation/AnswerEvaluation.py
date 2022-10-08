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
    
            testdf = pd.DataFrame(
                columns=['Model_Answer', 'Answer'])
            testdf.loc[0] = [sample_answer, candidate_answer]

            prediction = self.model.predict([testdf["Model_Answer"].iloc[0:1], testdf["Answer"].iloc[0:1]])
            prediction = np.argmax(prediction)
            results.append(prediction)

            print("Model Answer: ", testdf["Model_Answer"].iloc[0])
            print("Candidate Answer: ", testdf["Answer"].iloc[0])

            print("Prediction: ", prediction)

            if prediction == 2:
                break

        result = max(results)

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
