import React from 'react';
import './input.styles.css';

const Input = ({
	label,
	name,
	value,
	type = 'text',
	onChange,
	placeHolder,
	className,
	isError = false,
	errorMessage = '',
	required = false,
	...props
}) => {
	return (
		<div className={`${!!className ? className : ''} mb-3 text-start`}>
			{!!label && (
				<label htmlFor={label} className='form-label'>
					{label} {required && <span className='text-danger'>*</span>}
				</label>
			)}
			<input
				type={type}
				className={`form-control ${
					type === 'submit' ? 'btn btn-primary' : ''
				}`}
				onChange={onChange}
				value={value}
				name={name}
				placeholder={placeHolder}
				required={required}
				{...props}
			/>
			{isError && <div className='input-error'>{errorMessage}</div>}
		</div>
	);
};

export default Input;
