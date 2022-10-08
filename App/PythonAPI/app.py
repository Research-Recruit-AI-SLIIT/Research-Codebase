from unittest import result
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/evaluateAnswer', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    result = ""
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)