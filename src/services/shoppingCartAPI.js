const http = require('./http');
// const authToken = localStorage.getItem("authToken");

const modifyCart = (payload) => {
    return new Promise((resolve, reject) => {
        let sessionId = localStorage.getItem("sessionId")
        http.post(`/modifyCart;jsessionid=${sessionId}`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getCartItem = () => {
    return new Promise((resolve, reject) => {
        let sessionId = localStorage.getItem("sessionId");
        http.post(`/getCartItem;jsessionid=${sessionId}`).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getBilling = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getBillingAccDetails?accountId=${payload.accountId}&partyId=${payload.partyId}`)
            .then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            })
    })
};

const checkOut = (payload) => {
    return new Promise((resolve, reject) => {
        let sessionId = localStorage.getItem("sessionId")
        http.post(`/checkOut;jsessionid=${sessionId}`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const processOrder = (payload) => {
    return new Promise((resolve, reject) => {
        let sessionId = localStorage.getItem("sessionId")
        http.post(`/processOrder;jsessionid=${sessionId}`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    modifyCart,
    getCartItem,
    getBilling,
    checkOut,
    processOrder
};