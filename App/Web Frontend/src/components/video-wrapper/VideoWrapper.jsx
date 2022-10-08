import React, { useState } from 'react';
import VideoPlayer from '../video-player/VideoPlayer';
import CustomVideoRecorder from '../video-recoder/CustomVideoRecorder';

const VideoWrapper = ({ onComplete, onReRecord, videoData = null }) => {
	const onVideoRecordingComplete = (videoBlob) => {
		onComplete(videoBlob);
	};
	const reRecord = () => {
		onReRecord();
	};
	return (
		<>
			{videoData ? (
				<div className='row'>
					<div className='col-md-12 text-center'>
						<VideoPlayer video={videoData} />
					</div>
					<div className='col-md-12 text-center'>
						<button className='btn btn-danger' onClick={reRecord}>
							Record again
						</button>
					</div>
				</div>
			) : (
				<CustomVideoRecorder
					onVideoRecordingComplete={onVideoRecordingComplete}
				/>
			)}
		</>
	);
};

export default VideoWrapper;
