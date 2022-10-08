# Flask app for Answer Evaluation Model

from flask import Flask, request, jsonify
from flask_cors import CORS
from AnswerEvaluation import AnswerEvaluation

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    data = request.get_json(force=True)
    model = AnswerEvaluation()
    result = model.predict(data['sample_answers'], data['candidate_answer'])
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5007, debug=True)