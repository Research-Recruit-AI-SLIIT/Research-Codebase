import cv2

def FrameCapture(path):
    vidObj = cv2.VideoCapture(path)

    # counter variable
    count = 0
    # flag for knowing if frames were successfully extracted
    success = 1

    total_frames = vidObj.get(cv2.CAP_PROP_FRAME_COUNT)

    while success:
        count += 1


        if count >= total_frames or count == 16:
            break


        success, image = vidObj.read()

        cv2.imwrite("Demo_Frames/T_3_frame%d.jpg" % count, image)

        # fps = vidObj.get(cv2.CV_CAP_PROP_FPS)
        # print(fps)



if __name__ == '__main__':
    FrameCapture("Demo_videos/HEHMW0uiFa4.002.mp4")
