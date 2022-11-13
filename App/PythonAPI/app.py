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
import wave
import contextlib

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
collection = db_client["recruitai"]


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
    with contextlib.closing(wave.open(audio_file_name,'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)
    return duration


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

def  getInsightsFromOverallEvaluation(finalConfidence, finalKnowledge, finalMindset, finalCommunication, finalKnowledgeAreas, behaviorAnalyticsCounts, finalEyeContact, finalSmile):
    goodFeedback = []
    badFeedback = []
    avgFeedback = []

    #if the confidence is 'low' then the insight is 'Candidate is not confident'
    if finalConfidence == 'Low':
        badFeedback.append('From your facial expressions and language, it seems like you are not confident about your answers.')
    elif finalConfidence == 'Average':
        avgFeedback.append('From your facial expressions and language, it is not clear if you are confident about your answers. Therefore we recommend you to practice more.')
    else:
        goodFeedback.append('From your facial expressions and language, it seems like you are confident about your answers.')

    #if the knowledge is 'low' then the insight is 'Candidate is not confident'
    if finalKnowledge == 'Poor':
        badFeedback.append('From your answers, it seems you are not good at the questions asked. We recommend you to take more practice tests and explore more about the topic.')
    elif finalKnowledge == 'Average':
        avgFeedback.append('From your answers, it is not clear if you are good at the questions asked. Therefore we recommend you to take more practice tests and explore more about the topic.')
    else:
        goodFeedback.append('From your answers, it seems like you are good at the questions asked. Keep up the good work!')
    
    #if the mindset is 'low' then the insight is 'Candidate is not confident'
    if finalMindset == 'Negative':
        badFeedback.append('From your answers, it does not reflect you have positive attitudes. We recommend you to take more practice tests and always try to be optimistic. This might because your language is not clear.')
    elif finalMindset == 'Neutral':
        avgFeedback.append('From your answers, it is not clear if you have positive attitudes. Therefore we recommend you to take more practice tests and always try to be optimistic. This might because your language is not clear.')
    else:
        goodFeedback.append('From your answers, it seems like you have positive attitudes. Excellent!')

    #communication 
    if finalCommunication == 'Low':
        badFeedback.append('We recommend you to improve your communication skills. English Language fluency is important for your career. You can take more practice tests and test your English Language skills.')
    elif finalCommunication == 'Average':
        avgFeedback.append('It seems you are not very good nor bad very poor in Communication. We recommend you to improve your communication skills. Communication skills are important for your career. You can take more practice tests and test your skills.')
    else:
        goodFeedback.append('You are good at Communication. Excellent!')

    #eye contact
    if finalEyeContact == 'Low':
        badFeedback.append('We recommend you to improve your eye contact. Eye contact is important in an interview and it will help you to give a good impression to the interviewer.')
    elif finalEyeContact == 'Average':
        avgFeedback.append('It will be ideal if you improve your eye contact. Eye contact is important in an interview and it will help you to give a good impression to the interviewer.')
    else:
        goodFeedback.append('You have a good eye contact during the interview. Excellent!')

    #smile
    if finalSmile == 'Low':
        badFeedback.append('We recommend you to improve your smile. It will help you to give a good impression to the interviewer.')
    elif finalSmile == 'Average':
        avgFeedback.append('It will be ideal if you improve your smile. It will help you to give a good impression to the interviewer.')
    else:
        goodFeedback.append('We noticed you have a good smile during the interview. Great!')

    #check behavior analytics "Scratching head" percentage is greater than 5% of total frames
    scratchHeadPercentage = behaviorAnalyticsCounts['Scratching head'] / sum(behaviorAnalyticsCounts.values()) * 100

    if scratchHeadPercentage > 5:
        avgFeedback.append("We noticed you are scratching your head, during the interview. This might because you are not confident about your answers. So, it will be ideal to ignore this behavior and focus on your answers.")

    #check behavior analytics "touching face" percentage is greater than 5% of total frames

    touchingFacePercentage = behaviorAnalyticsCounts['touching face'] / sum(behaviorAnalyticsCounts.values()) * 100

    if touchingFacePercentage > 5:
        avgFeedback.append("We noticed you are touching your face, during the interview. This might because you are not confident about your answers. So, it will be ideal to ignore this behavior and focus on your answers.")

    #knowledge are insights
    goodKnowledgeAreas = []
    badKnowledgeAreas = []

    #finalKnowledgeAreas is a dictionary
    for key, value in finalKnowledgeAreas.items():
        if value == 'Poor':
            badKnowledgeAreas.append(key)
        elif value == 'Average':
            badKnowledgeAreas.append(key)
        else:
            goodKnowledgeAreas.append(key)


    return {
        'goodFeedback': goodFeedback,
        'badFeedback': badFeedback,
        'goodKnowledgeAreas': goodKnowledgeAreas,
        'badKnowledgeAreas': badKnowledgeAreas,
        'avgFeedback': avgFeedback
    }

    


def communicationSkillsEvaluation(fillerPausesCount,fillerWordsPercentage, silencePausesPerMinute, evaluationMatrices):
    comm_fwp_good = evaluationMatrices['comm_fwp_good']
    comm_fwp_avg = evaluationMatrices['comm_fwp_avg']
    comm_fpp_good = evaluationMatrices['comm_fpp_good']
    comm_fpp_avg = evaluationMatrices['comm_fpp_avg']
    comm_sppm_good = evaluationMatrices['comm_sppm_good']
    comm_sppm_avg = evaluationMatrices['comm_sppm_avg']
    com_fw = evaluationMatrices['com_fw']
    com_fp = evaluationMatrices['com_fp']
    com_sp = evaluationMatrices['com_sp']

    fillerWordsPercentage = float(fillerWordsPercentage)
    silencePausesPerMinute = float(silencePausesPerMinute)
    fillerPausesCount = int(fillerPausesCount)

    fillerWordsPercentageScore = fillerWordsPercentage < comm_fwp_good and 3 or fillerWordsPercentage < comm_fwp_avg and 2 or 1
    fillerPausesCountScore = fillerPausesCount < comm_fpp_good and 3 or fillerPausesCount < comm_fpp_avg and 2 or 1
    silencePausesPerMinuteScore = silencePausesPerMinute < comm_sppm_good and 3 or silencePausesPerMinute < comm_sppm_avg and 2 or 1

    totalScore = ((fillerWordsPercentageScore * com_fw) + (fillerPausesCountScore * com_fp) + (silencePausesPerMinuteScore * com_sp)) / (com_fw + com_fp + com_sp)

    communicationSkills = totalScore > 2 and 'high' or totalScore > 1 and 'average' or 'low'

    return communicationSkills

def overallEvaluation(records, evaluationMatrices):
    overall_knowd = evaluationMatrices['overall_knowd']
    overall_positive = evaluationMatrices['overall_positive']
    overall_con = evaluationMatrices["overall_con"]
    overall_comm = evaluationMatrices["overall_comm"]

    numRecords = len(records)
    numKnoRecs = 0
    numMindRecs = 0

    confidenceScore = 0
    knowledgeScore = 0
    mindsetScore = 0
    fillerPausesCount = 0
    fillerWordsPercentage = 0
    silencePauseCount = 0
    silencePausesPerMinute = 0
    communicationSkillScore = 0
    smile = 0
    eyeContact = 0
    unAuthorizedObjects = []
    personlity = []
    knowledgeScore = 0
    mindsetScore = 0
    behaviorAnalyticsCounts = {
        "normal"  : 0,
        "Scratching head" : 0,
        "touching face" : 0,
    }

    knowledgeAreas = {}

    for record in records:
        questionId = record["question"]
        questionData = collection.interviewquestions.find_one({"_id": ObjectId(questionId)})
        questionType = questionData["questionType"]
        record = record["result"]

        confidenceScore += record['confidence'] == 'high' and 3 or record['confidence'] == 'average' and 2 or record['confidence'] == 'low' and 1
        if questionType == "Knowledge Evaluation":
            numKnoRecs += 1
            knowledgeArea = questionData["knowledgeArea"]
            kScore = record['knowledge'] == 'Acceptable' and 3 or record['knowledge'] == 'Need Improvement' and 2 or record['knowledge'] == 'Not Acceptable' and 1
            if knowledgeArea not in knowledgeAreas.keys():
                knowledgeAreas[knowledgeArea] = [kScore]
            else:
                knowledgeAreas[knowledgeArea].append(kScore)
            knowledgeScore += kScore
        elif questionType == "Mind Evaluation":
            numMindRecs += 1
            mindsetScore += record['mindset'] == 'Positive' and 3 or record['mindset'] == 'Neutral' and 2 or record['mindset'] == 'Negative' and 1
        communicationSkillScore += record['communicationSkillLevel'] == 'high' and 3 or record['communicationSkillLevel'] == 'average' and 2 or record['communicationSkillLevel'] == 'low' and 1
        smile += record['smile'] == 'high' and 3 or record['smile'] == 'average' and 2 or record['smile'] == 'low' and 1
        eyeContact += record['eyeContact'] == 'high' and 3 or record['eyeContact'] == 'average' and 2 or record['eyeContact'] == 'low' and 1
        fillerPausesCount += record['fillerPausesCount']
        fillerWordsPercentage += record['fillerWordsPercentage']
        silencePauseCount += record['silencePausesCount']
        unAuthorizedObjects += record['unAuthorizedObjects']
        silencePausesPerMinute += record['silencePausesPerMinute']
        behaviorAnalyticsCounts = {k: behaviorAnalyticsCounts.get(k, 0) + record['behaviorAnalyticsCounts'].get(k, 0) for k in set(behaviorAnalyticsCounts) | set(record['behaviorAnalyticsCounts'])}
        personlity.append(record['personality'])

    avgConfidenceScore = confidenceScore / numRecords
    avgSmileScore = smile / numRecords
    avgEyeContactScore = eyeContact / numRecords
    avgKnowledgeScore = numKnoRecs > 0 and knowledgeScore / numKnoRecs or 0
    avgMindsetScore = numMindRecs > 0 and mindsetScore / numMindRecs or 0
    avgCommunicationSkillScore = communicationSkillScore / numRecords
    avgFillerPausesCount = fillerPausesCount
    avgFillerWordsPercentage = fillerWordsPercentage / numRecords
    avgSilencePauseCount = silencePauseCount
    avgSilencePausesPerMinute = silencePausesPerMinute / numRecords
    unAuthorizedObjects = set(unAuthorizedObjects)
    unAuthorizedObjects = list(unAuthorizedObjects)
    personlity = dict((i, personlity.count(i)) for i in personlity)
    personlity = [k for k, v in personlity.items() if v == max(personlity.values())]

    #evaluate the Knowledge Areas 
    knowledgeAreaEvaluation = {}
    for key, value in knowledgeAreas.items():
        eval_know_area = sum(value) / len(value)
        knowledgeAreaEvaluation[key] = eval_know_area > 2.25 and 'Good' or eval_know_area > 1.5 and 'Average' or 'Poor'


    finalConfidence = avgConfidenceScore > 2.25 and 'High' or avgConfidenceScore > 1.5 and 'Average' or 'Low'
    finalKnowledge = avgKnowledgeScore > 2.25 and 'Good' or avgKnowledgeScore > 1.5 and 'Average' or 'Poor'
    finalMindset = avgMindsetScore > 2.25 and 'Positive' or avgMindsetScore > 1.5 and 'Neutral' or 'Negative'
    finalCommunication = avgCommunicationSkillScore > 2.25 and 'High' or avgCommunicationSkillScore > 1.5 and 'Average' or 'Low'
    finalSmile = avgSmileScore > 2.25 and 'High' or avgSmileScore > 1.5 and 'Average' or 'Low'
    finalEyeContact = avgEyeContactScore > 2.25 and 'High' or avgEyeContactScore > 1.5 and 'Average' or 'Low'

    totalScore = ((avgConfidenceScore * overall_con) + (avgKnowledgeScore * overall_knowd) + (avgMindsetScore * overall_positive) + (avgFillerWordsPercentage * overall_comm)) / (overall_con + overall_knowd + overall_positive + overall_comm)

    overallEvaluationMark = (totalScore / ((3 *(overall_con + overall_knowd + overall_positive + overall_comm)) / (overall_con + overall_knowd + overall_positive + overall_comm))) * 100

    insights = getInsightsFromOverallEvaluation(finalConfidence, finalKnowledge, finalMindset, finalCommunication, knowledgeAreaEvaluation, behaviorAnalyticsCounts, finalEyeContact, finalSmile)

    return {
        'confidence': finalConfidence,
        'knowledge': finalKnowledge,
        'mindset': finalMindset,
        'avgFillerPausesCount': avgFillerPausesCount,
        'avgFillerWordsPercentage': avgFillerWordsPercentage,
        'avgSilencePauseCount': avgSilencePauseCount,
        'unAuthorizedObjects': unAuthorizedObjects,
        'personality': personlity,
        'overallEvaluationMark': overallEvaluationMark,
        'communicationSkillLevel': finalCommunication,
        'avgSilencePausesPerMinute': avgSilencePausesPerMinute,
        'knowledgeAreaEvaluation': knowledgeAreaEvaluation,
        'insights': insights
    }

def executeProcess(interviewAnswersId):
    #check whether the interview is already evaluated
    interviewAnswersData = collection.interviewanswers.find_one({"_id": ObjectId(interviewAnswersId)})
    if interviewAnswersData["hasProcessed"]:
        return "Interview has already been evaluated"
        
    startTime = datetime.now()
    # generate sas url for the video
    video_sas_url = generate_sas_url(
        "research", "research/{}.mp4".format(interviewAnswersId))

    print(video_sas_url)

    video_file_name = "{}.mp4".format(interviewAnswersId)

    # extract audio from video
    audio_file_name = "{}.wav".format(interviewAnswersId)
    audioTime = extract_audio_from_video(video_sas_url, audio_file_name)

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

    print("\n---------------------------------------------------------------------------------------")
    print("\nQuestion Answer Id: " + interviewAnswersId)
    print("\nQuestion Type: " + questionType)
    print("\nCandidate Answer: " + extracted_text)
    print("\n\nProcess Start Time : " + str(startTime))

    answerEvaluationResponse = None
    mindsetEvaluationResponse = None

    if(questionType == "Knowledge Evaluation"):
            #Answer Evaluation
        answerEvaluationPayload = json.dumps({
            "candidate_answer" : extracted_text,
            "sample_answers" : sample_answers,
            "questionAnswerId" : interviewAnswersId
        })
        print("\n---------------------------------------------------------------------------------------")
        print("\nCalling answer evaluation endpoint:\n\t" + ANSWER_EVALUATION_ENDPOINT)
        print("\nPayload:\n\t" + answerEvaluationPayload)
        try:
            answerEvaluationResponse = requests.request(
                "GET", ANSWER_EVALUATION_ENDPOINT, headers=headers, data=answerEvaluationPayload)
        except:
            answerEvaluationResponse = { "result" : "Not Acceptable" }
            print("\nAnswer Evaluation Error Occured")

        print("\nResponse from answer evaluation endpoint:\n\t" + str(answerEvaluationResponse.json()))

    if(questionType == "Mind Evaluation"):
        #Mindset Evaluaiton
        mindsetEvaluationPayload = json.dumps({
            "answer" : [extracted_text],
            "questionAnswerId" : interviewAnswersId
        })

        print("\n---------------------------------------------------------------------------------------")
        print("\nCalling mindset evaluation endpoint:\n\t" + MINDSET_EVALUATION_ENDPOINT)

        try:
            mindsetEvaluationResponse = requests.request(
                "GET", MINDSET_EVALUATION_ENDPOINT, headers=headers, data=mindsetEvaluationPayload)
        except:
            mindsetEvaluationResponse = { "result" : "negative" }
            print("\nMindset Evaluation Error Occured")
            
        print("\nResponse from mindset evaluation endpoint:\n\t" + str(mindsetEvaluationResponse.json()))

    #Behaviour Analytics
    behaviourAnalyticsPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling Behaviour Analytics:\n\t" + video_file_name)

    print("\nPayload:\n\t" + behaviourAnalyticsPayload)

    try:
        behaviourAnalyticsResponse = requests.request(
            "GET", BEHAVIOUR_ANALYTICS_URL, headers=headers, data=behaviourAnalyticsPayload)
    except:
        behaviourAnalyticsResponse = { "status" : "low" }
        print("\nBehaviour Analytics Error Occured")


    print("\nBehaviour Analytics Response:\n\t" + str(behaviourAnalyticsResponse.json()))

    #Eye Contact Analytics
    eyeContactAnalyticsPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling Eye Contact Analytics:\n\t" + video_file_name)
    
    try:
        eyeContactAnalyticsResponse = requests.request(
            "GET", EYE_CONTACT_ANALYTICS_URL, headers=headers, data=eyeContactAnalyticsPayload)
    except:
        eyeContactAnalyticsResponse = { "status" : "low" }
        print("\nEye Contact Analytics Error Occured")

    print("\nEye Contact Analytics Response:\n\t" + str(eyeContactAnalyticsResponse.json()))

    #Filler Pauses
    fillerPausesPayload = json.dumps({
        "audio_sas_url": audio_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling filler pauses endpoint:\n\t" + FILLER_PAUSES_ENDPOINT)

    try:
        fillerPausesResponse = requests.request(
            "GET", FILLER_PAUSES_ENDPOINT, headers=headers, data=fillerPausesPayload)
    except:
        fillerPausesResponse = { "count" : 0 }
        print("\nFiller Pauses Error Occured")

    
    print("\nResponse from filler pauses endpoint:\n\t" + str(fillerPausesResponse.json()))

    #Personality Traits
    personlaityTraitsPyaload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling personality traits endpoint:\n\t" + PERSONALITY_TRAITS_ENDPOINT)

    try:
        personalityTraitsResponse = requests.request(
            "GET", PERSONALITY_TRAITS_ENDPOINT, headers=headers, data=personlaityTraitsPyaload)
    except:
        personalityTraitsResponse = { "personalitytraits" : "None" }
        print("\nPersonality Traits Error Occured")

    print("\nResponse from personality traits endpoint:\n\t" + str(personalityTraitsResponse.json()))

    #Smile Detection
    smileDetectionPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling smile detection endpoint:\n\t" + SMILE_DETECTION_ENDPOINT)

    try:
        smileDetectionResponse = requests.request(
            "GET", SMILE_DETECTION_ENDPOINT, headers=headers, data=smileDetectionPayload)
    except:
        smileDetectionResponse = { "status" : "low" }
        print("\nSmile Detection Error Occured")

    print("\nResponse from smile detection endpoint:\n\t" + str(smileDetectionResponse.json()))

    #Unauthroized Object Detection
    unauthorizedObjectDetectionPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling unauthorized object detection endpoint:\n\t" + UNAUTHORIZED_OBJECT_DETECTION_ENDPOINT)

    try:
        unauthorizedObjectDetectionResponse = requests.request(
            "GET", UNAUTHORIZED_OBJECT_DETECTION_ENDPOINT, headers=headers, data=unauthorizedObjectDetectionPayload)
    except:
        unauthorizedObjectDetectionResponse = { "unauthorizedObjects" : [] }
        print("\nUnauthorized Object Detection Error Occured")

    print("\nResponse from unauthorized object detection endpoint:\n\t" + str(unauthorizedObjectDetectionResponse.json())) 

    #Language Fluency 
    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling language fluency endpoint:\n\t" + LANGUAGE_FLUENCY_ENDPOINT)

    try:
        languageFluencyResponse = requests.request(
            "GET", LANGUAGE_FLUENCY_ENDPOINT, headers=headers, data=json.dumps({"audio_sas_url": audio_sas_url, "extracted_text": extracted_text, "questionAnswerId" :interviewAnswersId }))
    except:
        languageFluencyResponse = { "fillerWordPercentage" : 0, "silencePauses" : 0 }
        print("\nLanguage Fluency Error Occured")

    print("\nResponse from language fluency endpoint:\n\t" + str(languageFluencyResponse.json()))

    #Emotion Analysis
    print("\n---------------------------------------------------------------------------------------")
    print("\nCalling Emotion analysis endpoint:\n\t" + EMOTION_ANALYSIS_URL)

    emotionAnalysisPayload = json.dumps({
        "video_sas_url": video_sas_url
    })

    try:
        emotionAnalysisResponse = requests.request(
            "GET", EMOTION_ANALYSIS_URL, headers=headers, data=emotionAnalysisPayload)
    except:
        emotionAnalysisResponse = { "status" : "low" }
        print("\nEmotion Analysis Error Occured")

    print("\nResponse from confidence analysis endpoint:\n\t" + str(emotionAnalysisResponse.json()))

    #confidence analysis
    confidence = confidenceEvaluate(
        eyeContactAnalyticsResponse.json().get("status"),
        smileDetectionResponse.json().get("status"),
        emotionAnalysisResponse.json().get("status"),
        behaviourAnalyticsResponse.json().get("status")
    )

    personality = personalityTraitsResponse.json().get("personalitytraits")
    personality = personality[0].upper() + personality[1:]

    resultQuestion = {
                    "confidence": confidence,
                    "knowledge" : answerEvaluationResponse != None and answerEvaluationResponse.json().get("result") or None,
                    "mindset" : mindsetEvaluationResponse != None and mindsetEvaluationResponse.json().get("result") or None,
                    "personality" : personality,
                    "unAuthorizedObjects" : unauthorizedObjectDetectionResponse.json().get("unauthorizedObjects"),
                    "fillerPausesCount" : fillerPausesResponse.json().get("count"),
                    "fillerWordsPercentage" : languageFluencyResponse.json().get("fillerWordPercentage"),
                    "silencePausesCount" : languageFluencyResponse.json().get("silencePauses"),
                    "behaviorAnalyticsCounts" : behaviourAnalyticsResponse.json().get("counts"),
                    "eyeContact" : eyeContactAnalyticsResponse.json().get("status"),
                    "smile" : smileDetectionResponse.json().get("status"),
                    }
    
    print("\n---------------------------------------------------------------------------------------")
    print("\n---------------------------------------------------------------------------------------")
    print("\nRESULT:\n\t" + str(resultQuestion))
    print("\n---------------------------------------------------------------------------------------")
    endTime = datetime.now()
    print("\nProcess End Time:\n\t" + str(endTime))
    print("\nDuration:\n\t" + str(endTime - startTime))
    print("\n---------------------------------------------------------------------------------------")

    silencePausesPerMinute = float(languageFluencyResponse.json().get("silencePauses")) / audioTime

    #get the interview details from the database
    interviewSession = collection.interviewsessions.find_one({"_id": ObjectId(interviewSessionId)})
    interviewData = collection.interviews.find_one({"_id": ObjectId(interviewSession["interview"])})

    communicationSkillLevel = communicationSkillsEvaluation(fillerPausesResponse.json().get("count"), languageFluencyResponse.json().get("fillerWordPercentage"), silencePausesPerMinute, interviewData)

    #update the database result for the interviewAnswersId
    collection.interviewanswers.update_one(
        {"_id": ObjectId(interviewAnswersId)},
        {
            "$set": {
                "result": {
                    "confidence": confidence,
                    "knowledge" : answerEvaluationResponse != None and answerEvaluationResponse.json().get("result") or None,
                    "mindset" : mindsetEvaluationResponse != None and mindsetEvaluationResponse.json().get("result") or None,
                    "personality" : personality,
                    "unAuthorizedObjects" : unauthorizedObjectDetectionResponse.json().get("unauthorizedObjects"),
                    "fillerPausesCount" : fillerPausesResponse.json().get("count"),
                    "fillerWordsPercentage" : languageFluencyResponse.json().get("fillerWordPercentage"),
                    "silencePausesCount" : languageFluencyResponse.json().get("silencePauses"),
                    "silencePausesPerMinute" : silencePausesPerMinute,
                    "communicationSkillLevel" : communicationSkillLevel,
                    "behaviorAnalyticsCounts" : behaviourAnalyticsResponse.json().get("counts"),
                    "eyeContact" : eyeContactAnalyticsResponse.json().get("status"),
                    "smile" : smileDetectionResponse.json().get("status"),
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
        overallResult = overallEvaluation(interviewAnswerList, interviewData)
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

def calculate_overall_answer_eval(records):
    numKnoRecs = 0
    knowledgeScore = 0

    for record in records:
        questionId = record["question"]
        questionData = collection.interviewquestions.find_one({"_id": ObjectId(questionId)})
        questionType = questionData["questionType"]
        record = record["result"]
        if questionType == "Knowledge Evaluation":
            numKnoRecs += 1
            knowledgeScore += (
                                record['knowledge'] == 'Acceptable' and 3 
                                or 
                                record['knowledge'] == 'Need Improvement' and 2 
                                or 
                                record['knowledge'] == 'Not Acceptable' and 1
                                )

    avgKnowledgeScore = (
                            numKnoRecs > 0 
                            and 
                            knowledgeScore / numKnoRecs 
                            or 
                            0
                        )
    
    finalKnowledge = (
        avgKnowledgeScore > 2.25 and 'Good' 
        or 
        avgKnowledgeScore > 1.5 and 'Average' 
        or 
        'Poor'
        )

    return { 'knowledge': finalKnowledge }
def calculate_overall_mindset_eval(records):
    numMindRecs = 0
    mindsetScore = 0

    for record in records:
        questionId = record["question"]
        questionData = collection.interviewquestions.find_one({"_id": ObjectId(questionId)})
        questionType = questionData["questionType"]
        record = record["result"]
        if questionType == "Mind Evaluation":
            numMindRecs += 1
            mindsetScore += (
                record['mindset'] == 'Positive' and 3 
                or 
                record['mindset'] == 'Neutral' and 2 
                or 
                record['mindset'] == 'Negative' and 1
                )

    avgMindsetScore = (
                            mindsetScore > 0 
                            and 
                            mindsetScore / numMindRecs 
                            or 
                            0
                        )
    
    finalMindset = (
        avgMindsetScore > 2.25 and 'Positive' 
        or 
        avgMindsetScore > 1.5 and 'Neutral' 
        or 
        'Negative'
        )

    return { 'mindset': finalMindset }

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
