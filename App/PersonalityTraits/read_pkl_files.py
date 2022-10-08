import pickle
import pandas
import os

outF = open("train_new.csv", "a")

# file_to_read = open("annotation_training.pkl", "rb")
#
# dictionary = pickle.load(file_to_read)
# print(dictionary)

df = pandas.read_pickle("annotation_training.pkl")
#print(df["extraversion"]["_0bg1TLPP-I.004.mp4"])

sub_dirs = os.listdir('frames')

for label, sub_dir in enumerate(sub_dirs):
    filename = sub_dir+".mp4"

    openness_score = df["openness"][filename]
    extraversion_score = df["extraversion"][filename]
    agreeableness_score = df["agreeableness"][filename]
    conscientiousness_score = df["conscientiousness"][filename]
    neuroticism_score = df["neuroticism"][filename]

    if openness_score > extraversion_score:
        class_name = "openness"
    elif agreeableness_score > openness_score:
        class_name = "agreeableness"
    elif conscientiousness_score > agreeableness_score:
        class_name = "conscientiousness"
    elif neuroticism_score > conscientiousness_score:
        class_name = "neuroticism"
    else:
        class_name = "extraversion"

    for filename in os.listdir("frames/"+sub_dir):
        print("frames/"+sub_dir+"/"+filename)
        outF.write("\n")
        outF.write("frames/"+sub_dir+"/"+filename+","+class_name)

