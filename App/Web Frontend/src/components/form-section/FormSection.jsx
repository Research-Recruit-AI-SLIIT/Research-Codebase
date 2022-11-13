import React from 'react';

const FormSection = ({ inputs, onChange, title }) => {
	return (
		<div className='row'>
			<div className='col-md-12'>{title}</div>
			<div className='col-md-12'>
				{inputs.map((input) => {
					return (
						<div className='form-group'>
							<label htmlFor={input.name}>{input.name}</label>
							<input
								type='text'
								className='form-control'
								id={input.name}
								name={input.name}
								value={input.value}
								onChange={onChange}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default FormSection;
