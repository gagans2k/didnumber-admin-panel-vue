const http = require('./http');
// const authToken = localStorage.getItem("authToken");

const getNumberManagerListSize = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/getNumberManagerListSize`, payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getDidNumberDetailSubscriptionNew = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDidNumberDetailSubscriptionNew?viewIndex=${payload.viewIndex}&viewSize=${payload.viewSize}&partyId=${payload.partyId}&didStatus=${payload.didStatus}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getCustomDidNumberDetailSubscriptionNew = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDidNumberDetailSubscriptionNew?partyId=${payload.partyId}&didStatus=${payload.didStatus}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

// const autoRenewSubscription = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.post('autoRenewSubscription', payload).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// };

const setBillingTenure = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('updateBillingTenure', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getDeviceList = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDeviceList?accountId=${payload.accountId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getFaxboxesList = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getFaxboxesList?accountId=${payload.accountId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const deleteDeviceDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/deleteDeviceDetails?accountId=${payload.accountId}&deviceId=${payload.deviceId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const deleteFaxboxesDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/deleteFaxboxesDetails?accountId=${payload.accountId}&faxboxesId=${payload.faxboxesId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getDIDRenewTotalCost = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDIDRenewTotalCost?inventoryItemId=${payload.inventoryItemId}&orderId=${payload.orderId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const runSubscriptionExpired = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/runSubscriptionExpired?subscriptionId=${payload.subscriptionId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getForwardDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getForwardDetails?accountId=${payload.accountId}&inventoryItemId=${payload.inventoryItemId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getFilteredDeviceList = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getFilteredDeviceList?accountId=${payload.accountId}&forwardType=${payload.forwardType}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};


const assignCellPhone = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('assignCellPhone', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const assignDidToServers = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('assignDidToServers', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};


const assignSip = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('assignSip', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const addConnectivityServers = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('addConnectivityServers', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const assignFaxBox2Email = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('assignFaxBox2Email', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const removeServerForward = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('removeServerForward', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const deleteCallFlow = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/deleteCallFlow?accountId=${payload.accountId}&faxboxesId=${payload.faxboxesId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

module.exports = {
    getNumberManagerListSize,
    getDidNumberDetailSubscriptionNew,
    getCustomDidNumberDetailSubscriptionNew,
    // autoRenewSubscription,
    setBillingTenure,
    getDeviceList,
    getFaxboxesList,
    deleteDeviceDetails,
    deleteFaxboxesDetails,
    getDIDRenewTotalCost,
    runSubscriptionExpired,
    getForwardDetails,
    getFilteredDeviceList,
    assignCellPhone,
    deleteCallFlow,
    assignDidToServers,
    addConnectivityServers,
    removeServerForward,
    assignFaxBox2Email,
    assignSip
};