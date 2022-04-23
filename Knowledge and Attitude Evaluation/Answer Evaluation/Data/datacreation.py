import json
from csv import DictWriter
  
question = "What is a superclass"
original_answers = ["my name is yasiru", "I am yasiru"]
answer = "my name is yasiru"
score = ""

data = {'question': question, 'original_answers': original_answers, 'answer': answer, 'score': score}

with open('Data/dataset.csv', 'a') as f_object:
    writer_object = DictWriter(f_object, fieldnames=['question', 'original_answers', 'answer', 'score'])
    writer_object.writerow(data)
    f_object.close()
 