const http = require('./http');

const login = (payload) => {
	return new Promise((resolve, reject) => {
		let userdata = {
			username: payload.username,
			password: payload.password,
		};
		http.post('/doLogin', userdata).then((data) => {
			resolve(data);
		}).catch((err) => {
			reject(err);
		});
	});


	// var userdata = {
	// 	username: payload.username,
	// 	password: payload.password,
	// };
	// return http.post('doLogin', userdata).then((data) => {
	// 	return cb(null, data);
	// }).catch((err) => {
	// 	return cb(err, null);
	// });
};

// const createAccount = (payload) => {
// 	return new Promise((resolve, reject) => {
// 		let accountData = {
// 			kazooData: {
// 				data: {
// 					apps: {},
// 					call_forward: {
// 						substitute: true,
// 						enabled: false,
// 						require_keypress: false,
// 						keep_caller_id: false,
// 						direct_calls_only: false
// 					},
// 					call_restriction: {
// 						closed_groups: {
// 							action: 'inherit'
// 						},
// 						tollfree_us: {
// 							action: 'inherit'
// 						},
// 						toll_us: {
// 							action: 'inherit'
// 						},
// 						emergency: {
// 							action: 'inherit'
// 						},
// 						caribbean: {
// 							action: 'inherit'
// 						},
// 						did_us: {
// 							action: 'inherit'
// 						},
// 						international: {
// 							action: 'inherit'
// 						},
// 						unknown: {
// 							action: 'inherit'
// 						}
// 					},
// 					hotdesk: {
// 						enabled: false,
// 						id: "",
// 						require_pin: false,
// 						keep_logged_in_elsewhere: false
// 					},
// 					contact_list: {
// 						exclude: false
// 					},
// 					music_on_hold: {},
// 					priv_level: "admin",
// 					vm_to_email_enabled: true,
// 					fax_to_email_enabled: false,
// 					verified: true,
// 					timezone: "Africa/Abidjan",
// 					record_call: false,
// 					email: payload.email,
// 					password: payload.password,
// 					first_name: payload.firstName,
// 					last_name: payload.lastName,
// 					phone_number: payload.phoneNumber,
// 					pwd_mngt_pwd2: payload.confirmPassword,
// 					username: payload.email,
// 					pwd_mngt_pwd1: payload.password
// 				},
// 				postalAddress: {
// 					address1: payload.address1,
// 					city: payload.city,
// 					postalCode: payload.pinCode,
// 					countryGeoId: payload.countryGeoId,
// 					stateProvinceGeoId: payload.stateProvinceGeoId
// 				}
// 			}
// 		};
// 		http.post('createAccount', accountData).then((data) => {
// 			resolve(data);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// const forgotPassword = (payload) => {
// 	return new Promise((resolve, reject) => {
// 		let userdata = {
// 			emailAddress: payload.emailAddress
// 		};
// 		http.post('/sendForgotPasswordEmailNotification', userdata).then((data) => {
// 			resolve(data);
// 		}).catch((err) => {
// 			reject(err);
// 		});
// 	});
// };

// const getSecurityList = () => {
// 	return new Promise((resolve, reject) => {
// 		http.get('/getSecurityQuestions').then((response) => {
// 			resolve(response);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

// const saveQuestions = (payload) => {
// 	return new Promise((resolve, reject) => {
// 		http.post(`/saveQuestions`, payload).then((data) => {
// 			resolve(data);
// 		}).catch((err) => {
// 			reject(err);
// 		});
// 	});
// };

// const emailVerification = (payload) => {
// 	return new Promise((resolve, reject) => {
// 		http.post('/createEmailAddressVerification', payload).then((data) => {
// 			resolve(data);
// 		}).catch((err) => {
// 			reject(err);
// 		});
// 	});
// };

// const verifyPasswordRecoveryLink = (data) => {
// 	return new Promise((resolve, reject) => {
// 		http.get(`/verifyPasswordRecoveryLink?emailAddress=${data.email}&verifyHash=${data.verifyHash}`).then((data) => {
// 			resolve(data);
// 		}).catch((err) => {
// 			reject(err);
// 		});
// 	});
// };

// const updatePassword = (payload) => {
// 	return new Promise((resolve, reject) => {
// 		http.post('/updateUserPassword', payload).then((data) => {
// 			resolve(data);
// 		}).catch((err) => {
// 			reject(err);
// 		});
// 	});
// };

// const getPartySecurityQuestions = (data) => {
// 	return new Promise((resolve, reject) => {
// 		http.get('/getPartySecurityQuestions',data.userLoginId).then((response) => {
// 			resolve(response);
// 		}).catch((error) => {
// 			reject(error);
// 		});
// 	});
// };

module.exports = {
	login,
	// createAccount,
	// forgotPassword,
	// getSecurityList,
	// saveQuestions,
	// emailVerification,
	// verifyPasswordRecoveryLink,
	// updatePassword,
	// getPartySecurityQuestions,
};
