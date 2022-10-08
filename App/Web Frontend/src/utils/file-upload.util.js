import { BlobServiceClient } from '@azure/storage-blob';
import constants from './constants';

const blobSasURL = `${constants.storage.baseUrl}?sp=racl&st=2022-09-17T04:11:25Z&se=2022-12-17T12:11:25Z&sv=2021-06-08&sr=c&sig=sIxDRCcEjHtr2bLPO29Vs0yRhnrL29tQFB65uVkwIjU%3D`;
const containerName = 'research';
const blobServiceClient = new BlobServiceClient(blobSasURL);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadFile = async (file, name) => {
	try {
		//upload file
		const blockBlobClient = containerClient.getBlockBlobClient(
			`${name}.mp4`
		);
		await blockBlobClient.uploadBrowserData(file);
		return true;
	} catch (error) {
		return false;
	}
};
