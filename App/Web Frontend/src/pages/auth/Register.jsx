import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/shared/alert/Alert';
import Input from '../../components/shared/input/Input';
import Loading from '../../components/shared/loading/Loading';
import AuthLayout from '../../layouts/Auth.layout';
import AuthService from '../../services/Auth.service';
import { AuthContext } from '../../store/auth';
import { getType } from '../../utils/utils';
import './auth.styles.css';

const Register = () => {
	const { setAuthInfo } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		name: '',
		email: '',
		password: '',
		confirm_Password: '',
		role: 'candidate'
	});

	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		confirm_Password: ''
	});

	// clear errors
	const clearErrors = () => {
		setErrors({
			name: '',
			email: '',
			password: '',
			confirm_Password: '',
			registerError: ''
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
			const { name, email, password, role } = data;
			AuthService.register({ name, email, password, role })
				.then((res) => {
					setLoading(false);
					setAuthInfo(res);
				})
				.catch((err) => {
					setErrors({ ...errors, registerError: err.data.message });
					setLoading(false);
				});
		}
	};

	const validate = (data) => {
		const errors = {};
		if (!data.name) errors.name = 'Name is required';
		if (!data.email) errors.email = 'Email is required';
		if (!data.password) errors.password = 'Password is required';
		if (!data.confirm_Password)
			errors.confirm_Password = 'Confirm Password is required';
		if (data.password !== data.confirm_Password)
			errors.confirm_Password = 'Passwords must match';
		return errors;
	};

	return (
		<AuthLayout title={'Register'}>
			<form
				className='card-body cardbody-color p-lg-5 md-7'
				onSubmit={handleSubmit}>
				<div className='text-center'>
					<img
						src='https://mir-s3-cdn-cf.behance.net/projects/404/a32c7968500359.Y3JvcCwyMzAxLDE4MDAsNTEsMA.jpg'
						className='img-fluid profile-image-pic img-thumbnail rounded-circle my-3'
						width='200px'
						alt='profile'
					/>
				</div>

				{Object.keys(data).map((key) => {
					return (
						key !== 'role' && (
							<Input
								className={'text-capitalize'}
								key={key}
								type={getType(key)}
								// label={key.split('_').join(' ')}
								name={key}
								value={data[key]}
								onChange={handleChange}
								errorMessage={errors[key]}
								isError={errors[key] ? true : false}
								placeHolder={key.split('_').join(' ')}
							/>
						)
					);
				})}
				<div className='form-group mb-3 text-start'>
					<label className='form-control-label'>Role</label>
					<select
						className='form-control'
						name='role'
						value={data.role}
						onChange={handleChange}>
						<option value='candidate'>Candidate</option>
						<option value='recruiter'>Recruiter</option>
					</select>
				</div>
				<div className='text-center'>
					<button
						type='submit'
						className='btn auth-btn-color px-5 mb-5 w-100'>
						{loading ? <Loading /> : 'Register'}
					</button>
				</div>
				{errors.registerError && (
					<Alert type={'error'} message={errors.registerError} />
				)}
				<div
					id='emailHelp'
					className='form-text text-center mb-1 text-dark'>
					Already have an account?{' '}
					<Link to='/login' className='text-dark fw-bold'>
						{' '}
						Login
					</Link>
				</div>
			</form>
		</AuthLayout>
	);
};

export default Register;
