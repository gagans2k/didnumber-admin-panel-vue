const http = require('./http');
// const authToken = localStorage.getItem("authToken");

const getDeviceList = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDeviceList?accountId=${payload.accountId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getUsersList = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getUsersList?accountId=${payload.accountId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getMediaList = () => {
    return new Promise((resolve, reject) => {
        http.get(`/getMediaList`, ).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getDeviceDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getDeviceDetails?accountId=${payload.accountId}&deviceId=${payload.deviceId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getAccountDetail = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getAccountsDetails?accountId=${payload.accountId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getUsernameForDevice = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getUsernameForDevice?accountId=${payload.accountId}`).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const editDeviceDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/editDeviceDetails`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const addDevice = (payload) => {
    return new Promise((resolve, reject) => {
        http.post(`/addDevice`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const deleteDeviceDetails = (payload) => {
    return new Promise((resolve, reject) => {
        http.delete(`/deleteDeviceDetails?accountId=${payload.accountId}&deviceId=${payload.deviceId}`).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    getDeviceList,
    editDeviceDetails,
    getUsersList,
    getMediaList,
    getDeviceDetails,
    getAccountDetail,
    getUsernameForDevice,
    addDevice,
    deleteDeviceDetails,
};