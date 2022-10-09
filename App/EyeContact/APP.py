import datetime

import cv2 as cv
import numpy as np
import module as m
import time

from flask import Flask, request, jsonify
import flask
from flask_cors import CORS, cross_origin
import re
import requests
import os


app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


@app.route('/eyecontact', methods=['GET'])
def eyecontact():
    print("-------------------------------------------------------------------")
    data = request.get_json(force=True)
    video_sas_url = data['video_sas_url']
    r = requests.get(video_sas_url, allow_redirects=True)
    filename = re.search('(?<=research/).*(?=\?)', video_sas_url).group(0).split("/")[1]
    print("\ndownload the Video from Database \t filename {}".format(filename))
    open(filename, 'wb').write(r.content)

    start_time = time.time()
    print("\nStart time: {} \t filename: {}".format(datetime.now(), filename))
    print("\nStrat the preprocessing of the Video\t filename {}".format(filename))

    # Variables
    COUNTER = 0
    TOTAL_BLINKS = 0
    CLOSED_EYES_FRAME = 3
    cameraID = 0
    Righteye = 0
    Lefteye = 0
    Centereye = 0
    #videoPath = "Eyes-Tracking-Opencv-and-Dlib-master/video.mp4"
    # variables for frame rate.
    FRAME_COUNTER = 0
    START_TIME = time.time()
    FPS = 0

    # creating camera object

    # camera.set(3, 640)
    # camera.set(4, 480)
    camera = cv.VideoCapture(filename)


    while True:
        FRAME_COUNTER += 1
        # getting frame from camera
        ret, frame = camera.read()
        if ret == False:
            break
        print("\nconverting frame into Gry image\t filename {}".format(filename))
        # converting frame into Gry image.
        grayFrame = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
        height, width = grayFrame.shape
        circleCenter = (int(width/2), 50)
        # calling the face detector funciton
        image, face = m.faceDetector(frame, grayFrame)
        if face is not None:

            # calling landmarks detector funciton.
            image, PointList = m.faceLandmakDetector(
                frame, grayFrame, face, False)
            # print(PointList)

            # cv.putText(frame, f'FPS: {round(FPS,1)}',
            # (460, 20), m.fonts, 0.7, m.YELLOW, 2)
            RightEyePoint = PointList[36:42]
            LeftEyePoint = PointList[42:48]
            leftRatio, topMid, bottomMid = m.blinkDetector(LeftEyePoint)
            rightRatio, rTop, rBottom = m.blinkDetector(RightEyePoint)
            # cv.circle(image, topMid, 2, m.YELLOW, -1)
            # cv.circle(image, bottomMid, 2, m.YELLOW, -1)

            blinkRatio = (leftRatio + rightRatio)/2

            if blinkRatio > 4:
                COUNTER += 1
                # cv.putText(image, f'Blink', (70, 50),
                # m.fonts, 0.8, m.LIGHT_BLUE, 2)
                # print("blink")
            else:
                if COUNTER > CLOSED_EYES_FRAME:
                    TOTAL_BLINKS += 1
                    COUNTER = 0

            mask, pos, color = m.EyeTracking(frame, grayFrame, RightEyePoint)

            if pos == 'Left':
                Lefteye = Lefteye + 1
            elif pos == 'Right':
                Righteye = Righteye+1
            else:
                Centereye = Centereye + 1

            maskleft, leftPos, leftColor = m.EyeTracking(
                frame, grayFrame, LeftEyePoint)


        else:
            cv.imshow('Frame', frame)


        # calculating the seconds
        SECONDS = time.time() - START_TIME
        # calculating the frame rate
        FPS = FRAME_COUNTER/SECONDS
        # print(FPS)
        # defining the key to Quite the Loop

        key = cv.waitKey(1)

        # if q is pressed on keyboard: quit
        if key == ord('q'):

            break

    # closing  all the windows
    # cv.destroyAllWindows()

    left = Lefteye
    right = Righteye
    center = Centereye

    camera.release()

    try:
        print("\nRemove the file from the Database\t filename {}".format(filename))
        os.remove(filename)
    except:
        pass
    print("\nNo of frames for the Three Main Positions of the Eyes  : ",datetime.now().strftime("%H:%M:%S") +"\t filename {}".format(filename))
    print("No of left eye frames : ", left)
    print("No of right eye frames : ", right)
    print("No of center eye frames : ", center)

    # total frame count
    total = left + right + center
    # if center has 75% or larger then status is good
    if center / total >= 0.75:
        status = 'High'
    elif center / total >= 0.6:
        status = 'Medium'
    else:
        status = 'Low'

    print("\nEye Contact Level : ", status)

    # print process end time
    print("\nProcess End Time",datetime.now.strftime("%H:%M:%S")+"\t filename {}".format(filename))
    print("\n--------------------------------------------------------------------------")

    return {"status": status}


app.run(port=5003)
