import React, { useState, useEffect } from 'react';
import Loading from '../loading/Loading';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Alert from '../alert/Alert';

const CustomSelect = ({
	className,
	isAsync = false,
	asyncDataLoader,
	dataPath = '',
	valuePath = '',
	labelPath = '',
	label,
	data = null,
	value = '',
	onSelect,
	onFailed,
	isRequired
}) => {
	const [selectData, setselectData] = useState(data);
	const [isLoading, setIsLoading] = useState(isAsync);
	const [selected, setSelected] = useState(value);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isAsync) {
			if (!asyncDataLoader || !dataPath || !valuePath || !labelPath) {
				setError('Invalid data');
				return;
			}
			loadAsyncData();
		}
	}, []);

	const handleSelect = (e) => {
		setSelected(e.target.value);
		onSelect(e.target.value);
	};

	const handleFailed = (err) => {
		setError(err);
		onFailed(err);
	};
	const loadAsyncData = async () => {
		setIsLoading(true);
		asyncDataLoader()
			.then((response) => {
				const data = _.get(response, dataPath);
				// convert data into array of objects with value and label
				const dataArray = data.map((item) => {
					return {
						value: _.get(item, valuePath),
						label: _.get(item, labelPath)
					};
				});
				setselectData(dataArray);
				setIsLoading(false);
			})
			.catch((error) => {
				handleFailed(error);
				setIsLoading(false);
			});
	};

	return (
		<div className={`${!!className ? className : ''} mb-3 text-start`}>
			{!!label && (
				<label htmlFor={label} className='form-label'>
					{label}
					{isRequired && <span className='text-danger'> *</span>}
				</label>
			)}
			{isLoading ? (
				<div className='loading-spinner-wrapper'>
					<Loading />
				</div>
			) : !error ? (
				<select
					onChange={handleSelect}
					className={`form-control`}
					value={selected}
					required={isRequired}>
					<option value='' className='d-none'>
						Select {label}
					</option>
					{selectData && selectData.length > 0 ? (
						selectData.map((item, i) => (
							<option key={i} value={item.value}>
								{item.label}
							</option>
						))
					) : (
						<option>No data found</option>
					)}
				</select>
			) : (
				<Alert type='danger' message={error} />
			)}
		</div>
	);
};

CustomSelect.propTypes = {
	isAsync: PropTypes.bool.isRequired,
	asyncDataLoader: function (props, propName, componentName) {
		if (
			props['isAsync'] === true &&
			(props[propName] === undefined ||
				typeof props[propName] != 'function')
		) {
			return new Error('Please provide a asyncDataLoader function!');
		}
	},
	dataPath: function (props, propName, componentName) {
		if (
			props['isAsync'] === true &&
			(props[propName] === undefined ||
				typeof props[propName] != 'string')
		) {
			return new Error('Please provide the datapath');
		}
	},
	valuePath: function (props, propName, componentName) {
		if (
			props['isAsync'] === true &&
			(props[propName] === undefined ||
				typeof props[propName] != 'string')
		) {
			return new Error('Please provide the valuePath');
		}
	},
	labelPath: function (props, propName, componentName) {
		if (
			props['isAsync'] === true &&
			(props[propName] === undefined ||
				typeof props[propName] != 'string')
		) {
			return new Error('Please provide the labelPath');
		}
	},
	data: PropTypes.array,
	selected: PropTypes.string,
	onSelect: PropTypes.func.isRequired,
	onFailed: PropTypes.func,
	isRequired: PropTypes.bool,
	label: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.string
};

export default CustomSelect;
