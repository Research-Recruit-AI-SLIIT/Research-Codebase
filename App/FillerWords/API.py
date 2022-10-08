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
    data = request.get_json(force=True)
    audio_sas_url = data['audio_sas_url']
    r = requests.get(audio_sas_url, allow_redirects=True)
    filename = re.search('(?<=audio/).*(?=\?)', audio_sas_url).group(0)
    open(filename, 'wb').write(r.content)    
    fillterWordCount = getFillterWordCount.countFillerWords(filename)
    #delete if exist
    if os.path.exists(filename):
        try:
            os.remove(filename)
        except OSError: 
            pass

    return fillterWordCount

app.run(port=5004)
