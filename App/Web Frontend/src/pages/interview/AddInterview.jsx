import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Alert, CustomSelect, Input, Loading } from '../../components/shared';
import FormLayout from '../../layouts/Form.layout';
import InterviewService from '../../services/Interview.service';
import OrganizationService from '../../services/organization.service';
import constants from '../../utils/constants';
import { removeEmptyValues, toTitleCase } from '../../utils/utils';

const INITIAL_STATE = {
	name: '',
	type: '',
	interviewCategory: '',
	jobRole: '',
	organization: '',
	questions: [],
	difficultyLevel: '',
	time: ''
};

const AddInterview = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({ ...INITIAL_STATE });
	const [errors, setErrors] = useState({ ...INITIAL_STATE });
	const clearErrors = () => {
		setErrors({
			...INITIAL_STATE,
			interviewError: ''
		});
	};

	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
		clearErrors();
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = validate(data);
		setErrors(errors);
		if (Object.keys(errors).length === 0) {
			setLoading(true);
			const payload = removeEmptyValues(data);
			InterviewService.createInterview({ ...payload })
				.then((res) => {
					toast(
						`New Interview : ${res.interview.name} has been created successfully`,
						{ type: 'success' }
					);
					setData({ ...INITIAL_STATE });
					navigate(`/add-questions/${res.interview._id}`);
				})
				.catch((err) => {
					setErrors({
						...errors,
						interviewError: err.data.message
					});
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};
	const validate = (data) => {
		const errors = {};
		if (!data.name) errors.name = 'Name is required';
		if (!data.type) errors.type = 'Type is required';
		if (!data.interviewCategory)
			errors.interviewCategory = 'Interview Category is required';
		if (!data.jobRole) errors.jobRole = 'Job Role is required';
		if (!data.difficultyLevel)
			errors.difficultyLevel = 'Difficulty Level is required';
		return errors;
	};
	const isRequired = (key) => {
		if (
			key === 'name' ||
			key === 'type' ||
			key === 'interviewCategory' ||
			key === 'jobRole' ||
			key === 'difficultyLevel'
		)
			return true;
		return false;
	};

	const isMapInput = (key) => {
		if (key === 'name' || key === 'jobRole') return true;
		return false;
	};
	return (
		<FormLayout
			title='Add Interview'
			cardImage={'https://source.unsplash.com/random/?interview'}>
			<form onSubmit={handleSubmit}>
				{Object.keys(data).map((key) => {
					return (
						isMapInput(key) && (
							<Input
								key={key}
								name={key}
								value={data[key]}
								onChange={handleChange}
								isError={!!errors[key]}
								errorMessage={errors[key]}
								placeHolder={key}
								label={toTitleCase(key)}
								required={isRequired(key)}
							/>
						)
					);
				})}
				<div className='form-row'>
					<CustomSelect
						className={'col-md-4'}
						label={'Interivew Type'}
						isAsync={false}
						onSelect={(e) => {
							setData({ ...data, type: e });
						}}
						data={constants.interviewTypes}
						isRequired={true}
					/>
					<CustomSelect
						className={'col-md-4'}
						label={'Difficulty Level'}
						isAsync={false}
						onSelect={(e) =>
							setData({ ...data, difficultyLevel: e })
						}
						data={constants.interviewDifficultyLevels}
						isRequired={true}
					/>
					<CustomSelect
						className={'col-md-4'}
						label={'Interview Category'}
						isAsync={true}
						dataPath={'interviewCategories'}
						valuePath={'_id'}
						labelPath={'name'}
						onSelect={(e) =>
							setData({ ...data, interviewCategory: e })
						}
						asyncDataLoader={
							InterviewService.getInterviewCategories
						}
						isRequired={true}
					/>
					<CustomSelect
						className={'col-md-6'}
						label={'Organization'}
						isAsync={true}
						dataPath={'organizations'}
						valuePath={'_id'}
						labelPath={'organizationName'}
						onSelect={(e) => setData({ ...data, organization: e })}
						asyncDataLoader={OrganizationService.GetOrganizations}
					/>
					<Input
						className={'col-md-6'}
						name='time'
						value={data.time}
						onChange={handleChange}
						isError={!!errors.time}
						errorMessage={errors.time}
						placeHolder='Time in minutes'
						label='Time'
						type='number'
						min={0}
						required={true}
					/>

					{!!errors.interviewError && (
						<div className='col-md-12'>
							<Alert
								type='danger'
								message={errors.interviewError}
							/>
						</div>
					)}
					<div className='col-md-6 offset-md-6'>
						<button
							className='btn btn-black w-100'
							disabled={loading}>
							{loading ? (
								<Loading />
							) : (
								'Continue to add questions'
							)}
						</button>
					</div>
				</div>
			</form>
		</FormLayout>
	);
};

export default AddInterview;
