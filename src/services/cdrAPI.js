import http from "../services/http"
const authToken = localStorage.getItem("authToken");

const getCallRecordsData = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/getCallHistoryList?accountId=${payload.accId}&createdfrom=${payload.fromdate}&createdto=${payload.todate}&authToken=${localStorage.getItem("authToken")}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const getExportLogData = (payload) => {
    return new Promise((resolve, reject) => {
        http.get(`/exportLog?accountId=${payload.accId}&createdfrom=${payload.fromdate}&createdto=${payload.todate}&authToken=${localStorage.getItem("authToken")}`).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

export {
    //getPaginationDataList,
    getCallRecordsData,
    getExportLogData
};