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
	],
	evaluationMatrics: [
		{
			group: 'Confidence',
			items: [
				{
					label: 'Eye Contact',
					key: 'con_eye_contact'
				},
				{
					label: 'Genuine Smile Detection',
					key: 'con_smile'
				},
				{
					label: 'Facial Expressions',
					key: 'con_facial'
				},
				{
					label: 'Behavior',
					key: 'con_behavior'
				}
			]
		},

		{
			group: 'Overall Evaluation',
			items: [
				{
					label: 'Knowledge',
					key: 'overall_knowd'
				},
				{
					label: 'Positive Attitues',
					key: 'overall_positive'
				},
				{
					label: 'Confidence at Giving Answers',
					key: 'overall_con'
				},
				{
					label: 'Communication Skills',
					key: 'overall_comm'
				}
			]
		},
		{
			group: 'Communication Skills',
			subGroups: [
				{
					group: 'Filler Words Percentage',
					items: [
						{
							label: 'Good',
							key: 'comm_fwp_good'
						},
						{
							label: 'Average',
							key: 'comm_fwp_avg'
						}
					]
				},
				{
					group: 'Filler Pauses Percentage',
					items: [
						{
							label: 'Good',
							key: 'comm_fpp_good'
						},
						{
							label: 'Average',
							key: 'comm_fpp_avg'
						}
					]
				},
				{
					group: 'Silence Pauses per Minute',
					items: [
						{
							label: 'Good',
							key: 'comm_sppm_good'
						},
						{
							label: 'Average',
							key: 'comm_sppm_avg'
						}
					]
				}
			],
			items: [
				{
					label: 'Filler Words',
					key: 'com_fw'
				},
				{
					label: 'Filler Pauses',
					key: 'com_fp'
				},
				{
					label: 'Silence Pauses',
					key: 'com_sp'
				}
			]
		}
	]
};

export default constants;
