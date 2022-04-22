import json
from csv import DictWriter
  
question = "what is your name?"
original_answers = ["my name is yasiru", "I am yasiru"]
answer = "my name is yasiru"
score = "good"

data = {'question': question, 'original_answers': original_answers, 'answer': answer, 'score': score}

with open('Data/dataset.csv', 'a') as f_object:
    writer_object = DictWriter(f_object, fieldnames=['question', 'original_answers', 'answer', 'score'])
    writer_object.writerow(data)
    f_object.close()
 