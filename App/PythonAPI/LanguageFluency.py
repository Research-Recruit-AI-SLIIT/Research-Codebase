import os

from pydub import AudioSegment
from pydub.silence import split_on_silence
import re
import requests


def fillerwords(transcript):
    print("-------------------------------------------------------------------")
    ScoreforFillerwords = 60 / 100

    like = 0
    okay = 0
    so = 0
    actually = 0
    basically = 0
    right = 0

    listwords = ["like", "okay", "So", "actually", "basically", "right"]

    numofwords = len(transcript.split())
    print("\nStart time: {} \t filename: {}".format(datetime.now(), transcript))

    try:
        print("\nstart read the file: {} \t filename: {}".format(datetime.now(), transcript))
        read = transcript.split("\n")

        for word in listwords:
            lower = word.lower()

            count = 0
            print("\nStart the preprocessing: {} \t filename: {}".format(datetime.now(), transcript))
            for sentance in read:
                line = sentance.split()
                for each in line:
                    line2 = each.lower()
                    line2 = line2.strip("!@#$%^&*(()_+=")

                    if lower == line2:
                        count += 1

                        if lower == 'like':
                            like = like + 1
                        elif lower == 'okay':
                            okay = okay + 1
                        elif lower == 'so':
                            so = so + 1
                        elif lower == 'actually':
                            actually = actually + 1
                        elif lower == 'basically':
                            basically = basically + 1
                        else:
                            right = right + 1

            returnvalue = (lower, ":", count)



    except FileExistsError:
        print("Have not filler word")
        return "Have not filler word"

    # calculating summation of filler words

    summation = int(like + okay + so + actually + basically + right)
    percentage = (summation / numofwords) * 100
    # print(numofwords)

    # return {"like":like,"okay":okay,"so":so,"actually":actually,"basically":basically,"right":right,"percentage of filler words count is": percentage}
    print("\nProcess End Time", datetime.now.strftime("%H:%M:%S") + "\t filename {}".format(transcript))
    print("\n--------------------------------------------------------------------------")
    return {
        "percentage of filler words count is": percentage}


def countPauses(audio_sas_url):
    print("-------------------------------------------------------------------")
    r = requests.get(audio_sas_url, allow_redirects=True)
    filePath = re.search('(?<=audio/).*(?=\?)', audio_sas_url).group(0)
    print("\ndownload the Audio from Database \t filename {}".format(filePath))
    open(filePath, 'wb').write(r.content)
    print("\nStart time: {} \t filename: {}".format(datetime.now(), filePath))

    ScoreforUserSilence = 70 / 100
    sound = AudioSegment.from_wav(filePath)
    print("\nSplit the audio into chunks: {} \t filename: {}".format(datetime.now(), filePath))
    chunks = split_on_silence(sound, min_silence_len=200, silence_thresh=sound.dBFS - 16, keep_silence=150)

    # Chunk Folder file Path
    chunk_folder_name = "chunks"

    # create folder to store chunks
    print("\nStore the chunks: {} \t filename: {}".format(datetime.now(), filePath))
    if not os.path.isdir(chunk_folder_name):
        os.mkdir(chunk_folder_name)

    for i, audio_chunk in enumerate(chunks, start=1):
        chunk_file = os.path.join(chunk_folder_name, f"chunk{i}.wav")
        audio_chunk.export(chunk_file, format="wav", bitrate='192k')

    print("****** How many times User Silence in their Speech *****")

    # print count of silence
    print(str(len(chunks) - 1) + " : Silence/s found")

    try:
        if os.path.exists(filePath):
            os.remove(filePath)
    except OSError:
        pass
    print("\nProcess End Time", datetime.now.strftime("%H:%M:%S") + "\t filename {}".format(filePath))
    print("\n--------------------------------------------------------------------------")
    return {
        "message": str(len(chunks) - 1) + " : Silence/s found",
        #"score": ScoreforUserSilence
    }
