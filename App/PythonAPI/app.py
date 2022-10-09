from unittest import result
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, generate_container_sas, ContainerSasPermissions, generate_blob_sas, BlobSasPermissions, ResourceTypes
from datetime import datetime, timedelta
import moviepy.editor as mp
import azure.cognitiveservices.speech as speechsdk
import time
from dotenv import load_dotenv
from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
import requests
import json
from threading import Thread

app = Flask(__name__)
CORS(app)

load_dotenv()
BLOB_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
BLOB_ACCOUNT_NAME = os.getenv("BLOB_ACCOUNT_NAME")
BLOB_ACCOUNT_KEY = os.getenv("BLOB_ACCOUNT_KEY")
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
DB_CONNECTION_STRING = os.getenv('DB_CONNECTION_STRING')
FILLER_PAUSES_ENDPOINT = os.getenv("FILLER_PAUSES_ENDPOINT")
BEHAVIOUR_ANALYTICS_URL = os.getenv("BEHAVIOUR_ANALYTICS_URL")
EYE_CONTACT_ANALYTICS_URL = os.getenv("EYE_CONTACT_ANALYTICS_URL")
PERSONALITY_TRAITS_ENDPOINT = os.getenv("PERSONALITY_TRAITS_ENDPOINT")
SMILE_DETECTION_ENDPOINT = os.getenv("SMILE_DETECTION_ENDPOINT")
ANSWER_EVALUATION_ENDPOINT = os.getenv("ANSWER_EVALUATION_ENDPOINT")
MINDSET_EVALUATION_ENDPOINT = os.getenv("MINDSET_EVALUATION_ENDPOINT")
UNAUTHORIZED_OBJECT_DETECTION_ENDPOINT = os.getenv("UNAUTHORIZED_OBJECT_DETECTION_ENDPOINT")
LANGUAGE_FLUENCY_ENDPOINT = os.getenv("LANGUAGE_FLUENCY_ENDPOINT")
EMOTION_ANALYSIS_URL = os.getenv("EMOTION_ANALYSIS_URL")

blob_service_client = BlobServiceClient.from_connection_string(
    BLOB_CONNECTION_STRING)
speech_config = speechsdk.SpeechConfig(
    subscription=AZURE_SPEECH_KEY, region='centralindia')
speech_config.speech_recognition_language = 'en-IN'
db_client = MongoClient(DB_CONNECTION_STRING)
collection = db_client["yasiru"]


def download_blob(blob_name):
    print("\nDownloading blob to \local storage:\n\t" + blob_name)
    blob_client = blob_service_client.get_blob_client(
        container="research", blob=blob_name)

    if "/" in blob_name:
        blob_name = blob_name.split("/")[1]

    with open(blob_name, "wb") as my_blob:
        blob_data = blob_client.download_blob()


def generate_sas_url(container_name, blob_name):
    print("\nGenerating SAS URL for blob:\n\t" + blob_name)
    sas_token = generate_blob_sas(
        account_name=BLOB_ACCOUNT_NAME,
        account_key=BLOB_ACCOUNT_KEY,
        container_name=container_name,
        blob_name=blob_name,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(hours=1)
    )
    blob_url = f"https://{BLOB_ACCOUNT_NAME}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"
    return blob_url


def upload_blob(container_name, file_name):
    print("\nUploading to Azure Storage as blob:\n\t" + file_name)
    blob_client = blob_service_client.get_blob_client(
        container="audio", blob="test.txt")
    with open("test.txt", "rb") as data:
        blob_client.upload_blob(data, overwrite=True)

    blob_client_upload = blob_service_client.get_blob_client(
        container=container_name, blob=file_name)
    with open(file_name, "rb") as data:
        blob_client_upload.upload_blob(data, overwrite=True)


def extract_audio_from_video(video_sas_url, audio_file_name):
    print("\nExtracting audio from video:\n\t" + audio_file_name)
    my_clip = mp.VideoFileClip(video_sas_url, target_resolution=(1280, 720))
    my_clip.audio.write_audiofile(
        audio_file_name, fps=16000, nbytes=2, codec='pcm_s16le')
    my_clip.close()


def convert_audio_to_text(file_name):
    print("\nConverting audio to text:\n\t" + file_name)
    audio_config = speechsdk.audio.AudioConfig(filename=file_name)

    # Creates a recognizer with the given settings
    speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, audio_config=audio_config)

    done = False

    def stop_cb(evt):
        """callback that stops continuous recognition upon receiving an event `evt`"""
        nonlocal done
        done = True

    all_results = []

    def handle_final_result(evt):
        all_results.append(evt.result.text)

    speech_recognizer.recognized.connect(handle_final_result)
    speech_recognizer.session_stopped.connect(stop_cb)
    speech_recognizer.canceled.connect(stop_cb)

    # Start continuous speech recognition
    speech_recognizer.start_continuous_recognition()

    while not done:
        time.sleep(10)

    # all_results text array to paragraph
    paragraph = ' '.join(all_results)

    speech_recognizer.stop_continuous_recognition()

    print("\nConverted audio to text:\n\t" + paragraph)

    interviewAnswersId = file_name.split(".")[0]

    collection.interviewanswers.update_one(
        {"_id": ObjectId(interviewAnswersId)},
        {
            "$set": {
                "transcript": paragraph
            }
        }
    )

    return paragraph

def confidenceEvaluate(eyecontact, smile, emotion, behavior):
    #if any value is equal 'high' then the score is 3
    #if any value is equal 'average' then the score is 2
    #if any value is equal 'low' then the score is 1

    eyecontact = str(eyecontact).lower()
    smile = str(smile).lower()
    emotion = str(emotion).lower()
    behavior = str(behavior).lower()

    eyecontactScore = eyecontact == 'high' and 3 or eyecontact == 'average' and 2 or eyecontact == 'low' and 1
    smileScore = smile == 'high' and 3 or smile == 'average' and 2 or smile == 'low' and 1
    emotionScore = emotion == 'high' and 3 or emotion == 'average' and 2 or emotion == 'low' and 1
    behaviorScore = behavior == 'high' and 3 or behavior == 'average' and 2 or behavior == 'low' and 1

    #calculate the total score
    totalScore = eyecontactScore + smileScore + emotionScore + behaviorScore

    #if total score is greater than 8 then the confidence is 'high'
    #if total score is greater than 4 then the confidence is 'average'
    #if total score is less than 4 then the confidence is 'low'
    confidence = totalScore > 8 and 'high' or totalScore > 4 and 'average' or 'low'

    return confidence

def overallEvaluation(records):
    numRecords = len(records)

    confidenceScore = 0
    knowledgeScore = 0
    mindsetScore = 0
    fillerPausesCount = 0
    fillerWordsPercentage = 0
    silencePauseCount = 0
    unAuthorizedObjects = []
    personlity = []

    for record in records:
        record = record["result"]
        confidenceScore += record['confidence'] == 'high' and 3 or record['confidence'] == 'average' and 2 or record['confidence'] == 'low' and 1
        knowledgeScore += record['knowledge'] == 'Acceptable' and 3 or record['knowledge'] == 'Need Improvements' and 2 or record['knowledge'] == 'Not Acceptable' and 1
        mindsetScore += record['mindset'] == 'positive' and 1 or record['mindset'] == 'negative' and 0
        fillerPausesCount += record['fillerPausesCount']
        fillerWordsPercentage += record['fillerWordsPercentage']
        silencePauseCount += record['silencePausesCount']
        unAuthorizedObjects += record['unAuthorizedObjects']
        personlity.append(record['personality'])

    avgConfidenceScore = confidenceScore / numRecords
    avgKnowledgeScore = knowledgeScore / numRecords
    avgMindsetScore = mindsetScore / numRecords
    avgFillerPausesCount = fillerPausesCount / numRecords
    avgFillerWordsPercentage = fillerWordsPercentage / numRecords
    avgSilencePauseCount = silencePauseCount / numRecords
    unAuthorizedObjects = set(unAuthorizedObjects)
    unAuthorizedObjects = list(unAuthorizedObjects)
    personality = max(set(personlity), key = personlity.count)

    finalConfidence = avgConfidenceScore > 2.25 and 'high' or avgConfidenceScore > 1.5 and 'average' or 'low'
    finalKnowledge = avgKnowledgeScore > 2.25 and 'Good' or avgKnowledgeScore > 1.5 and 'Average' or 'Poor'
    finalMindset = avgMindsetScore > 0.5 and 'positive' or 'negative'

    return {
        'confidence': finalConfidence,
        'knowledge': finalKnowledge,
        'mindset': finalMindset,
        'avgFillerPausesCount': avgFillerPausesCount,
        'avgFillerWordsPercentage': avgFillerWordsPercentage,
        'avgSilencePauseCount': avgSilencePauseCount,
        'unAuthorizedObjects': unAuthorizedObjects,
        'personality': personality
    }

def executeProcess(interviewAnswersId):
    startTime = datetime.now()
    # generate sas url for the video
    video_sas_url = generate_sas_url(
        "research", "research/{}.mp4".format(interviewAnswersId))

    print(video_sas_url)

    video_file_name = "{}.mp4".format(interviewAnswersId)

    # extract audio from video
    audio_file_name = "{}.wav".format(interviewAnswersId)
    extract_audio_from_video(video_sas_url, audio_file_name)

    # upload audio to blob
    upload_blob("audio", audio_file_name)

    # convert audio to text
    extracted_text = convert_audio_to_text(audio_file_name)

    # delete audio and video file if exists
    if os.path.exists(audio_file_name):
        try:
            os.remove(audio_file_name)
        except OSError as e:
            pass
    if os.path.exists("{}.mp4".format(interviewAnswersId)):
        try:
            os.remove("{}.mp4".format(interviewAnswersId))
        except OSError as e:
            pass

    # generate sas url for the audio
    audio_sas_url = generate_sas_url("audio", audio_file_name)

    headers = {
        'Content-Type': 'application/json'
    }

    interviewAnswers = collection.interviewanswers.find_one({"_id": ObjectId(interviewAnswersId)})
    questionId = interviewAnswers["question"]
    questionData = collection.interviewquestions.find_one({"_id": ObjectId(questionId)})
    sample_answers = questionData["sampleAnswers"]
    questionType = questionData["questionType"]
    interviewSessionId = interviewAnswers["interviewSessionId"]

    #Answer Evaluation
    answerEvaluationPayload = json.dumps({
        "candidate_answer" : extracted_text,
        "sample_answers" : sample_answers,
        "questionAnswerId" : interviewAnswersId
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nQuestion Answer Id: " + interviewAnswersId)
    print("\nQuestion Type: " + questionType)
    print("\nCandidate Answer: " + extracted_text)
    print("\n\nProcess Start Time : " + str(startTime))


    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling answer evaluation endpoint:\n\t" + ANSWER_EVALUATION_ENDPOINT)

    answerEvaluationResponse = requests.request(
        "GET", ANSWER_EVALUATION_ENDPOINT, headers=headers, data=answerEvaluationPayload)

    print("\nResponse from answer evaluation endpoint:\n\t" + str(answerEvaluationResponse.json()))

    #Mindset Evaluaiton
    mindsetEvaluationPayload = json.dumps({
        "answer" : extracted_text,
        "questionAnswerId" : interviewAnswersId
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling mindset evaluation endpoint:\n\t" + MINDSET_EVALUATION_ENDPOINT)

    mindsetEvaluationResponse = requests.request(
        "GET", MINDSET_EVALUATION_ENDPOINT, headers=headers, data=mindsetEvaluationPayload)
        
    print("\nResponse from mindset evaluation endpoint:\n\t" + str(mindsetEvaluationResponse.json()))

    #Behaviour Analytics
    behaviourAnalyticsPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling Behaviour Analytics:\n\t" + video_file_name)

    behaviourAnalyticsResponse = requests.request(
        "GET", BEHAVIOUR_ANALYTICS_URL, headers=headers, data=behaviourAnalyticsPayload)

    print("\nBehaviour Analytics Response:\n\t" + str(behaviourAnalyticsResponse.json()))

    #Eye Contact Analytics
    eyeContactAnalyticsPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling Eye Contact Analytics:\n\t" + video_file_name)
    
    eyeContactAnalyticsResponse = requests.request(
        "GET", EYE_CONTACT_ANALYTICS_URL, headers=headers, data=eyeContactAnalyticsPayload)

    print("\nEye Contact Analytics Response:\n\t" + str(eyeContactAnalyticsResponse.json()))

    #Filler Pauses
    fillerPausesPayload = json.dumps({
        "audio_sas_url": audio_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling filler pauses endpoint:\n\t" + FILLER_PAUSES_ENDPOINT)

    fillerPausesResponse = requests.request(
        "GET", FILLER_PAUSES_ENDPOINT, headers=headers, data=fillerPausesPayload)

    
    print("\nResponse from filler pauses endpoint:\n\t" + str(fillerPausesResponse.json()))

    #Personality Traits
    personlaityTraitsPyaload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling personality traits endpoint:\n\t" + PERSONALITY_TRAITS_ENDPOINT)

    personalityTraitsResponse = requests.request(
        "GET", PERSONALITY_TRAITS_ENDPOINT, headers=headers, data=personlaityTraitsPyaload)

    print("\nResponse from personality traits endpoint:\n\t" + str(personalityTraitsResponse.json()))

    #Smile Detection
    smileDetectionPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling smile detection endpoint:\n\t" + SMILE_DETECTION_ENDPOINT)

    smileDetectionResponse = requests.request(
        "GET", SMILE_DETECTION_ENDPOINT, headers=headers, data=smileDetectionPayload)

    print("\nResponse from smile detection endpoint:\n\t" + str(smileDetectionResponse.json()))

    #Unauthroized Object Detection
    unauthorizedObjectDetectionPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling unauthorized object detection endpoint:\n\t" + UNAUTHORIZED_OBJECT_DETECTION_ENDPOINT)

    unauthorizedObjectDetectionResponse = requests.request(
        "GET", UNAUTHORIZED_OBJECT_DETECTION_ENDPOINT, headers=headers, data=unauthorizedObjectDetectionPayload)

    print("\nResponse from unauthorized object detection endpoint:\n\t" + str(unauthorizedObjectDetectionResponse.json())) 

    #Language Fluency 
    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling language fluency endpoint:\n\t" + LANGUAGE_FLUENCY_ENDPOINT)

    languageFluencyResponse = requests.request(
        "GET", LANGUAGE_FLUENCY_ENDPOINT, headers=headers, data=json.dumps({"audio_sas_url": audio_sas_url, "extracted_text": extracted_text, "questionAnswerId" :interviewAnswersId }))

    print("\nResponse from language fluency endpoint:\n\t" + str(languageFluencyResponse.json()))

    #Emotion Analysis
    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling Emotion analysis endpoint:\n\t" + EMOTION_ANALYSIS_URL)

    emotionAnalysisPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    emotionAnalysisResponse = requests.request(
        "GET", EMOTION_ANALYSIS_URL, headers=headers, data=emotionAnalysisPayload)

    print("\nResponse from confidence analysis endpoint:\n\t" + str(emotionAnalysisResponse.json()))

    #confidence analysis
    confidence = confidenceEvaluate(
        eyeContactAnalyticsResponse.json().get("status"),
        smileDetectionResponse.json().get("status"),
        emotionAnalysisResponse.json().get("status"),
        behaviourAnalyticsResponse.json().get("status")
    )

    resultQuestion = {
                    "confidence": confidence,
                    "knowledge" : answerEvaluationResponse.json().get("result"),
                    "mindset" : mindsetEvaluationResponse.json().get("result"),
                    "personality" : personalityTraitsResponse.json().get("personalitytraits"),
                    "unAuthorizedObjects" : unauthorizedObjectDetectionResponse.json().get("unauthorizedObjects"),
                    "fillerPausesCount" : fillerPausesResponse.json().get("count"),
                    "fillerWordsPercentage" : languageFluencyResponse.json().get("fillerWordPercentage"),
                    "silencePausesCount" : languageFluencyResponse.json().get("silencePauses")
                    }
    
    print("\n---------------------------------------------------------------------------------------")
    print("\n---------------------------------------------------------------------------------------")
    print("\nRESULT:\n\t" + str(resultQuestion))
    print("\n---------------------------------------------------------------------------------------")
    endTime = datetime.now()
    print("\nProcess End Time:\n\t" + str(endTime))
    print("\nDuration:\n\t" + str(endTime - startTime))
    print("\n---------------------------------------------------------------------------------------")

    #update the database result for the interviewAnswersId
    collection.interviewanswers.update_one(
        {"_id": ObjectId(interviewAnswersId)},
        {
            "$set": {
                "result": {
                    "confidence": confidence,
                    "knowledge" : answerEvaluationResponse.json().get("result"),
                    "mindset" : mindsetEvaluationResponse.json().get("result"),
                    "personality" : personalityTraitsResponse.json().get("personalitytraits"),
                    "unAuthorizedObjects" : unauthorizedObjectDetectionResponse.json().get("unauthorizedObjects"),
                    "fillerPausesCount" : fillerPausesResponse.json().get("count"),
                    "fillerWordsPercentage" : languageFluencyResponse.json().get("fillerWordsPercentage"),
                    "silencePausesCount" : languageFluencyResponse.json().get("silencePauses")
                    },
                "hasProcessed": True
            }
        }
    )

    #take all the interviewanswers where interviewSessionId = interviewSessionId and hasProcessed = True
    interviewAnswers = collection.interviewanswers.find({"interviewSessionId": ObjectId(interviewSessionId)})

    interviewAnswerList = []

    for interviewAnswer in interviewAnswers:
        interviewAnswerList.append(interviewAnswer)
        if interviewAnswer["hasProcessed"] == False:
            allDone = False
            break
        else:
            allDone = True

    if allDone:
        overallResult = overallEvaluation(interviewAnswerList)
        print("\n---------------------------------------------------------------------------------------")
        print("\n---------------------------------------------------------------------------------------")
        print("\nOVERALL RESULT:\n\t" + str(overallResult))
        print("\n---------------------------------------------------------------------------------------")

        #update the database result for the interviewSessionId
        collection.interviewsessions.update_one(
            {"_id": ObjectId(interviewSessionId)},
            {
                "$set": {
                    "result": overallResult,
                    "hasProcessed": True
                }
            }
        )

@app.route('/evaluateAnswer', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    interviewAnswersId = data['interviewAnswersId']

    thread = Thread(target=executeProcess, args=(interviewAnswersId,))
    thread.start()

    return jsonify({"status": "success"})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
