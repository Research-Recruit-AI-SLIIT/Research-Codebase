import {
	adminRoutes,
	candidateRoutes,
	commonRoutes,
	recruiterRoutes
} from '../routes';

export const getType = (name) => {
	if (name === 'password' || name === 'confirm_Password') {
		return 'password';
	}
	if (name === 'email') return 'email';
	return 'text';
};

export const toTitleCase = (str) => {
	const s = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
	return s.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

//remove leading and trailing whitespace
export const trim = (str) => {
	return str.replace(/^\s+|\s+$/g, '');
};

// export const getFormattedDate = (date) => {
// 	return moment(date).format('MMM DD, YYYY');
// }

export const getTime = (dateString) => {
	const date = new Date(dateString);
	return date.getTime();
};

//get token
export const getToken = () => {
	const token = localStorage.getItem('token');
	return token;
};

// get Authentication Header
export const getAuthHeader = () => {
	const token = getToken();
	return {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + token
	};
};

// remove empty values from object
export const removeEmptyValues = (obj) => {
	Object.keys(obj).forEach((key) => {
		// check for empty strings empty arrays and empty objects and remove them
		if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
			delete obj[key];
		}
	});
	return obj;
};

export const getRouteValues = (role) => {
	const routes = [...commonRoutes];
	if (role === 'admin') {
		routes.push(...adminRoutes);
	} else if (role === 'recruiter') {
		routes.push(...recruiterRoutes);
	} else if (role === 'candidate') {
		routes.push(...candidateRoutes);
	}
	return routes;
};

// get knowledge evaluation data from answers list
export const getKnowledgeEvaluationData = (answers) => {
	// find the count of answers with answer.result.knowledge equalts to respectively Acceptable, Not Acceptable and Need Improvement
	const acceptable = answers.filter(
		(answer) => answer.result.knowledge === 'Acceptable'
	).length;
	const notAcceptable = answers.filter(
		(answer) => answer.result.knowledge === 'Not Acceptable'
	).length;
	const needImprovement = answers.filter(
		(answer) => answer.result.knowledge === 'Need Improvement'
	).length;

	const data = [
		{ name: 'Acceptable', value: acceptable },
		{ name: 'Not Acceptable', value: notAcceptable },
		{ name: 'Need Improvement', value: needImprovement }
	];

	return data;
};

export const getConfidenceEvaluationData = (answers) => {
	// find the count of answers with answer.result.confidence equalts to respectively high, average and low
	const high = answers.filter(
		(answer) => answer.result.confidence === 'high'
	).length;
	const average = answers.filter(
		(answer) => answer.result.confidence === 'average'
	).length;
	const low = answers.filter(
		(answer) => answer.result.confidence === 'low'
	).length;

	const data = [
		{ name: 'High', value: high },
		{ name: 'Average', value: average },
		{ name: 'Low', value: low }
	];
	return data;
};

export const getFillerPausesCount = (answers, key) => {
	const data = [];

	// go through answers and add fitterPauseCount object to data array with index number
	answers.forEach((answer, index) => {
		data.push({
			name: `Q${index + 1}`,
			[key]: answer.result[key]
		});
	});

	return data;
};

export const getMindsetEvaluationData = (answers) => {
	const positive = answers.filter(
		(answer) => answer.result.mindset === 'Positive'
	).length;
	const negative = answers.filter(
		(answer) => answer.result.mindset === 'Negative'
	).length;
	const neutral = answers.filter(
		(answer) => answer.result.mindset === 'Neutral'
	).length;

	const data = [
		{ name: 'Positive', value: positive },
		{ name: 'Negative', value: negative },
		{ name: 'Neutral', value: neutral }
	];
	return data;
};

//return color based on the word (positive or negative)
export const getClassByWord = (word) => {
	const positiveWords = [
		'acceptable',
		'high',
		'positive',
		'extraversion',
		'openness',
		'conscientiousness',
		'agreeableness',
		"Good",
		"good",
		'Neuroticism',
		'being curious,orginal,intellectual,creative and open to new ideas',
		'being organized,systematic,punctual,archivement oriented and dependable',
		'being outgoing,talkative,sociable,and enjoying social situation',
		'being affable,tolerant,sensitive,trusting,kind and warm',
		'being anxious,irritable,temperamental and moody'
	];
	const nuetralWords = ['need improvement', 'average', 'neutral'];
	const negativeWords = ['not acceptable', 'low', 'negative', 'poor'];

	if (positiveWords.includes(word.toLowerCase())) {
		return 'success';
	}
	if (nuetralWords.includes(word.toLowerCase())) {
		return 'primary';
	}
	if (negativeWords.includes(word.toLowerCase())) {
		return 'danger';
	}
	return 'secondary';
};

export const getColorByWord = (word) => {
	const positiveWords = [
		'Acceptable',
		'High',
		'Positive',
		'extraversion',
		'openness'
	];
	const nuetralWords = ['Need Improvement', 'average'];
	const negativeWords = ['Not Acceptable', 'low', 'negative', 'Poor'];

	if (positiveWords.includes(word)) {
		return '#05830014';
	}
	if (nuetralWords.includes(word)) {
		return '#007bff24';
	}
	if (negativeWords.includes(word)) {
		return '#ff4e4e26';
	}
	return '#afafaf54';
};

export const getBadge = (value) => {
	return (
		<span
			className={`badge bg-${getClassByWord(
				value
			)} rounded-pill px-3 py-2 mb-2 text-light fs-15`}>
			{value}
		</span>
	);
};
