//const http = require('./http'); 
//import http from "./http"
// // const authToken = localStorage.getItem("authToken");

// const getUserDetail = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.get(`/getUserDetail?accountId=${payload.accountId}&userId=${payload.userId}`).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         })
//     })
// };

// const updateProfile = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.post('updateUserDetail', payload).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// };

// const getUserSecurityList = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.get(`/getUserSecurityQuestions?partyId=${payload.partyId}`).then((response) => {
//             resolve(response);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// };

// const updateSecurityQuestions = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.post(`/updateSecurityQuestions`, payload).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         });
//     });
// };

// const changePassword = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.post(`/changePassword`, payload).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// };

// const uploadProfileImage = (payload) => {
//     return new Promise((resolve, reject) => {
//         http.post('uploadProfilePicImage', payload).then((data) => {
//             resolve(data);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// };

//  module.exports = {
//     getUserDetail,
//     // updateProfile,
//     // getUserSecurityList,
//     // updateSecurityQuestions,
// //     changePassword,
// //     uploadProfileImage
// };