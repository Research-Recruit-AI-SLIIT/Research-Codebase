from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, Embedding, Bidirectional, Flatten, Input, Lambda, concatenate
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import sparse_categorical_crossentropy
from tensorflow.keras.metrics import sparse_categorical_accuracy
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
import numpy as np
import string
import pandas as pd


class AnswerEvaluation:
    def __init__(self):
        print("AnswerEvaluation class is initialized")

    def load_data(self, data_path):
        """
        Load data from csv file
        """
        print("Loading data from csv file...")
        df = pd.read_csv(data_path)
        return df

    def preprocess_data_for_model_training(self, df, model_ans_col='Model_Answer', ans_col='Answer'):
        """
        Preprocess data
        """
        print("Preprocessing data...")

        df[model_ans_col] = df[model_ans_col].apply(lambda x: x.lower())
        df[model_ans_col] = df[model_ans_col].apply(
            lambda x: x.translate(str.maketrans('', '', string.punctuation)))
        df[model_ans_col] = df[model_ans_col].apply(lambda x: x.strip())

        df[ans_col] = df[ans_col].apply(lambda x: x.lower())
        df[ans_col] = df[ans_col].apply(lambda x: x.translate(
            str.maketrans('', ' ', string.punctuation)))
        df[ans_col] = df[ans_col].apply(lambda x: x.strip())

        print("Data preprocessing is done")
        return df

    def train_model(self, data, model_ans_col='Model_Answer', ans_col='Answer', label_col='Category'):
        """
        Train model
        """
        print("Training model...")

        tokenizer = Tokenizer(oov_token="<OOV>")
        tokenizer.fit_on_texts(data[model_ans_col].values)
        tokenizer.fit_on_texts(data[ans_col].values)
        word_index = tokenizer.word_index
        print("Found %s unique tokens." % len(word_index))

        data[model_ans_col] = tokenizer.texts_to_sequences(
            data[model_ans_col].values)
        data[ans_col] = tokenizer.texts_to_sequences(data[ans_col].values)

        data[model_ans_col] = pad_sequences(data[model_ans_col], maxlen=100)
        data[ans_col] = pad_sequences(data[ans_col], maxlen=100)

        # split data for deep learning model training and testing
        X_train, X_test, y_train, y_test = train_test_split(
            data[model_ans_col, ans_col], data[label_col], test_size=0.2, random_state=42)

        # convert to one-hot encoding
        y_train = to_categorical(y_train, num_classes=None)
        y_test = to_categorical(y_test, num_classes=None)

        # embeddings_index
        embeddings_index = {}
        f = open('../Data/glove.6B.100d.txt', encoding='utf-8')
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:], dtype='float32')
            embeddings_index[word] = coefs
        f.close()

        # convert the text into sequences
        sequences_model_answer_training = tokenizer.texts_to_sequences(
            X_train[model_ans_col].values)
        sequences_answer_training = tokenizer.texts_to_sequences(
            X_train[ans_col].values)

        # pad the sequences
        padded_model_answer_training = pad_sequences(
            sequences_model_answer_training, maxlen=100)
        padded_answer_training = pad_sequences(
            sequences_answer_training, maxlen=100)

        # create the embedding matrix
        embedding_matrix = np.zeros((len(tokenizer.word_index) + 1, 100))
        for word, i in tokenizer.word_index.items():
            embedding_vector = embeddings_index.get(word)
            if embedding_vector is not None:
                embedding_matrix[i] = embedding_vector


        # create the embedding layer
        embedding_layer = Embedding(len(tokenizer.word_index) + 1,
                                    100,
                                    weights=[embedding_matrix],
                                    trainable=True)


        # create the model
        input_model_answer = Input(shape=(100,))
        input_answer = Input(shape=(100,))

        embedding_model_answer = embedding_layer(input_model_answer)
        embedding_answer = embedding_layer(input_answer)

        # get the differnce of the embedding vectors
        diff_model_ans = Lambda(
            lambda x: x[0] - x[1])([embedding_model_answer, embedding_answer])

        # apply the LSTM layer
        lstm_model_answer = Bidirectional(
            LSTM(100, return_sequences=True))(diff_model_ans)

        lstm_answer = Bidirectional(LSTM(100, return_sequences=True))(embedding_answer)

        # apply dropout
        dropout_model_answer = Dropout(0.5)(lstm_model_answer)
        dropout_answer = Dropout(0.5)(lstm_answer)

        # apply the Dense layer
        dense_model_answer = Dense(100, activation='relu')(dropout_model_answer)
        dense_answer = Dense(100, activation='relu')(dropout_answer)

        # concatenate the outputs
        concatenate_model_answer = concatenate([dense_model_answer, dense_answer])

        # apply Dense layer
        dense_model1 = Dense(100, activation='relu')(concatenate_model_answer)

        # apply dropout
        dropout_model1 = Dropout(0.3)(dense_model1)

        # reduce the dimensionality
        dense_model2 = Dense(100, activation='relu')(dropout_model1)

        # include Flatten layer
        flatten_model_answer = Flatten()(dense_model2)

        # apply Dense layer - output layer
        output_model_answer = Dense(3, activation='softmax')(flatten_model_answer)

        # create the model
        model = Model(inputs=[input_model_answer, input_answer],
                    outputs=output_model_answer)


        # compile the model
        model.compile(loss='categorical_crossentropy',
                    optimizer=Adam(lr=0.0001), metrics=['accuracy'])

        # fit the model
        model.fit([padded_model_answer_training, padded_answer_training], y_train, epochs=100, batch_size=32,
                validation_split=0.3, callbacks=[EarlyStopping(monitor='val_loss', patience=5)])
        
        # evaluate the model
        scores = model.evaluate([padded_model_answer_training, padded_answer_training], y_train, verbose=0)

        print("Accuracy: %.2f%%" % (scores[1]*100))

        # test the model
        test_pred = model.predict([X_test[model_ans_col], X_test[ans_col]])
        test_pred = np.argmax(test_pred, axis=1)
        test_pred = pd.Series(test_pred, name='Category')

        print("Training model is done")
        return data, tokenizer, word_index
