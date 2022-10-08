from abc import abstractmethod
from keras.models import load_model
import tensorflow as tf
import keras 
import tensorflow_hub as hub
import tensorflow_text
import pandas as pd
from sklearn.preprocessing import LabelBinarizer
import numpy as np

class MindSetEvaluation:
    def __init__(self, model_path = ".\Models\20221006-083342", encorder_classes = ".\Models\encoder.npy"):
        self.model_path = model_path
        self.label_encoder = LabelBinarizer()
        self.label_encoder.fit(np.load(encorder_classes))
        self.model = keras.models.load_model(self.model_path)
    
    # abstract method preprocess_data
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
        text = [t.translate(str.maketrans('', '', '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')) for t in text]
        text = [t.translate(str.maketrans('', '', '0123456789')) for t in text]

        return text
    

    def predict(self, text):
        """
        Predicts the negative, postive or neutral

        Parameters
        ----------
        text : list
            The text to be preprocessed

        Returns
        -------
        list
        """
        text = self.preprocess_data(text)
        predictions = self.model.predict(text)
        predictions = self.label_encoder.inverse_transform(predictions)
        return predictions

    
