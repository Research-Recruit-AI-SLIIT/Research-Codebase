import React from 'react';
import PropTypes from 'prop-types';
import {
	FaExclamationCircle,
	FaRegCheckCircle,
	FaInfoCircle
} from 'react-icons/fa';
import './Alert.styles.css';

const Alert = ({ type, message, noIcon }) => {
	const icon = () => {
		switch (type) {
			case 'success':
				return <FaRegCheckCircle size={30} />;
			case 'info':
				return <FaInfoCircle size={30} />;
			case 'error' || 'danger':
				return <FaExclamationCircle size={30} />;
			default:
				return null;
		}
	};
	const getType = () => {
		switch (type) {
			case 'success':
				return 'alert-success';
			case 'info':
				return 'alert-info';
			case 'error' || 'danger':
				return 'alert-danger';
			default:
				return null;
		}
	};
	return (
		<div
			className={`alert ${getType()} d-flex align-items-center justify-content-between`}
			role='alert'>
			<div>{message}</div>
			{!noIcon && icon()}
		</div>
	);
};

Alert.propTypes = {
	type: PropTypes.oneOf(['success', 'info', 'error', 'danger']).isRequired,
	message: PropTypes.string.isRequired,
	noIcon: PropTypes.bool
};

export default Alert;
