from heapq import heappop
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



@app.route('/Emotion', methods=['GET'])
def predict():

    #angry=0
    #disgust=0
    #fear=0
    #happy=0
    #neutral=0
    #sad=0
    #suprise=0

    emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}
    Emotion_count =[0 for  i in range(0,7)]
    emotion_count_dict = { 
        "Angry"  : 0,
        "Disgusted" : 0,
        "Fearful" : 0,
        "Happy" : 0,
        "Neutral" : 0,
        "Sad" : 0,
        "Surprised" : 0
    }

    # load json and create model
    json_file = open('C:/Users/Okanda Liyanage/Desktop/emotion/Emotion_detection_with_CNN-main/model/emotion_model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    emotion_model = model_from_json(loaded_model_json)

    # load weights into new model
    emotion_model.load_weights("C:/Users/Okanda Liyanage/Desktop/emotion/Emotion_detection_with_CNN-main/model/emotion_model.h5")
    print("Loaded model from disk")

    # start the webcam feed
    #cap = cv2.VideoCapture(0)

    # pass here your video path
    # you may download one from here : https://www.pexels.com/video/three-girls-laughing-5273028/
    #cap = cv2.VideoCapture("C:\\Users\\Okanda Liyanage\\Desktop\\emotion\\Emotion_detection_with_CNN-main\\video.mp4")
    cap = cv2.VideoCapture("video.mp4")
    total=0
    happy_neutral =0
    while True:

        # Find haar cascade to draw bounding box around face
        ret, frame = cap.read()
      
        if not ret:
            break
        frame = cv2.resize(frame, (1280,720))
        face_detector = cv2.CascadeClassifier('haarcascades/haarcascade_frontalface_default.xml')
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # detect faces available on camera
        num_faces = face_detector.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

        # take each face available on the camera and Preprocess it
        for (x, y, w, h) in num_faces:
            cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (0, 255, 0), 4)
            roi_gray_frame = gray_frame[y:y + h, x:x + w]
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0)

            # predict the emotions
            emotion_prediction = emotion_model.predict(cropped_img)
            maxindex = int(np.argmax(emotion_prediction))
     #       if maxindex =='Angry':
                #angry=angry+1
            #elif maxindex=='Disgusted':
                #disgust = disgust +1
            #elif maxindex == 'Fearful':
                #fear = fear +1
            #elif maxindex =='Happy':
                #happy = happy +1
            #elif maxindex =='Neutral':
                #neutral = neutral +1

            #elif maxindex =='Sad':
                #sad= sad + 1
            #else:
                #suprise=suprise+1  

            Emotion_count[maxindex] += 1
            cv2.putText(frame, emotion_dict[maxindex], (x+5, y-20), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            prediction=emotion_prediction
            #list1=list(emotion_dict[maxindex])

            
            #count = list1.count( "Angry")
        #   print(list1.count("Neutral"))
            #print(len(list1))
        
    for key,value in emotion_dict.items():
        print(value,':',Emotion_count[key])
        emotion_count_dict[value] = Emotion_count[key]
    
    for key,value in emotion_dict.items():
        total+=Emotion_count[key]
        if key=="Happy" or "Neutral":
            happy_neutral+=Emotion_count[key]
    status=""
    if float(happy_neutral/total)>0.75:
        status ="High"
    elif float(happy_neutral/total)>0.6:
        status ="Medium"
    else:
        status="Low"

    print(status)            
    return status


    cap.release()
    cv2.destroyAllWindows()

app.run(port=5000)