import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Input, Alert, Loading } from '../../components/shared';
import AuthLayout from '../../layouts/Auth.layout';
import AuthService from '../../services/Auth.service';
import { AuthContext } from '../../store/auth';
import { toTitleCase, trim } from '../../utils/utils';
import './auth.styles.css';

const Login = ({ role }) => {
	const { setAuthInfo } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		email: '',
		password: ''
	});

	const [errors, setErrors] = useState({
		email: '',
		password: '',
		loginError: ''
	});

	// clear errors
	const clearErrors = () => {
		setErrors({
			email: '',
			password: ''
		});
	};

	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: trim(e.target.value)
		});
		clearErrors();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = validate(data);
		if (Object.keys(errors).length === 0) {
			setLoading(true);
			const { email, password } = data;
			AuthService.login(email, password)
				.then((res) => {
					setLoading(false);
					setAuthInfo(res);
				})
				.catch((err) => {
					setErrors({ ...errors, loginError: err.data.message });
					setLoading(false);
				});
		} else {
			setErrors(errors);
			return;
		}
	};

	const validate = (data) => {
		const errors = {};
		if (!data.email) errors.email = 'Email is required';
		if (!data.password) errors.password = 'Password is required';
		return errors;
	};

	return (
		<AuthLayout title={'Login'}>
			<form
				className='card-body cardbody-color p-lg-5'
				onSubmit={handleSubmit}>
				<div className='text-center'>
					<img
						src='https://static.vecteezy.com/system/resources/previews/005/950/803/original/premium-download-icon-of-search-key-person-vector.jpg'
						className='img-fluid profile-image-pic img-thumbnail rounded-circle my-3'
						width='200px'
						alt='profile'
					/>
				</div>
				{Object.keys(data).map((key) => {
					return (
						<Input
							key={key}
							type={key === 'password' ? 'password' : 'text'}
							label={toTitleCase(key)}
							name={key}
							value={data[key]}
							onChange={handleChange}
							placeHolder={key}
						/>
					);
				})}

				<div className='text-center'>
					<button
						type='submit'
						className='btn auth-btn-color px-5 mb-5 w-100'>
						{loading ? <Loading /> : 'Login'}
					</button>
				</div>

				{errors.loginError && (
					<Alert type={'error'} message={errors.loginError} />
				)}
				<div
					id='emailHelp'
					className='form-text text-center mb-1 text-dark'>
					Not Registered?{' '}
					<Link to='/register' className='text-dark fw-bold'>
						{' '}
						Create an Account
					</Link>
				</div>
			</form>
		</AuthLayout>
	);
};

export default Login;
