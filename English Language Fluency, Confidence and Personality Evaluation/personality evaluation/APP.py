import flask
from flask_cors import CORS, cross_origin

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
    SplitFrames.FrameCapture("Demo_videos/_uNup91ZYw0.002.mp4")

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


    # loading the trained weights
    model.load_weights("weight.hdf5")

    # compiling the model
    model.compile(loss='categorical_crossentropy',optimizer='Adam',metrics=['accuracy'])

    # count = 0
    # # videoFile = test_videos[i]
    # cap = cv2.VideoCapture('UCF/Hello/Hello_1.mp4')   # capturing the video from the given path
    # frameRate = cap.get(5) #frame rate
    # print(frameRate)
    # x=1
    # # removing all other files from the temp folder
    # files = glob('temp/*')
    # for f in files:
    #     os.remove(f)
    # while(cap.isOpened()):
    #     frameId = cap.get(1) #current frame number
    #     ret, frame = cap.read()
    #     if (ret != True):
    #         break
    #     if (frameId % math.floor(frameRate) == 0):
    #         # storing the frames of this particular video in temp folder
    #         filename ='temp/' + "_frame%d.jpg" % count;count+=1
    #         cv2.imwrite(filename, frame)
    # cap.release()

    # reading all the frames from temp folder
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
    prediction_images = np.array(prediction_images)
    # extracting features using pre-trained model
    prediction_images = base_model.predict(prediction_images)

    # converting features in one dimensional array
    print(prediction_images.shape)
    prediction_images = prediction_images.reshape(prediction_images.shape[0], 7*7*512)
    # predicting tags for each array
    prediction = model.predict(prediction_images)
    # appending the mode of predictions in predict list to assign the tag to the video
    print(s.mode(prediction))
    print("Prediction mode")
    print(s.mode(prediction)[0][0])
    print("Prediction mode 1")
    print(np.argmax(s.mode(prediction)[0][0]))
    # predict.append(y.columns.values[s.mode(prediction)[0][0]])
    # appending the actual tag of the video
    # actual.append(videoFile.split('/')[1].split('_')[1])
    yVals = ["extraversion","neuroticism","agreeableness","conscientiousness","openness"]
    ret = yVals[np.argmax(s.mode(prediction)[0][0])]
    print(ret)
    prdict = ret

    return prdict

app.run(port=5000)
