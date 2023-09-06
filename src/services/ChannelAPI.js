const http = require('./http');

const getAccountList = (payload) => {
	return new Promise((resolve, reject) => {
		http.get(`getAccountList?accountId=${payload.accId}&authToken=${localStorage.getItem("authNew")}`).then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		});
	});
};

const getAccountLimitsDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`getAccountLimitsDetails?accountId=${payload.accountId}&authToken=${payload.authToken}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const editAccountLimits = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/editAccountLimits',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getCarriers = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`getCarriers?accountId=${payload.accountId}&authToken=${payload.authToken}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const updateCarrier = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/updateCarrier',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const insertCarrier = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/insertCarrier',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const removeCarrier = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/removeCarrier?accountId=${payload.accountId}&authToken=${payload.authToken}&carrierId=${payload.carrierId}`).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};


const getCarrierDetail = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`getCarrierDetail?accountId=${payload.accountId}&authToken=${payload.authToken}&carrierId=${payload.carrierId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

module.exports = {
	getAccountList,
	getAccountLimitsDetails,
	editAccountLimits,
    getCarriers,
    insertCarrier,
    removeCarrier,
    getCarrierDetail,
    updateCarrier
};
