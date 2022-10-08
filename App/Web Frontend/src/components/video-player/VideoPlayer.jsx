import React from 'react';

const VideoPlayer = ({ video }) => {
	return <video src={window.URL.createObjectURL(video)} controls />;
};

export default VideoPlayer;
