const http = require('./http');
// const authToken = localStorage.getItem("authToken");

// const getProductStoreDetail = () => {
//     return new Promise((resolve, reject) => {
//         http.get('/getProductStoreDetails').then((response) => {
//             resolve(response);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// };

// const getDIDHistory = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.get(`/didHistory?accountId=${payload.accountId}`).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         })
//     })
// };

// const getInboundOutboundGraph = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.get(`/getInboundOutboundCallsGraph?accountId=${payload.accountId}&direction=${payload.direction}`)
//             .then((data) => {
//                 resolve(data);
//             }).catch((error) => {
//                 reject(error);
//             })
//     })
// };

// Below APIs relate to Toolbar
// const getPhoneNumList = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.get(`/getPhoneNumList?accountId=${payload.accountId}`).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         })
//     })
// };

// const getBalanceKazoo = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.get(`/getBalanceKazoo?accountId=${payload.accountId}`).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         })
//     })
// };

const getCountAllApi = () => {
    return new Promise((resolve, reject) => {
        http.get('/getCountAll').then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    })
};

const editDidNumber = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/editDidNumber`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const creditDebitBalanceWallets = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/creditDebitBalanceWallets', payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const ratesUploadViaCSV = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/ratesUploadViaCSV`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const receiveDidCsv = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/receiveDidCsv`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const importLocationDataCsv = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/importLocationDataCsv`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const enableDisableStatus = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/enableDisableStatus`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};
module.exports = {
    //getBalanceKazoo,
    //getPhoneNumList,
    //getProductStoreDetail,
    //getDIDHistory,
    //getInboundOutboundGraph,
    receiveDidCsv,
    getCountAllApi,
    editDidNumber,
    creditDebitBalanceWallets,
    ratesUploadViaCSV,
    importLocationDataCsv,
    enableDisableStatus
};