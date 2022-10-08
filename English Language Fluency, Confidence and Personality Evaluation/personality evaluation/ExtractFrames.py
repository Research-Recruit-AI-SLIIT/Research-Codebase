# function to extract 15 frames from each video and store it in a folder
import cv2

def extract_frames(path):
    name = path
    file_name = name.split('.mp4')[0]
    cap = cv2.VideoCapture(path)

    # make folder to save extracted frames
    path_ = "Demo_Frames"



    # counter variable
    count = 0
    # flag for knowing if frames were successfully extracted
    success = 1

    total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    # set frame limit to 100 using cap.set() which sets the camera parameters
    cap.set(cv2.CAP_PROP_FRAME_COUNT, 16)  # starts count from 1 not 0 hence, 16 not 15

    while success:
        count += 1

        if count >= total_frames or count == 16:
            break

        success, frame = cap.read()
        # resizing frame to save space  and also for modelling
        frame = cv2.resize(frame, (150, 150), interpolation=cv2.INTER_AREA)  # cv2.INTER_AREA good for shrinking images
        # interpolation is used to estimate the values of the unknown pixels, bicubic interpolation uses 4X4  pixels
        # i.e. it uses weighed average of 16 pixels, unknown pixels can be at different distances. it gives higher weight to closer pixels.

        # save the frame
        frame_path = path_ +'/' + file_name + '_' + str(count) + '.jpg'

        cv2.imwrite(frame_path, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):  # give the user one millisecond to press 'q' key to abort
            break

    cap.release()


extract_frames('Demo_videos')