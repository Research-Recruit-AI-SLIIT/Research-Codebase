import datetime

from flask import Flask, request, jsonify
import flask
from flask_cors import CORS, cross_origin
import re
import requests
import os

from glob import glob
import numpy as np
from keras.applications.vgg16 import VGG16
from keras.layers import Dense, Dropout
from keras.models import Sequential
from keras.preprocessing import image
from scipy import stats as s
import SplitFrames

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


@app.route('/personalitytraits', methods=['GET'])
def personalitytraits():
    print("-------------------------------------------------------------------")
    data = request.get_json(force=True)
    video_sas_url = data['video_sas_url']
    r = requests.get(video_sas_url, allow_redirects=True)
    filename = re.search('(?<=research/).*(?=\?)', video_sas_url).group(0).split("/")[1]
    print("\ndownload the Video from Database \t filename {}".format(filename))
    open(filename, 'wb').write(r.content)

    print("\nStart time: {} \t filename: {}".format(datetime.now(), filename))
    print("\nVideo Split to the the frames \t filename {}".format(filename))

    SplitFrames.FrameCapture(filename)

    base_model = VGG16(weights='imagenet', include_top=False)

    #defining the model architecture
    model = Sequential()
    model.add(Dense(1024, activation='relu', input_shape=(25088,)))
    model.add(Dropout(0.5))
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(5, activation='softmax'))

    print("\nLoad The Model \t filename {}".format(filename))
    # loading the trained weights
    model.load_weights("weight.hdf5")

    # compiling the model
    model.compile(loss='categorical_crossentropy',optimizer='Adam',metrics=['accuracy'])

   
    # reading all the frames from temp folder
    print("\nRead All the frames \t filename {}".format(filename))
    images = glob("Demo_Frames/*.jpg")

    prediction_images = []
    for i in range(len(images)):
        print(images[i])
        img = image.load_img(images[i], target_size=(250,250,3))
        img = image.img_to_array(img)
        img = img / 255
        prediction_images.append(img)

    predict = []
    print(len(prediction_images))
    # converting all the frames for a test video into numpy array
    print("\nconverting all the frames of video into numpy array \t filename {}".format(filename))
    prediction_images = np.array(prediction_images)
    # extracting features using pre-trained model
    print("\nextracting features using pre-trained model \t filename {}".format(filename))
    prediction_images = base_model.predict(prediction_images)

    # converting features in one dimensional array
    print("\nconverting features in one dimensional array \t filename {}".format(filename))
    print(prediction_images.shape)
    prediction_images = prediction_images.reshape(prediction_images.shape[0], 7*7*512)
    # predicting tags for each array
    print("\npredicting tags for each array \t filename {}".format(filename))
    prediction = model.predict(prediction_images)
    # appending the mode of predictions in predict list to assign the tag to the video
    print("\nappending the mode of predictions in predict list to assign the tag to the video \t filename {}".format(filename))
    print(s.mode(prediction))
    print("Prediction mode")
    print(s.mode(prediction)[0][0])
    print("Prediction mode 1")
    print(np.argmax(s.mode(prediction)[0][0]))
    # predict.append(y.columns.values[s.mode(prediction)[0][0]])
    # appending the actual tag of the video
    print("\nappending the actual tag of the video \t filename {}".format(filename))
    # actual.append(videoFile.split('/')[1].split('_')[1])
    yVals = ["extraversion","neuroticism","agreeableness","conscientiousness","openness"]
    ret = yVals[np.argmax(s.mode(prediction)[0][0])]
    print(ret)
    prdict = ret

    try:
        os.remove(filename)
    except:
        pass
    print("\nProcess End Time", datetime.now.strftime("%H:%M:%S") + "\t filename {}".format(filename))
    print("\n--------------------------------------------------------------------------")
    return {"personalitytraits": prdict}

app.run(port=5005)
