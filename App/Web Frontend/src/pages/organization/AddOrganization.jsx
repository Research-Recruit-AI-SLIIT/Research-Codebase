import React, { useState } from 'react';
import Card from '../../components/card/Card';
import { Alert, Input, Loading } from '../../components/shared';
import OrganizationService from '../../services/organization.service';
import { toTitleCase } from '../../utils/utils';
import { toast } from 'react-toastify';
import FormLayout from '../../layouts/Form.layout';

const AddOrganization = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		name: '',
		email: ''
	});
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		organizationError: ''
	});
	const clearErrors = () => {
		setErrors({
			name: '',
			email: '',
			organizationError: ''
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
			const { name, email } = data;
			OrganizationService.CreateOrganization({
				organizationName: name,
				email
			})
				.then((res) => {
					toast(
						`New Organization : ${res.organization.organizationName} has been created successfully`,
						{ type: 'success' }
					);
					setLoading(false);
				})
				.catch((err) => {
					setErrors({
						...errors,
						organizationError: err.data.message
					});
					setLoading(false);
				});
		}
	};

	const validate = (data) => {
		const errors = {};
		if (!data.name) errors.name = 'Name is required';
		if (!data.email) errors.email = 'Email is required';
		return errors;
	};

	return (
		<FormLayout
			title={'Add Organization'}
			cardImage='https://source.unsplash.com/random/?company'>
			<form onSubmit={handleSubmit}>
				<div className='row'>
					{Object.keys(data).map((key, index) => {
						return (
							<Input
								className={'col-md-6 offset-md-3'}
								key={index}
								label={toTitleCase(key)}
								name={key}
								value={data[key]}
								onChange={handleChange}
								type={key === 'email' ? 'email' : 'text'}
								placeHolder={
									key === 'name'
										? 'Organization Name'
										: 'Email'
								}
								isError={errors[key]}
								errorMessage={errors[key]}
							/>
						);
					})}
					<div className='col-md-6 offset-md-3'>
						<button
							className='btn btn-black w-100'
							disabled={loading}>
							{loading ? <Loading /> : 'Create Organization'}
						</button>
					</div>

					{errors.organizationError && (
						<div className='col-md-6 offset-md-3 mt-2'>
							<Alert
								type='error'
								message={errors.organizationError}
							/>
						</div>
					)}
				</div>
			</form>
		</FormLayout>
	);
};

export default AddOrganization;
