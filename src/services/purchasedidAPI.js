const http = require('./http');
// const authToken = localStorage.getItem("authToken");

const getFacilityGeoList = () => {
    return new Promise((resolve, reject) => {
        http.get('/getFacilityGeoList').then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getStateList = (country) => {
    return new Promise((resolve, reject) => {
        http.get(`/getStateList?countryGeoId=${country}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    })
};

const getDidTypeCount = (payload) => {
    return new Promise((resolve, reject) => {
        let qs = `?countryGeoId=${payload.countryGeoId}&requireState=${payload.requireState}`;
        if (payload.stateGeoId) {
            qs = `?stateGeoId=${payload.stateGeoId}&requireState=${payload.requireState}`;
        }

        http.get(`/getDidTypeCount${qs}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    })
};

const getCountryCityList = (payload, viewIndex, viewSize) => {
    let searchData = '';
    if (payload.searchText) {
        searchData = `&${payload.searchType}=${payload.searchText}`;
    }
    return new Promise((resolve, reject) => {
        http.get(`/getCountryCityList?countryGeoId=${payload.countryGeoId}&didType=${payload.didType}&viewIndex=${viewIndex}&viewSize=${viewSize}${searchData}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    })
};

const getCountryTollfreeList = (payload) => {
    let searchData = '';
    if (payload.searchText) {
        searchData = `&${payload.searchType}=${payload.searchText}`;
    }
    return new Promise((resolve, reject) => {
        http.get(`/getCountryTollfreeList?didType=${payload.didType}&facilityGeoId=${payload.facilityGeoId}${searchData}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    })
};

const addToCart = (payload, data) => {
    return new Promise((resolve, reject) => {
        http.post(`/addDidToCart;jsessionid=${data.sessionId}?accountId=${data.accountId}`, payload).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    getFacilityGeoList,
    getStateList,
    getDidTypeCount,
    getCountryCityList,
    getCountryTollfreeList,
    addToCart
};