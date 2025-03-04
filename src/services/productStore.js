const http = require('./http');

const uploadDidAttachment = (payload) => {
	return new Promise((resolve, reject) => {
		http.post('uploadDidAttachment', payload).then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		});
	});
};

const getProductStoreDetails = () => {
	return new Promise((resolve, reject) => {
		http.get('getProductStoreDetails').then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		});
	});
};

const updateProductStoreDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/updateProductStoreDetails',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const createProductStoreDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/createProductStoreDetails',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const assignDidToOrder = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/assignDidToOrder',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const cancelDIDAllocation = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/cancelDIDAllocation',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const disableDID = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/disableDID',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const enableDID = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/enableDID',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const deleteDidNumber = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/deleteDidNumberInventory?inventoryItemId=${payload.inventoryItemId}`).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const activateNumber = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/activateNumber',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const didNumberHistory = () => {
	return new Promise((resolve, reject) => {
		http.get('didNumberHistory').then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		});
	});
};

const terminateDID = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/terminateDID',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
	getProductStoreDetails,
	uploadDidAttachment,
	updateProductStoreDetails,
	createProductStoreDetails,
	assignDidToOrder,
	cancelDIDAllocation,
    disableDID,
    enableDID,
    deleteDidNumber,
    activateNumber,
    didNumberHistory,
    terminateDID
};
