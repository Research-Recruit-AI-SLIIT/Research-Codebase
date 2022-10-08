const constants = {
	api: {
		baseUrl: process.env.REACT_APP_BASE_URL
	},
	storage: {
		baseUrl: 'https://teststoragecdap.blob.core.windows.net/research'
	},
	interviewDifficultyLevels: [
		{
			value: 'easy',
			label: 'Easy'
		},
		{
			value: 'medium',
			label: 'Medium'
		},
		{
			value: 'hard',
			label: 'Hard'
		}
	],
	interviewTypes: [
		{
			value: 'mock',
			label: 'Mock Interview'
		},
		{
			value: 'real',
			label: 'Real Interview'
		}
	],
	questionTypes: [
		{
			value: 'General',
			label: 'General'
		},
		{
			value: 'Mind Evaluation',
			label: 'Mind Evaluation'
		},
		{
			value: 'Knowledge Evaluation',
			label: 'Knowledge Evaluation'
		}
	],
	interviewInstructions: [
		{
			number: '1',
			message: 'Finish the upcoming questions withing the time limit.'
		},
		{
			number: '2',
			message: 'Turn on your microphone and camera.'
		},
		{
			number: '3',
			message:
				'Once you click next, your answer to the question will be submitted.'
		},
		{
			number: '4',
			message: 'Click the "Start Interview" button to begin.'
		}
	]
};

export default constants;
