const http = require('./http');

const getRateListApi = (page, viewSize, payload) => {
    let searchData = '';
    let isoCountryCode = '';
    if (payload) {
        if (payload.searchText) {
            searchData = `&${payload.searchType}=${payload.searchText}`;
        }
        if (payload.isoCountryCode) {
            isoCountryCode = `&isoCountryCode=${payload.isoCountryCode}`
        }
    }
    return new Promise((resolve, reject) => {
        http.get(`/getKazooRates?viewIndex=${page}&pageSize=${viewSize}${searchData}${isoCountryCode}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getRateDetail = (rateId) => {
    return new Promise((resolve, reject) => {
        http.get(`/getRateDetailsViaKazoo?rateId=${rateId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const deleteTask = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/deleteTask?taskId=${payload.taskId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getTasks = (accountId) => {
    return new Promise((resolve, reject) => {
        http.get(`/getTasks?accountId=${accountId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getTaskDetail = (taskId) => {
    return new Promise((resolve, reject) => {
        http.get(`/getTaskDetail?taskId=${taskId.taskId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const updateInventory = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('/updateInventoryItem',payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    getRateListApi,
    getRateDetail,
    getTasks,
    deleteTask,
    getTaskDetail,
    updateInventory,
};