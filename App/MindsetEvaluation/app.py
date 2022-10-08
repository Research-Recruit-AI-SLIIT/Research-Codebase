# Flask app for Answer Evaluation Model

from flask import Flask, request, jsonify
from flask_cors import CORS
from MindSetEvaluation import MindSetEvaluation

app = Flask(__name__)
CORS(app)

model = MindSetEvaluation()

@app.route('/predict', methods=['GET'])
def predict():
    data = request.get_json(force=True)
    result = model.predict(data['answer'])
    return jsonify({"evaluation": result[0]})

if __name__ == '__main__':
    app.run(port=5008, debug=True)