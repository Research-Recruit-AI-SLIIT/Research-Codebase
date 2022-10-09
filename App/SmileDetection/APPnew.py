# import the necessary packages
import token

from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np
import imutils
import argparse
import cv2

from flask import Flask, request, jsonify
import flask
from flask_cors import CORS, cross_origin
from collections import Counter
import re
import requests
import os
import jsonpickle

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


@app.route('/smile', methods=['GET'])
def smiledetection():
    print("-------------------------------------------------------------------")
    data = request.get_json(force=True)
    video_sas_url = data['video_sas_url']
    r = requests.get(video_sas_url, allow_redirects=True)
    filename = re.search('(?<=research/).*(?=\?)', video_sas_url).group(0).split("/")[1]
    print("\ndownload the Video from Database \t filename {}".format(filename))
    open(filename, 'wb').write(r.content)
    print("\nStart time: {} \t filename: {}".format(datetime.now(), filename))

    # Variables
    COUNTER_smile = 0
    COUNTER_notsmile = 0

    # load the face detector cascade and smile detector CNN

    print("\nload the face detector cascade and smile detector CNN \t filename {}".format(filename))
    detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    print("\nload the Model \t filename {}".format(filename))
    model = load_model('model.h5')



    camera = cv2.VideoCapture(filename)

    # keep looping
    while True:
        # grab the current frame
        (grabbed, frame) = camera.read()

        # if we are viewing a video and we did no grab a frame, then we
        # have reached the end of the video
        if (filename) and not grabbed:
            print('[INFO] no frame read from stream - exiting')
            break

        # resize the fram, convert it to grayscale, and then clone the
        # orgignal frame so we draw on it later in the program
        print("\nresize the fram, convert it to grayscale, and then clone the orginal frame \t filename {}".format(filename))
        frame = imutils.resize(frame, width=700)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frameClone = frame.copy()

        # detect faces in the input frame, then clone the frame so that we can draw onit
        print("\ndetect faces in the input frame, then clone the frame so that we can draw onit \t filename {}".format(filename))
        rects = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(
            30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

        for (fX, fY, fW, fH) in rects:
            # extract the ROI of the face from the grayscale image
            # resize it to a fixed 28x28 pixels, and then prepare the
            # ROI for classification via the CNN
            print("\nextract the ROI of the face from the grayscale image \t filename {}".format(filename))
            print("\nresize it to a fixed 28x28 pixels, and then prepare the \t filename {}".format(filename))


            roi = gray[fY:fY + fH, fX:fX + fW]
            roi = cv2.resize(roi, (28, 28))
            roi = roi.astype('float') / 255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)

            # determine the probaboilities of both 'smiling' and 'not smiling',
            # then set the label accordingly
            print("\ndetermine the probaboilities of both 'smiling' and 'not smiling and set the label accordingly \t filename {}".format(filename))
            (notSmiling, Smiling) = model.predict(roi)[0]
            label = 'Smiling' if Smiling > notSmiling else "Not Smiling"

            # display the label and bounding box on the output frame
            if label == 'Smiling':
                cv2.putText(frameClone, label, (fX, fY - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 2)
                cv2.rectangle(frameClone, (fX, fY),
                              (fX + fW, fY + fH), (0, 255, 0), 2)
                COUNTER_smile = COUNTER_smile + 1
            else:
                cv2.putText(frameClone, label, (fX, fY - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
                cv2.rectangle(frameClone, (fX, fY),
                              (fX + fW, fY + fH), (0, 0, 255), 2)
                COUNTER_notsmile = COUNTER_notsmile + 1



    # cleanup the camera and close any open windows
    camera.release()
    cv2.destroyAllWindows()

    try:
        if os.path.exists(filename):
            print("\nRemove the file from the Database\t filename {}".format(filename))
            os.remove(filename)
    except:
        pass

        # total frame count
        total = COUNTER_smile+ COUNTER_notsmile
        # if Smile frames has 75% or larger then status is good
        if COUNTER_smile / total >= 0.75:
            status = 'High'
        elif COUNTER_smile / total >= 0.6:
            status = 'Medium'
        else:
            status = 'Low'

        print("\nGenuine Smile is : ", status)

        # print process end time
        print("\nProcess End Time", datetime.now.strftime("%H:%M:%S") + "\t filename {}".format(filename))
        print("\n--------------------------------------------------------------------------")

        return {"status": status}


app.run(port=5006)
