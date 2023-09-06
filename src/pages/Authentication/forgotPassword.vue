<template>
  <v-app id="forgetPassword">
    <v-main
      class="login-panel pt-15"
      :style="{ backgroundImage: `url(${backgroundUrl})` }"
    >
      <v-container fluid class="pt-15">
        <v-dialog v-model="showDialog" max-width="400px" persistent>
          <v-card flat class="Card-style pa-2">
            <v-container fluid>
              <v-layout justify-center>
                <v-flex xs12 sm12>
                  <v-flex xs12>
                    <h2>Thank You</h2>
                    <br />
                    <p>Email Has Been Sent to Your Respective Account!</p>
                  </v-flex>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      @click="
                        $refs.forgotPasswordForm.reset();
                        showDialog = false;
                      "
                      to="/login"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-dialog>
        <v-col cols="12">
          <v-row class="pt-15" align="center" justify="center">
            <v-card class="form-card mt-10 py-8" width="500">
              <v-col cols="12">
                <v-card-text>
                  <h1
                    class="header-font blue-grey--text text--darken-2 font-weight-bold pb-4"
                  >
                    Forgot Password
                  </h1>
                  <h6 class="subtitle-1 pb-4 font-weight-light">
                    Do have an already account?
                    <a href="/"> Sign In</a>
                  </h6>
                  <v-form v-model="isFormValid" ref="loginForm" class="py-3">
                    <v-text-field
                      v-model.trim="forgotPasswordData.emailAddress"
                      :rules="emailRule"
                      label="Email"
                      outlined
                      
                      required
                    ></v-text-field>
                    <v-btn
                      color="primary"
                      class="px-0 mx-0"
                      block
                      @click="forgotPassword"
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
import backgroundUrl from "../../assets/images/didpanel.jpg";

export default {
  name: "forgotPassword",
  data() {
    return {
      forgotPasswordData: {},
      emailRule: [(v) => !!v || "Enter your Email."],
      showDialog: false,
      isFormValid: false,
      backgroundUrl: backgroundUrl,
    };
  },

  methods: {
    clear() {
      this.$refs.forgotPasswordForm.reset();
    },
    async forgotPassword() {
      try {
        let res = await authAPI.forgotPassword(this.forgotPasswordData);
        if ((this.text = res.responseMessage)) {
          this.showDialog = true;
        }
      } catch (err) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: err.data.messageDetail,
          color: "error",
        });
      }
    },
  },
};
</script>
