//const http = require('./http');
import http from "@/services/mixinHttp";
export default {

    data() {
        return {
            // LOADER
            showLoader: false,
            loading: false,
            // SNACKBAR
            snackbar: false,
            snackbarColor: '',
            snackbarMessage: '',
            timeout: 4000,
            y: "top",
            x: "right",
            mode: "",

            // PAGINATION
            size: 10,
            elements: "",
            pageCount: "",
            pageNumber: 0

        }
    },
    methods: {
        // SNACKBAR
        seeSnackbar(snackbarMessage, color) {
            this.snackbarMessage = snackbarMessage;
            this.showLoader = false;
            this.snackbarColor = color;
            this.snackbar = true;
        },

        // SET PAGINATION
        setPagination(response) {
            this.elements = response.data.totalElements;
            var l = this.elements;
            var s = this.size;
            var floor = (l / s);
            this.pageCount = Math.floor(floor);
            if (this.pageCount == floor) {
                this.pageCount -= 1
            }
            this.showLoader = false;
            this.loading = false;
        },

        generateError(error) {
            console.log("error", error.data.messageDetail)
            var customError
            const errorNo = error.status
            switch (errorNo) {
                case 400:
                    let er = error
                    if (er.response.data.error) {
                        customError = error.response.error
                    }
                    if (er.response.data.errorMessage) {
                        customError = error.response.errorMessage
                    }
                    if (er.response.data.message) {
                        customError = error.response.message
                    }
                    return customError
                    break;
                case 401:
                    customError = "Session expired"
                    return customError
                    break;
                case 404:
                    customError = error.response.errorMessage
                    return customError
                    break;
                case 409:
                    customError = error.response.errorMessage
                    return customError
                    break;
                case 406:
                    if (error && error.response && error.response.errorMessage) {
                        customError = error.response.errorMessage
                    }

                    if (error.data.messageDetail) {
                        customError = error.data.messageDetail
                    }
                    return customError
                    break;
                case 500:
                    customError = error.message
                    return customError
                    break;
                default:
                    customError = "unknown error"
                    return customError
            }

        },

        // GET
        getMethod(url, params) {
            this.showLoader = true
            return http().get(url, {
                    params: params,
                    headers: {
                        // headers: { Authorization: "Bearer " + this.token }
                    }
                })
                .then(response => {
                    this.showLoader = false
                    return response
                })
                .catch(error => {
                    this.showLoader = false
                    const message = this.generateError(error)
                    if (message == "Session expired") {
                        this.$store.dispatch("setToken", null);
                        this.$router.push({
                            name: 'Login'
                        });
                    } else {
                        throw new Error(message);
                    }

                });
        },


        // POST
        postMethod(url, payload) {
            this.showLoader = true
            return http()
                .post(url, payload, {
                    //headers: { Authorization: "Bearer " + this.token }
                })
                .then(response => {
                    this.showLoader = false
                    return response
                })
                .catch(error => {
                    this.showLoader = false
                    const message = this.generateError(error)
                    if (message == "Session expired") {
                        this.$store.dispatch("setToken", null);
                        this.$router.push({
                            name: 'Login'
                        });
                    } else {
                        throw new Error(message);
                    }
                });
        },

        // PUT
        putMethod(url, payload) {
            this.showLoader = true
            return http()
                .put(url, payload, {
                    // headers: {
                    //     // Authorization: 'Bearer ' + this.token
                    // }
                })
                .then(response => {
                    this.showLoader = false
                    return response
                })
                .catch(error => {
                    const message = this.generateError(error)
                    if (message == "Session expired") {
                        this.$store.dispatch("setToken", null);
                        this.$router.push({
                            name: 'Login'
                        });
                    } else {
                        throw new Error(message);
                    }

                })
        }

    },
    computed: {
        displayedPageNumber() {
            return this.pageNumber + 1;
        },
        // managerIsADMIN_VIEW: {
        //     get() {
        //         if (this.$store.state.roleName == "ADMIN_VIEW") {
        //             return true;
        //         } else {
        //             return false
        //         }
        //     },
        //     set(newValue) {
        //         this.managerIsADMIN_VIEW = newValue;
        //     }

        // }
    },
}