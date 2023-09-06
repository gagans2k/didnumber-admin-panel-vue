<template>
  <v-app id="login">
    <v-main class="login-panel">
      <v-container class="fill-height" fluid>
        <v-dialog v-model="showDialog" max-width="400px" persistent>
          <v-card flat class="Card-style pa-2">
            <v-container fluid>
              <v-layout justify-center>
                <v-flex xs12 sm12>
                  <v-flex xs12>
                    <label class="title text-xs-center"
                      >Email Notification</label
                    >
                    <p>Press ok to verify your account</p>
                    <p>
                      <b>{{ signupData.email }}</b>
                    </p>
                  </v-flex>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="emailVerification">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-dialog>

        <v-row align="center" justify="center">
          <v-card class="form-card">
            <v-card-title>
              <v-card-text style="text-align: center; color: dodgerblue">
                <span class="header">Verify yourself as your location is changed</span>
              </v-card-text>
            </v-card-title>
            <v-card-text class="securityForm">
              <v-form v-model="isFormValid" ref="securityQuestionForm">
                <v-col cols="12">
                  <v-select
                    :items="securityList"
                    v-model.trim="firstQuestion.quationsId"
                    item-text="description"
                    item-value="questionId"
                  >
                  </v-select>
                  <v-text-field
                    placeholder="Answer 1"
                    v-model.trim="firstQuestion.answer"
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="12">
                  <v-select
                    :items="securityList"
                    label="Select Question"
                    v-model.trim="secondQuestion.quationsId"
                    item-text="description"
                    item-value="questionId"
                  ></v-select>
                  <v-text-field
                    placeholder="Answer 2"
                    v-model.trim="secondQuestion.answer"
                  ></v-text-field>
                </v-col> -->
                <!-- <v-col cols="12">
                  <v-select
                    :items="securityList"
                    label="Select Question"
                    v-model.trim="thirdQuestion.quationsId"
                    item-text="description"
                    item-value="questionId"
                  ></v-select>
                  <v-text-field
                    placeholder="Answer 3"
                    v-model.trim="thirdQuestion.answer"
                  ></v-text-field>
                </v-col> -->
              </v-form>
              <v-layout>
                <v-flex sm12>
                  <v-btn
                    color="primary"
                    block
                    @click="saveQuestions"
                    :disabled="!isFormValid"
                    >Save</v-btn
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
      valid: false,
      showDialog: false,

      e1: true,
      loading: false,
      securityList: [],
      firstQuestion: {},
      secondQuestion: {},
      thirdQuestion: {},
      isFormValid: false,
      signupData: {},
    };
  },

  methods: {
    clear() {
      this.$refs.securityQuestionForm.reset();
    },

    async getSecurityList() {
      try {
        let response = await authAPI.getSecurityList();
        this.securityList = response.securityQuestions;
        this.firstQuestion.quationsId =
          this.securityList.length > 0 ? this.securityList[0].questionId : null;
      } catch (error) {
      }
    },

    async getPartySecurityQuestions() {
        //var userName = localStorage.getItem("nameOfUser")
        //var userPassword = localStorage.getItem("passwordOfUser")
        var secuturityId = {
            userLoginId:localStorage.getItem("nameOfUser"),
        }
      try {
        let response = await authAPI.getPartySecurityQuestions(secuturityId);
        this.securityList = response.securityQuestions;
        //this.firstQuestion.quationsId =
          //this.securityList.length > 0 ? this.securityList[0].questionId : null;
      } catch (error) {
      }
    },

    async saveQuestions() {
      this.loading = true;
      try {
        this.signupData = this.$store.state.signUpData;
        let response = await authAPI.createAccount(this.signupData);
        let securityDetail = {
          partyId: response.partyId,
          questionIdList: [
            this.firstQuestion,
            this.secondQuestion,
            this.thirdQuestion,
          ],
        };
        await authAPI.saveQuestions(securityDetail);
        this.showDialog = true;
      } catch (err) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: err.data.messageDetail,
          color: "error",
        });
      }
    },

    async emailVerification() {
      try {
        await authAPI.emailVerification({
          emailAddress: this.signupData.email,
        });
        this.showDialog = false;
        this.$router.push("/login");
        this.$store.dispatch("STORE_SIGNUP_DATA", {});
      } catch (err) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: err.data.messageDetail,
          color: "error",
        });
      }
    },
  },

  mounted() {
    this.getSecurityList();
    this.getPartySecurityQuestions();
  },
};
</script>

<style scoped>
.login-panel {
  background-image: url(../../assets/images/didpanel.jpg);
  background-attachment: fixed;
  background-size: cover;
}
.login-panel .form-card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 5px 20px;
  width: 500px;
  /* margin-top: 10%; */
}
.header {
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
}
</style>