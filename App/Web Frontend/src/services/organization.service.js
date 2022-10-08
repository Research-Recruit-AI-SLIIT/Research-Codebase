import request from '../utils/axios.util';
import { getAuthHeader } from '../utils/utils';

const CreateOrganization = async (payload) => {
	const response = await request({
		method: 'post',
		url: 'organization/create',
		headers: getAuthHeader(),
		data: {
			...payload
		}
	});
	return response;
};

const GetOrganizations = async () => {
	const response = await request({
		method: 'get',
		url: 'organization'
	});
	return response;
};

const OrganizationService = {
	CreateOrganization,
	GetOrganizations
};

export default OrganizationService;
