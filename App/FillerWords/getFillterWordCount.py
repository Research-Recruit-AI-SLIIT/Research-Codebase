import os

from pydub import AudioSegment
from pydub.silence import split_on_silence
from tensorflow.keras.utils import to_categorical
from sklearn.preprocessing import LabelEncoder
import numpy as np
import get_features
import neural_network
import wave
import contextlib

#countPauses("../content analyzing/temp.wav")
ScoreforUserSilence = 70/100

def get_numpy_array(features_df):
    X = np.array(features_df.feature.tolist())
    y = np.array(features_df.class_label.tolist())
    # encode classification labels
    le = LabelEncoder()
    # one hot encoded labels
    yy = to_categorical(le.fit_transform(y))
    return X, yy, le

features_df = get_features.extract_features()
X, y, le = get_numpy_array(features_df)

def countFillerWords(filePath):

    fillerWordCount = 0
    sound = AudioSegment.from_wav(filePath)
    chunks = split_on_silence(sound, min_silence_len=200, silence_thresh=sound.dBFS - 16, keep_silence=150)



    # Chunk Folder file Path
    chunk_folder_name = "chunks"

    # create folder to store chunks
    if not os.path.isdir(chunk_folder_name):
        os.mkdir(chunk_folder_name)

    for i, audio_chunk in enumerate(chunks, start=1):
        chunk_file = os.path.join(chunk_folder_name, f"chunk{i}.wav")
        audio_chunk.export(chunk_file, format="wav", bitrate='192k')
        prediction = neural_network.predict(chunk_file, le, "trained_cnn.h5")
        print(prediction)
        if float(prediction["probability"]) > 0.99:
            fillerWordCount += 1


    print("****** How many  Filler pauses in your Speech *****")

    # print count of silence
    print("Filler pauses: ", fillerWordCount)

    fname = filePath
    with contextlib.closing(wave.open(fname, 'r')) as f:
        frames = f.getnframes()
    rate = f.getframerate()
    duration = frames / float(rate)
    #print(duration)

    filler_pauseTimeperiod = fillerWordCount * 200

    #duration = (duration*1000) / filler_pauseTimeperiod

    #print('you spoke filler pauses ' +str(duration)+'% ms in your speech: ')

    return {
        "message": str(fillerWordCount) + " : filler word/s found   ",
        "score": ScoreforUserSilence
    }
