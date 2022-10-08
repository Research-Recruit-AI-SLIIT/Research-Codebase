import cv2
import numpy as np
from flask import Flask, request, jsonify 
import flask
from flask_cors import CORS, cross_origin
from collections import Counter
import re
import requests
import os
prediction=''



app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


@app.route('/Object', methods=['GET'])
def predict():
    data = request.get_json(force=True)
    video_sas_url = data['video_sas_url']
    r = requests.get(video_sas_url, allow_redirects=True)
    filename = re.search('(?<=research/).*(?=\?)', video_sas_url).group(0).split("/")[1]
    open(filename, 'wb').write(r.content)

    net = cv2.dnn.readNet('yolov3-tiny.weights', 'yolov3-tiny.cfg')

    classes = []
    with open("coco.names", "r") as f:
        classes = f.read().splitlines()

    cap = cv2.VideoCapture(filename)
    font = cv2.FONT_HERSHEY_PLAIN
    colors = np.random.uniform(0, 255, size=(100, 3))
    detected_labels =set()
    while True:
        _, img = cap.read()

        if not _:
            break
        height, width, _ = img.shape

        blob = cv2.dnn.blobFromImage(img, 1/255, (416, 416), (0,0,0), swapRB=True, crop=False)
        net.setInput(blob)
        output_layers_names = net.getUnconnectedOutLayersNames()
        layerOutputs = net.forward(output_layers_names)

        boxes = []
        confidences = []
        class_ids = []

        for output in layerOutputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.2:
                    center_x = int(detection[0]*width)
                    center_y = int(detection[1]*height)
                    w = int(detection[2]*width)
                    h = int(detection[3]*height)

                    x = int(center_x - w/2)
                    y = int(center_y - h/2)

                    boxes.append([x, y, w, h])
                    confidences.append((float(confidence)))
                    class_ids.append(class_id)

        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.2, 0.4)

        if len(indexes)>0:
            for i in indexes.flatten():
                x, y, w, h = boxes[i]
                label = str(classes[class_ids[i]])
                detected_labels.add(label)
                confidence = str(round(confidences[i],2))
                color = colors[i]
                cv2.rectangle(img, (x,y), (x+w, y+h), color, 2)
                cv2.putText(img, label + " " + confidence, (x, y+20), font, 2, (255,255,255), 2)


    cap.release()

    try:
        if os.path.exists(filename):
            os.remove(filename)
    except:
        pass

    print(detected_labels)
    return list(detected_labels)

app.run(port=5009)