import React from 'react';
import VideoRecorder from 'react-video-recorder';
import './video-recoder.styles.css';

const CustomVideoRecorder = ({ onVideoRecordingComplete }) => {
	return (
		<div className='container mt-2 vidoe-recorder-container'>
			<VideoRecorder
				isFlipped={false}
				replayVideoAutoplayAndLoopOff={true}
				countdownTime={0}
				mimeType='video/webm;codecs=vp8,opus'
				constraints={{
					audio: true,
					video: {
						width: 1280,
						height: 720,
						facingMode: 'user'
					}
				}}
				onRecordingComplete={(videoBlob) => {
					onVideoRecordingComplete(videoBlob);
				}}
			/>
		</div>
	);
};

export default CustomVideoRecorder;
