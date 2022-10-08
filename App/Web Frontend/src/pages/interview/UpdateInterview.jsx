import React from 'react';
import { useParams } from 'react-router-dom';

const UpdateInterview = () => {
	const { id } = useParams();
	return <h1>Update interview {id}</h1>;
};

export default UpdateInterview;
