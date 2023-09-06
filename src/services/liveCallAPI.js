const http = require('./http');

// const getOrderList = (viewIndex, viewSize) => {
// 	return new Promise((resolve, reject) => {
// 		http.get(`/getOrderList?viewIndex=${viewIndex}&viewSize=${viewSize}`).then((response) => {
// 			resolve(response);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// EIO: 3,
// transport: polling,
// t: 1610689876949-21,
// sid: FYqV6aCfPLDrXtOBAA2D
// const getLiveCallDetails = (payload,data) => {
// 	return new Promise((resolve, reject) => {
// 		http.post(`/browser-sync/socket.io/?EIO=${payload.EIO}`, payload).then((data) => {
// 			resolve(data);
// 		}).catch((err) => {
// 			reject(err);
// 		});
// 	});
// };


const getLiveCallDetails = (payload, data) => {
	return new Promise((resolve, reject) => {
		http.post(`getLiveCalls`,payload).then((data) => {
			resolve(data);
		}).catch((err) => {
			reject(err);
		});
	});
};

const getRegistrationsData = (payload) => {
	return new Promise((resolve, reject) => {
		http.get(`/getRegistrations?accountId=${payload.accountId}&authToken=${payload.authToken}`).then((response) => {
			resolve(response);
		}).catch((error) => {
			reject(error);
		});
	});
};

module.exports = {
	//getOrderList,
	getRegistrationsData,
	getLiveCallDetails
	//getLiveCallDetails
};
