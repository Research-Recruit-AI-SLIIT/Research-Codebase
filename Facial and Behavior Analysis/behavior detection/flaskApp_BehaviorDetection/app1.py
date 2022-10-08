import cv2
import numpy as np
from keras.models import model_from_json
from flask import Flask 
import flask
from flask_cors import CORS, cross_origin
from collections import Counter
prediction=''

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True



@app.route('/behavior', methods=['GET'])
def predict():
    behavior_dict = {0: "normal", 1: "Scratching head", 2: "touching face"}
    behavior_count =[0 for  i in range(0,4)]

    behavior_count_dict = { 
        "normal"  : 0,
        "Scratching head" : 0,
        "touching face" : 0,
      
    }

    # load json and create model
    json_file = open('C:/Users/Okanda Liyanage/Desktop/behavior analysis/model.json ', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    emotion_model = model_from_json(loaded_model_json)

    # load weights into new model
    emotion_model.load_weights("C:/Users/Okanda Liyanage/Desktop/behavior analysis/behavior_model.h5")
    print("Loaded model from disk")

    # start the webcam feed
    #cap = cv2.VideoCapture(0)

    # pass here your video path
    # you may download one from here : https://www.pexels.com/video/three-girls-laughing-5273028/
    cap = cv2.VideoCapture("C:\\Users\\Okanda Liyanage\\Desktop\\behavior analysis\\video1.mp4")

    while True:

        # Find haar cascade to draw bounding box around face
        ret, frame = cap.read()
       
        if not ret:
            break
        frame = cv2.resize(frame, (1280, 720))
        face_detector = cv2.CascadeClassifier(r'C:\Users\Okanda Liyanage\Desktop\behavior analysis\haarcascade_frontalface_default.xml')
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # detect faces available on camera
        num_faces = face_detector.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

        # take each face available on the camera and Preprocess it
        for (x, y, w, h) in num_faces:
            cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (0, 255, 0), 4)
            roi_gray_frame = gray_frame[y:y + h, x:x + w]
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0)

            # predict the behaviors
            behavior_prediction = emotion_model.predict(cropped_img)
            maxindex = int(np.argmax(behavior_prediction))
            behavior_count[maxindex] += 1
            cv2.putText(frame, behavior_dict[maxindex], (x+5, y-20), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            prediction=behavior_prediction
            list1=list(behavior_dict[maxindex])

            
          
        #cv2.imshow('Emotion Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        for key,value in behavior_dict.items():
                print(value,':',behavior_count[key])
                behavior_count_dict[value] = behavior_count[key]
    return behavior_count_dict


    cap.release()
    cv2.destroyAllWindows()

app.run(port=5000)