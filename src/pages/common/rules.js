export default {
    data() {
        return {
            cantBeEmpty: [v => !!v || "Field cannot be empty"],
            hasToBeNumber: [
                v => !!v || "Field cannot be empty",
                v => {
                    if (isNaN(v) || v.length < 10 || v.length > 14) {
                        return false || "Field can only be a 10 digit number";
                    } else {
                        return true;
                    }
                }
            ],
            tenDigitNo: [
                v => {
                    if (v.length > 0) {
                        if (isNaN(v) || v.length < 10 || v.length > 10) {
                            return false || "Field can only be a 10 digit number";
                        } else {
                            return true;
                        }

                    } else {
                        return true
                    }

                }
            ],
            hasToBeNumericValue: [
                v => !!v || "Field cannot be empty",
                v => {
                    if (isNaN(v)) {
                        return false || "Field can only be a number";
                    } else {
                        return true;
                    }
                }
            ],
            pinCodeRule: [
                v => !!v || "Field cannot be empty",
                v => {
                    if (isNaN(v) || v.length < 6 || v.length > 6) {
                        return false || "Field can only be a 6 digit number";
                    } else {
                        return true;
                    }
                }
            ],
            emailRule: [
                v =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                "E-mail must be valid"
            ]

        }
    },

}