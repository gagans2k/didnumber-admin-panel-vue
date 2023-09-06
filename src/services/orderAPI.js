// const http = require('../services/http');

// const getOrderList = (viewIndex, viewSize) => {
// 	return new Promise((resolve, reject) => {
// 		http.get(`/getOrderList?viewIndex=${viewIndex}&viewSize=${viewSize}`).then((response) => {
// 			resolve(response);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// const getOrderDetail = (orderId) => {
// 	return new Promise((resolve, reject) => {
// 		http.get(`/getOrderDetail?orderId=${orderId}`).then((response) => {
// 			resolve(response);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// const getInstructions = (inventoryItemId) => {
// 	return new Promise((resolve, reject) => {
// 		http.get(`/getInstructions?inventoryItemId=${inventoryItemId}`).then((response) => {
// 			resolve(response);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// const uploadDidAttachment = (payload) => {
// 	return new Promise((resolve, reject) => {
// 		http.post('uploadDidAttachment', payload).then((data) => {
// 			resolve(data);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// module.exports = {
// 	getOrderList,
// 	getOrderDetail,
// 	getInstructions,
// 	uploadDidAttachment
// };

const http = require('./http');
let userData = JSON.parse(localStorage.getItem("userDetail"));

const getOrderDetail = (orderId) => {
	return new Promise((resolve, reject) => {
		http.get(`/getOrderDetail?orderId=${orderId}`).then((response) => {
			resolve(response);
		}).catch((error) => {
			reject(error);
		});
	});
};

const getInstructions = (inventoryItemId) => {
	return new Promise((resolve, reject) => {
		http.get(`/getInstructions?inventoryItemId=${inventoryItemId}`).then((response) => {
			resolve(response);
		}).catch((error) => {
			reject(error);
		});
	});
};

const uploadDidAttachment = (payload) => {
	return new Promise((resolve, reject) => {
		http.post('uploadDidAttachment', payload).then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		});
	});
};

const uploadDocumentInfo = (payload) => {
	return new Promise((resolve, reject) => {
		http.post(`/uploadDocumentInfo`, payload).then((data) => {
			resolve(data);
		}).catch((err) => {
			reject(err);
		});
	});
};

const setInventoryItemDocInfo = (payload) => {
	return new Promise((resolve, reject) => {
		http.post(`/setInventoryItemDocInfo`, payload).then((data) => {
			resolve(data);
		}).catch((err) => {
			reject(err);
		});
	});
};

const getDocumentInfoApi = (payload) => {
	return new Promise((resolve, reject) => {
		//http.get(`/getDocumentInfo?inventoryItemId=${payload.inventoryItemId}&orderId=${payload.orderId}&geoId=${payload.geoId}&documentInfoType=${payload.documentInfoType}`)
		http.get(`/fetchDocumentInfoIdList?partyId=${payload.partyId}&geoId=${payload.geoId}&documentInfoType=${payload.documentInfoType}`)
			.then((data) => {
				resolve(data);
			}).catch((error) => {
				reject(error);
			})
	})
};

const getDocumentInfo = (payload) => {
	return new Promise((resolve, reject) => {
		http.get(`/getDocumentInfo?partyId=${payload.partyId}&documentInfoType=${payload.documentInfoType}&geoId=${payload.geoId}&documentInfoType=${payload.documentInfoType}&documentInfoId=${payload.documentInfoId}`)
			.then((data) => {
				resolve(data);
			}).catch((error) => {
				reject(error);
			})
	})
};

module.exports = {
	getOrderDetail,
	getInstructions,
	uploadDocumentInfo,
	uploadDidAttachment,
	getDocumentInfoApi,
	setInventoryItemDocInfo,
	getDocumentInfo
};

