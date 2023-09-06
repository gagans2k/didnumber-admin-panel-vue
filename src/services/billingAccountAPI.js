import http from "../services/http"

const addAmountToCart = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('addAmountToCart', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const callPayPalEvent = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('callPayPalEvent', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const cancelPaypalOrder = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/cancelPaypalOrder?orderId=${payload.orderId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getOrderDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getOrderDetail?orderId=${payload.orderId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const changeLowBalanceStatus = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('changeLowBalanceNotifyStatus', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const createPaypalAgreement = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('createPaypalAgreement', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getLowBalance = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getLowBalanceNotifyStatus?partyId=${payload.partyId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getAgreementId = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getAgreementId?partyId=${payload.partyId}&id=${payload.id}&token=${payload.token}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getAutoLowBalance = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getAutoLowBalanceNotifyStatus?partyId=${payload.partyId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getDebitTransactions = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDebitTransactions?billingAccountId=${payload.billingAccountId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};


const getUserCreditTransactions = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getUserCreditTransactions?partyId=${payload.partyId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getPendingTransaction = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/pendingTransaction?partyId=${payload.partyId}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const cancelAgreement = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/cancelAgreement?id=${payload.partyId}&id=${payload.id}&token=${payload.token}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};





module.exports = {
    addAmountToCart,
    callPayPalEvent,
    cancelPaypalOrder,
    getOrderDetails,
    changeLowBalanceStatus,
    createPaypalAgreement,
    getLowBalance,
    getAutoLowBalance,
    getDebitTransactions,
    getUserCreditTransactions,
    getPendingTransaction,
    getAgreementId,
    cancelAgreement
};