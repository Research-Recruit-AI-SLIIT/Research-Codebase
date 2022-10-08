import os

from pydub import AudioSegment
from pydub.silence import split_on_silence
import re
import requests

def fillerwords(transcript):
        ScoreforFillerwords = 60/100

        like=0
        okay =0
        so = 0
        actually= 0
        basically =0
        right = 0

        listwords=["like","okay" ,"So", "actually" ,"basically","right"]

        numofwords =len(transcript.split())


        try:
            read = transcript.split("\n")

            for word in listwords:
                lower = word.lower()

                count = 0

                for sentance in read:
                    line = sentance.split()
                    for each in line:
                        line2 = each.lower()
                        line2 = line2.strip("!@#$%^&*(()_+=")

                        if lower == line2:
                            count += 1


                            if lower == 'like':
                                like = like +1
                            elif lower =='okay':
                                okay = okay +1
                            elif lower =='so':
                                so= so +1
                            elif lower == 'actually':
                                actually = actually +1
                            elif lower == 'basically':
                                basically = basically+1
                            else:
                                right = right+1







                returnvalue = (lower, ":", count)



        except FileExistsError:
                print("Have not filler word")
                return "Have not filler word"

        # calculating summation of filler words

        summation = int(like+okay+so+actually+basically+right)
        percentage=(summation/numofwords) *100
        #print(numofwords)

        #return {"like":like,"okay":okay,"so":so,"actually":actually,"basically":basically,"right":right,"percentage of filler words count is": percentage}
        return {
                "percentage of filler words count is": percentage}

def countPauses(audio_sas_url):
    r = requests.get(audio_sas_url, allow_redirects=True)
    filePath = re.search('(?<=audio/).*(?=\?)', audio_sas_url).group(0)
    open(filePath, 'wb').write(r.content)   

    ScoreforUserSilence = 70 / 100
    sound = AudioSegment.from_wav(filePath)
    chunks = split_on_silence(sound, min_silence_len=200, silence_thresh=sound.dBFS - 16, keep_silence=150)

    # Chunk Folder file Path
    chunk_folder_name = "chunks"

    # create folder to store chunks
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

    return {
        "message": str(len(chunks) - 1) + " : Silence/s found",
        "score": ScoreforUserSilence
    }
