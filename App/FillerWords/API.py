import datetime

from flask import Flask, request, jsonify
import flask
from flask_cors import CORS, cross_origin
import re
import requests
import os

import getFillterWordCount

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


@app.route('/countFillerWords', methods=['GET'])
@cross_origin()
def countFillerWords():
    print("-------------------------------------------------------------------")
    data = request.get_json(force=True)
    audio_sas_url = data['audio_sas_url']
    r = requests.get(audio_sas_url, allow_redirects=True)
    filename = re.search('(?<=audio/).*(?=\?)', audio_sas_url).group(0)
    print("\ndownload the Converted Text File from Database \t filename {}".format(filename))
    open(filename, 'wb').write(r.content)
    print("\nStart time: {} \t filename: {}".format(datetime.now(), filename))
    print("\nExract the feature  from the audio signals \t filename {}".format(filename))
    print("\nSplit the audio into several chunks \t filename {}".format(filename))
    print("\nGet the probability value of the all the filler pauses for the chunk \t filename {}".format(filename))
    fillterWordCount = getFillterWordCount.countFillerWords(filename)
    #delete if exist
    if os.path.exists(filename):
        try:
            os.remove(filename)
        except OSError:
            pass
    print("\nReturn Filler Pauses count \t filename {}".format(filename))
    print("\nProcess End Time", datetime.now.strftime("%H:%M:%S") + "\t filename {}".format(filename))
    print("\n--------------------------------------------------------------------------")
    return fillterWordCount

app.run(port=5004)
