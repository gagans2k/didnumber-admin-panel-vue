<template>
  <v-app id="login ">
    <v-main
      class="login-panel pt-15"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <v-container fluid class="pt-15">
        <v-dialog v-model="showMessageSnackbar" max-width="400px" persistent>
          <v-card flat class="Card-style pa-2">
            <v-container fluid>
              <v-layout justify-center>
                <v-flex xs12 sm12>
                  <v-flex xs12>
                    <p>
                      <b>{{ showMessage }}</b>
                    </p>
                  </v-flex>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeMessageDialog" depressed>OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-dialog>
        <template>
          <v-row justify="center">
            <v-dialog v-model="showErrordialog" max-width="290">
              <v-card>
                <v-card-title class="headline">
                  {{ printErrorMessageTitle }}
                </v-card-title>

                <v-card-text>
                  {{ printErrorMessage }}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" text @click="canceldialogPopUp">
                    Cancel
                  </v-btn>

                  <v-btn color="green darken-1" text @click="canceldialogPopUp">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
        <v-col cols="12">
          <v-row class="pt-15" align="center" justify="center">
            <v-card class="form-card">
              <v-col cols="12">
                <v-card-text>
                  <h1
                    class="header-font blue-grey--text text--darken-2 font-weight-bold pb-4"
                  >
                    Sign in
                  </h1>
                  <!-- <h6 class="subtitle-1 pb-4 font-weight-light">
                    Don't have an account?
                    <a href="/signup"> Sign Up</a>
                  </h6> -->
                  <v-form v-model="isFormValid" ref="loginForm">
                    <loading :active="isLoading" :loader="loader" />
                    <v-text-field
                      v-model.trim="loginData.username"
                      :rules="nameRules"
                      label="Email"
                      outlined
                      required
                    ></v-text-field>
                    <v-text-field
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required]"
                      :type="showPassword ? 'text' : 'password'"
                      v-model.trim="loginData.password"
                      label="Password"
                      @keyup.enter="login"
                      @click:append="showPassword = !showPassword"
                      outlined
                    >
                    </v-text-field>
                    <!-- <v-checkbox
                        v-model="checkbox"
                        label="Remember me?"
                      ></v-checkbox> -->
                    <v-btn
                      color="primary"
                      block
                      @click="login"
                      :disabled="!isFormValid"
                      >Sign In</v-btn
                    >
                  </v-form>
                </v-card-text>
              </v-col>
            </v-card>
          </v-row>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import authAPI from "@/services/authAPI.js";
import Loading from "vue-loading-overlay";
import AllApiCalls from "@/services/AllApiCalls";
import "vue-loading-overlay/dist/vue-loading.css";
import backgroundUrl from "../../assets/images/didpanel.jpg";
import axios from "axios";
export default {
  name: "Login",
  props: {
    source: String,
  },
  mixins: [AllApiCalls],
  data() {
    return {
      isLoading: false,
      //fullPage: false,
      loader: "bars",
      ipAdddress: "",
      countryCode: "",
      loginData: {
        username: "",
        password: "",
      },
      nameRules: [(v) => !!v || "Email is required"],
      rules: {
        required: (value) => !!value || "Password is Required.",
      },
      e1: true,
      loading: false,
      disabled: true,
      isFormValid: false,
      showMessageSnackbar: false,
      showErrordialog: false,
      showMessage: "",
      dialog: false,
      printErrorMessage: "",
      printErrorMessageTitle: "",
      showPassword: false,
      checkbox: false,
      backgroundUrl: backgroundUrl,
    };
  },

  components: {
    Loading,
  },

  mounted() {
    if (this.$store.state.isUserLoggedIn == true) {
      this.$router.push("/Dashboard");
    }
    this.readDataFromAPI();
  },

  methods: {
    closeMessageDialog() {
      this.showMessageSnackbar = false;
      this.$refs.loginForm.reset();
    },

    canceldialogPopUp() {
      this.showErrordialog = false;
    },

    readDataFromAPI() {
      this.loading = true;
      // const { page, itemsPerPage } = this.options;
      // let pageNumber = page - 1;
      axios.get("https://ipapi.co/json/").then((data) => {
        this.ipAdddress = data.ip;
        this.countryCode = data.country;
        if (this.ipAdddress == null) {
          localStorage.setItem("ipAddress", "192.167.1.4");
          localStorage.setItem("countryCode", "IN");
        }
        //Then injecting the result to datatable parameters.
        this.loading = false;
      });
    },

    async login() {
      this.isLoading = true;
      // this.loginData.geoLocation = localStorage.getItem("countryCode");
      // this.loginData.geoLocation = "SG";
      // localStorage.setItem('nameOfUser', this.loginData.username)
      // localStorage.setItem('passwordOfUser', this.loginData.password)
      try {
        // var userName = localStorage.getItem("nameOfUser");
        this.loginData.username = this.loginData.username.toLowerCase();
        let res = await authAPI.login(this.loginData);
        if (res.partyDetail) {
          if (
            res.partyDetail &&
            res.partyDetail.isAuthenticated == true &&
            res.partyDetail.role == "ADMIN"
          ) {
            // } else {
            localStorage.setItem("authToken", res.basicAuth);
            //localStorage.setItem("sessionId", res.sessionId);
            localStorage.setItem("userDetail", JSON.stringify(res.partyDetail));
            localStorage.setItem(
              "auth",
              btoa(`${this.loginData.username}:${this.loginData.password}`)
            );
            this.$router.push("/dashboard");
            localStorage.setItem("authNew", res.partyDetail.authToken);
            this.text = res.responseMessage;
            this.$root.$emit("SHOW_SNACKBAR", {
              text: "You are successfully logged in",
              color: "success",
            });
            setTimeout(() => {
              this.isLoading = false;
            }, 3000);
          } else {
            this.showMessage = "You cannot login to this application!";
            this.showMessageSnackbar = true;
            this.isLoading = false;
            // this.$refs.isFormValid.reset();
            // localStorage.clear();
          }
        } else {
          // Show message
          this.showMessage = res.successMessage;
          this.showMessageSnackbar = true;
          this.isLoading = false;
        }
      } catch (err) {
        this.showErrordialog = true;
        this.printErrorMessage = err && err.data && err.data.messageDetail;
        this.printErrorMessageTitle =
          err && err.data && err.data.responseMessage;
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Incorrect Password",
          color: "error",
        });
        this.isLoading = false;
      }

      // --3rd--
      //   authAPI.login(this.loginData, (err, data) => {
      //  if (err !== null) {
      //  } else {
      // }
      //   });
    },
  },
};
</script>

<style scoped>
</style>