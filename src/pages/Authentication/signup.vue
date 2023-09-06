<template>
  <v-app id="signup">
    <v-main
      class="login-panel pt-10"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <v-container class="fill-height">
        <v-col cols="12">
          <v-row align="center" justify="center">
            <v-card class="py-8 px-md-5" width="600">
              <v-card-text>
                <h1
                  class="header-font blue-grey--text text--darken-2 font-weight-bold pb-4"
                >
                  Sign Up
                </h1>
                <h6 class="subtitle-1 pb-4 font-weight-light">
                  Do have an already account?
                  <a href="/"> Sign In</a>
                </h6>
                <v-form v-model="isFormValid">
                  <v-row no-gutters>
                    <v-col cols="12" sm="12" md="6 pr-md-2">
                      <v-text-field
                        type="text"
                        v-model.trim="signupData.firstName"
                        placeholder="First Name"
                        required
                        outlined
                        
                        append-icon="person"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model.trim="signupData.lastName"
                        placeholder="Last Name"
                        required
                        outlined
                        
                        append-icon="person"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="signupData.email"
                        :rules="emailRule"
                        placeholder="Email"
                        required
                        outlined
                        
                        append-icon="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6 pr-md-2">
                      <v-text-field
                        :rules="passwordRule"
                        hint="Password Must be contain at least 8 characters, including at least 1 number , 1 alphabet in lowercase letters or uppercase letters and 1 special characters e.g #, ?, !"
                        v-model.trim="signupData.password"
                        :append-icon-cb="() => (e1 = !e1)"
                        :type="e1 ? 'password' : 'text'"
                        placeholder="Password"
                        required
                        outlined
                        
                        append-icon="remove_red_eye"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :rules="confirmPasswordRules"
                        v-model.trim="signupData.confirmPassword"
                        :append-icon-cb="() => (e1 = !e1)"
                        :type="e1 ? 'password' : 'text'"
                        placeholder="Confirm Password"
                        required
                        outlined
                        
                        append-icon="remove_red_eye"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        :rules="addressRule"
                        v-model.trim="signupData.address1"
                        placeholder="Address 1"
                        required
                        outlined
                        
                        append-icon="home"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        :rules="addressRule"
                        v-model.trim="signupData.address2"
                        placeholder="Address 2"
                        required
                        outlined
                        
                        append-icon="home_work"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6 pr-md-2">
                      <v-autocomplete
                        v-model.trim="signupData.country"
                        placeholder="Country"
                        :items="countryData"
                        required
                        outlined
                        
                        @change="getStateList(signupData.country)"
                        append-icon="business"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="6 pr-md-2">
                      <v-autocomplete
                        v-model.trim="signupData.state"
                        placeholder="State"
                        :items="stateData"
                        @change="getProvinceCode(signupData.state)"
                        append-icon="location_on"
                        required
                        outlined
                        
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="4 pr-md-2">
                      <v-text-field
                        v-model.trim="signupData.city"
                        placeholder="City"
                        required
                        outlined
                        
                        append-icon="location_city"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="4 pr-md-2">
                      <v-text-field
                        :rules="pincodeRule"
                        v-model.trim="signupData.pinCode"
                        placeholder="Pin Code"
                        counter="6"
                        required
                        outlined
                        
                        append-icon="pin_drop"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <v-text-field
                        :rules="phoneNumberRule"
                        hint="Please enter only numeric and plus sign in Phone number field."
                        v-model.trim="signupData.phoneNumber"
                        placeholder="Phone Number"
                        append-icon="phone"
                        class="mb-0 pb-0"
                        required
                        outlined
                        
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  class="right-btn"
                  to="/securityQuestion"
                  @click="createAccount"
                  :disabled="!isFormValid"
                  block
                >
                  Sing Up
                </v-btn>
                <!-- <v-row align="center" justify="center">
                  <v-btn color="error" to="/login">CANCEL</v-btn>
                  <v-btn
                    color="primary"
                    class="right-btn"
                    to="/securityQuestion"
                    @click="createAccount"
                    :disabled="!isFormValid"
                  >
                    CREATE
                  </v-btn>
                </v-row> -->
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import authAPI from "@/services/authAPI.js";
import countryStateAPI from "@/services/countryStateAPI.js";
import backgroundUrl from "../../assets/images/didpanel.jpg";

export default {
  data() {
    return {
      valid: false,
      checkbox: true,
      signupData: {
        postalAddress: {},
      },
      emailRule: [(v) => !!v || "This value should be a valid Email."],
      passwordRule: [(v) => !!v || "Please enter the Password"],
      confirmPasswordRules: [
        (value) => !!value || "Please enter confirm password",
        (value) =>
          value === this.signupData.password ||
          "The password confirmation does not match.",
      ],
      addressRule: [(v) => !!v || "This value should be a valid Address."],
      pincodeRule: [
        (v) => (v && v.length <= 6) || "Pin code must have 6 characters",
      ],
      phoneNumberRule: [(v) => !!v || "This value should be a Phone Number."],
      e1: true,
      loading: false,
      disabled: true,
      formValidated: "",
      countryData: [],
      stateData: [],
      countryGeoId: "",
      stateProvinceGeoId: "",
      isFormValid: false,
      backgroundUrl: backgroundUrl,
    };
  },

  methods: {
    async createAccount() {
      try {
        this.signupData.countryGeoId = this.countryGeoId;
        this.signupData.stateProvinceGeoId = this.stateProvinceGeoId;
        this.$store.dispatch("STORE_SIGNUP_DATA", this.signupData);
      } catch (error) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: err.data.messageDetail,
          color: "error",
        });
      }
    },

    async getCountryList() {
      try {
        let response = await countryStateAPI.getCountryList();
        this.countryData = response.countryList;
      } catch (error) {
      }
    },

    async getStateList() {
      try {
        this.countryGeoId = this.signupData.country.split(":")[1].trim();
        let response = await countryStateAPI.getStateList(this.countryGeoId);
        this.stateData = response.stateList;
      } catch (error) {
      }
    },

    getProvinceCode(state) {
      this.stateProvinceGeoId = state.split(":")[1].trim();
    },
  },

  mounted() {
    this.getCountryList();
  },
};
</script>

<style scoped>
/* .body-color {
  width: 100%;
  background-color: #f1f1f1;
  flex-wrap: wrap;
}
.signup-form {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  width: 800px;
}
.header {
  color: dodgerblue;
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  display: block;
  text-align: center;
}
.form-field {
  display: -webkit-box;
}
.ajax-loader {
  padding-left: 36px;
  padding-right: 0;
}
.right-btn {
  margin-left: 2%;
} */
</style>
