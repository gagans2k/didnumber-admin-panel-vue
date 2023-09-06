<template>
  <v-app id="updatePassword">
    <v-main class="body-color">
      <v-container>
        <v-row align="center" justify="center">
          <v-card class="updatePassword-form">
            <v-card-title class="header"> Update Password </v-card-title>
            <v-card-text>
              <v-form v-model="isFormValid" ref="updatePasswordForm">
                <v-row cols="12">
                  <v-text-field
                    :rules="passwordRule"
                    hint="Password Must be contain at least 8 characters, including at least 1 number , 1 alphabet in lowercase letters or uppercase letters and 1 special characters e.g #, ?, !"
                    v-model.trim="updatePasswordData.newPassword"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    placeholder="Password"
                    required
                    append-icon="remove_red_eye"
                    autocomplete="off"
                  ></v-text-field>
                </v-row>
                <v-row cols="12">
                  <v-text-field
                    :rules="confirmPasswordRules"
                    v-model.trim="updatePasswordData.newPasswordVerify"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    placeholder="Confirm Password"
                    required
                    append-icon="remove_red_eye"
                    autocomplete="off"
                  ></v-text-field>
                </v-row>
              </v-form>
              <v-layout class="form-field">
                <v-flex sm12>
                  <v-btn
                    color="primary"
                    block
                    @click="updatePassword"
                    :disabled="!isFormValid"
                    >UPDATE</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import authAPI from "@/services/authAPI.js";

export default {
  data() {
    return {
      e1: true,

      updatePasswordData: {},
      passwordRule: [(v) => !!v || "Please enter the Password"],
      confirmPasswordRules: [
        (value) => !!value || "Please enter confirm password",
        (value) =>
          value === this.updatePasswordData.newPassword ||
          "The password confirmation does not match.",
      ],

      isFormValid: false,
      queryParams: {},
    };
  },

  methods: {
    clear() {
      this.$refs.updatePasswordForm.reset();
    },

    async verifyPasswordRecoveryLink() {
      try {
        let str = window.location.search.replace("?", "");
        let arr = str.split("&");

        for (let item of arr) {
          let split = item.split("=");
          this.queryParams[split[0]] = split[1];
        }

        let res = await authAPI.verifyPasswordRecoveryLink(this.queryParams);
        if (!res.linkValid) {
          this.$router.push("/login");
        }
      } catch (err) {
      }
    },

    async updatePassword() {
      let updatePasswordDetail = {
        userLoginId: this.queryParams.email.replace("%40", "@"),
        loggedIn: "N",
        newPassword: this.updatePasswordData.newPassword,
        newPasswordVerify: this.updatePasswordData.newPasswordVerify,
      };
      try {
        let res = await authAPI.updatePassword(updatePasswordDetail);
        this.$router.push("/login");
      } catch (err) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: err.data.messageDetail,
          color: "error",
        });
      }
    },
  },

  mounted() {
    this.verifyPasswordRecoveryLink();
  },
};
</script>
