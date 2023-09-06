<template>
  <div>
    <v-dialog v-model="showConfirmDialog" max-width="400px" persistent>
      <v-card flat class="Card-style pa-2">
        <v-container fluid>
          <v-layout justify-center>
            <v-flex xs12 sm12>
              <v-flex xs12>
                <p><b>Are you sure you want to change the password?</b></p>
              </v-flex>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showConfirmDialog = false" depressed>No</v-btn>
                <v-btn @click="changePassword" depressed> Yes </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showErrorDialog" max-width="400px" persistent>
      <v-card flat class="Card-style pa-2">
        <v-container fluid>
          <v-layout justify-center>
            <v-flex xs12 sm12>
              <v-flex xs12>
                <p>
                  <b>{{ errorPasswordMessage }}</b>
                </p>
              </v-flex>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showErrorDialog = false" depressed>OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <v-container fluid>
      <v-card flat class="px-md-4">
        <h3 class="font-weight-light">Password :</h3>
        <v-form v-model="isFormValid">
          <!-- current password -->
          <v-text-field
            outlined
            
            v-model="securityData.currentPassword"
            :rules="currentPasswordRule"
            :append-icon-cb="() => (e1 = !e1)"
            :type="e1 ? 'password' : 'text'"
            label="Current Password"
            append-icon="remove_red_eye"
          ></v-text-field>
          <!-- new password  -->
          <v-text-field
            outlined
            
            :rules="newPasswordRule"
            v-model="securityData.newPassword"
            :append-icon-cb="() => (e1 = !e1)"
            :type="e1 ? 'password' : 'text'"
            label="Password"
            required
            append-icon="remove_red_eye"
          ></v-text-field>
          <!-- confirm password -->
          <v-text-field
            outlined
            
            v-model="securityData.newPasswordVerify"
            :rules="confirmPasswordRule"
            :append-icon-cb="() => (e1 = !e1)"
            :type="e1 ? 'password' : 'text'"
            label="Confirm Password"
            required
            append-icon="remove_red_eye"
          ></v-text-field>
          <div class="update-button">
            <v-btn
              :disabled="!isFormValid"
              style="align-item: center"
              @click="showConfirmDialog = true"
              outlined
              rounded
              class="primary-btn"
            >
              Update Password
            </v-btn>
          </div>
        </v-form>
        <h3 class="font-weight-light">Security Questions :</h3>
        <v-form>
          <v-row v-for="(item, i) in userSecurityList" :key="item.questionId">
            <v-col cols="12" sm="4" md="5">
              <v-select
                outlined
                
                :items="securityList"
                v-model.trim="questions[i].questionId"
                item-text="description"
                item-value="questionId"
                label="Questions"
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="4" md="5">
              <!-- <v-text-field
              :items="userSecurityList"
              v-model.trim="questions[i].answer"
              item-text="answer"
              item-value="answer"
              label="Answer 1"
              append-icon="remove_red_eye"
            ></v-text-field> -->
              <v-text-field
                outlined
                
                v-if="Object.keys(questions).length > 0"
                :items="userSecurityList"
                v-model.trim="questions[i].answer"
                item-text="answer"
                item-value="answer"
                label="Answer 1"
                :append-icon="
                  questions[i].showPassword ? 'mdi-eye' : 'mdi-eye-off'
                "
                :type="questions[i].showPassword ? 'text' : 'password'"
                @click:append="
                  questions[i].showPassword = !questions[i].showPassword;
                  $forceUpdate();
                "
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="2">
              <v-btn
                outlined
                rounded
                class="primary-btn mt-2"
                large
                block
                @click="updateQuestions(questions[i])"
              >
                Update
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import profileAPI from "@/services/profileAPI.js";
import authAPI from "@/services/authAPI.js";

export default {
  data() {
    return {
      valid: false,
      e1: true,
      securityData: {},
      currentPasswordRule: [(v) => !!v || "This field is required"],
      newPasswordRule: [
        (v) => !!v || "Password is required",
        (v) =>
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) ||
          "Password must contain at least lowercase letter, one number, a special character and one uppercase letter and min length should be 8",
      ],
      confirmPasswordRule: [
        (v) => !!v || "Confirm password is required",
        (v) => v === this.securityData.newPassword || "Passwords do not match",
      ],

      isFormValid: false,
      userSecurityList: [],
      securityList: [],
      questions: {},

      showConfirmDialog: false,
      showErrorDialog: false,
      errorPasswordMessage: "",
    };
  },

  methods: {
    async changePassword() {
      let securityPasswordData = {
        userId: this.userDetail.userId,
        accountId: this.userDetail.accountId,
        partyId: this.userDetail.partyId,
        currentPassword: this.securityData.currentPassword,
        newPasswordVerify: this.securityData.newPasswordVerify,
        newPassword: this.securityData.newPassword,
      };
      try {
        let response = await profileAPI.changePassword(securityPasswordData);
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Password change successfully",
          color: "success",
        });
        if (response.responseMessage == "success") {
          this.showConfirmDialog = true;
          localStorage.clear();
          this.$router.push("/login");
          //window.location.reload();
        }
        this.loading = false;
      } catch (err) {
        this.errorPasswordMessage = err.data.messageDetail;
        this.showConfirmDialog = false;
        this.showErrorDialog = true;
        this.securityData = {};
        // this.$root.$emit("SHOW_SNACKBAR", {
        //   text: err.data.messageDetail,
        //   color: "error",
        // });
      }
    },

    async getSecurityList() {
      try {
        let response = await authAPI.getSecurityList();
        this.securityList = response.securityQuestions;
      } catch (error) {
      }
    },

    async getUserSecurityList() {
      let securityDetail = {
        partyId: this.userDetail.partyId,
      };
      try {
        let response = await profileAPI.getUserSecurityList(securityDetail);
        this.userSecurityList = response.securityQuestions;

        this.userSecurityList.length = 3;

        for (let [i, item] of this.userSecurityList.entries()) {
          this.questions[i] = item;
          this.questions[i].oldQuestionId = item.questionId;
          this.questions[i].showPassword = false;
        }
      } catch (error) {
      }
    },

    async updateQuestions(item) {
      this.loading = true;
      let securityQuestionDetail = {
        partyId: this.userDetail.partyId,
        newQuestionId: item.questionId,
        oldQuestionId: item.oldQuestionId,
        newAnswer: item.answer,
      };
      try {
        let response = await profileAPI.updateSecurityQuestions(
          securityQuestionDetail
        );
        this.getUserSecurityList();
        this.$root.$emit("SHOW_SNACKBAR", {
          text: "Security answer updated",
          color: "success",
        });
      } catch (err) {
        this.$root.$emit("SHOW_SNACKBAR", {
          text: err.data.messageDetail,
          color: "error",
        });
      }
    },
  },

  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getSecurityList();
    this.getUserSecurityList();
  },
};
</script>

<style scoped>
.update-button {
  padding-left: 40%;
  padding-top: inherit;
}
</style>