const http = require('./http');

const receiveDidCsv = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('receiveDidCsv', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const updateProfile = (payload) => {
    return new Promise((resolve, reject) => {
        http.post('updateUserDetail', payload).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getCountryList = () => {
	return new Promise((resolve, reject) => {
		http.get('/getCountryList').then((response) => {
			resolve(response);
		}).catch((error) => {
			reject(error);
		});
	});
};

const getCountryCities = (payload) => {
	return new Promise((resolve, reject) => {
		http.get(`/getCountryCities?countryGeoId=${payload}`).then((response) => {
			resolve(response);
		}).catch((error) => {
			reject(error);
		});
	});
};

const getStateList = (country) => {
	return new Promise((resolve, reject) => {
		http.get(`/getAssociatedStateList?countryGeoId=${country}`).then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		})
	})
}

module.exports = {
	getCountryList,
	updateProfile,
	getCountryCities,
	getStateList
};
