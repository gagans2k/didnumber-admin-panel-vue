<template>
  <v-container fluid>
    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      >{{ snackbarMessage }}</v-snackbar
    >
    <!-- LOADER -->
    <!-- <div class="loader" v-if="showLoader">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
    </div> -->
    <v-row>
      <loading :active="isLoading" :loader="loader" />
    </v-row>
    <!-- QUESTION LIST ONE -->
    <v-form ref="form1">
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            v-model="questionOne"
            :items="questionList"
            label="Questions"
            item-text="description"
            item-value="questionId"
            outlined
            dense
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="answerOne"
            label="Answer 1"
             outlined
            dense
            :append-icon="answerOneVisibility ? 'visibility_off' : 'visibility'"
            @click:append="() => (answerOneVisibility = !answerOneVisibility)"
            :type="answerOneVisibility ? 'password' : 'text'"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            block
            color="primary"
            @click="updateSecurityQuestions('questionOne')"
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <!-- QUESTION LIST TWO -->
    <v-form ref="form2">
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            v-model="questionTwo"
            :items="questionList"
            label="Questions"
            item-text="description"
            item-value="questionId"
             outlined
            dense
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="answerTwo"
            label="Answer 2"
             outlined
            dense
            :append-icon="answerTwoVisibility ? 'visibility_off' : 'visibility'"
            @click:append="() => (answerTwoVisibility = !answerTwoVisibility)"
            :type="answerTwoVisibility ? 'password' : 'text'"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            block
            color="primary"
            @click="updateSecurityQuestions('questionTwo')"
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <!-- QUESTION LIST THREE -->
    <v-form ref="form3">
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            v-model="questionThree"
            :items="questionList"
            label="Questions"
            item-text="description"
             outlined
            dense
            item-value="questionId"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-text-field
            :rules="cantBeEmpty"
            v-model="answerThree"
            label="Answer 3"
             outlined
            dense
            :append-icon="
              answerThreeVisibility ? 'visibility_off' : 'visibility'
            "
            @click:append="
              () => (answerThreeVisibility = !answerThreeVisibility)
            "
            :type="answerThreeVisibility ? 'password' : 'text'"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            block
            color="primary"
            @click="updateSecurityQuestions('questionThree')"
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      answerOneVisibility: true,
      answerTwoVisibility: true,
      answerThreeVisibility: true,
      oldQuestionOne: "",
      oldQuestionTwo: "",
      oldQuestionThree: "",
      questionOne: "",
      questionList: [],
      answerOne: "",
      questionTwo: "",
      answerTwo: "",
      questionThree: "",
      answerThree: "",
    };
  },
  methods: {
    async getUserSecurityQuestions() {
      this.isLoading = true;
      let response = await this.getMethod("getUserSecurityQuestions", {
        partyId: this.$route.query.partyId,
      });
      /* SET PRESELECTECTED QUESTIONS */
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
      this.questionOne = this.oldQuestionOne =
        response.securityQuestions[0].questionId;
      this.questionTwo = this.oldQuestionTwo =
        response.securityQuestions[1].questionId;
      this.questionThree = this.oldQuestionThree =
        response.securityQuestions[2].questionId;
      /* SET PRESELECTED ANSWERS */
      this.answerOne = response.securityQuestions[0].answer;
      this.answerTwo = response.securityQuestions[1].answer;
      this.answerThree = response.securityQuestions[2].answer;
    },

    async getSecurityQuestions() {
       this.isLoading = true;
      let response = await this.getMethod("getSecurityQuestions");
      /* POPULATE SECURITY QUESTIONS LIST */
      if (response.responseMessage == "success") {
        this.isLoading = false;
      }
      this.questionList = response.securityQuestions;
    },

    async updateSecurityQuestions(message) {
      this.isLoading = true;
      if (message == "questionOne") {
        if (this.$refs.form1.validate()) {
          let response = await this.putMethod("updateSecurityQuestions", {
            partyId: this.$route.query.partyId,
            newQuestionId: this.questionOne,
            oldQuestionId: this.oldQuestionOne,
            newAnswer: this.answerOne,
          });
          if (response.responseMessage == "success") {
            this.isLoading = false;
          }
          this.getUserSecurityQuestions()
          this.seeSnackbar("Successfully updated","success")
        }else{
            this.seeSnackbar("Fill in the highlighted field","warning")
            this.isLoading = false;
        }
      }
      if (message == "questionTwo") {
        if (this.$refs.form2.validate()) {
          let response = await this.putMethod("updateSecurityQuestions", {
            partyId: this.$route.query.partyId,
            newQuestionId: this.questionTwo,
            oldQuestionId: this.oldQuestionTwo,
            newAnswer: this.answerTwo,
          });
          if (response.responseMessage == "success") {
            this.isLoading = false;
          }
          this.getUserSecurityQuestions()
          this.seeSnackbar("Successfully updated","success")
        }else{
            this.seeSnackbar("Fill in the highlighted field","warning")
            this.isLoading = false;
        }
      }
      if (message == "questionThree") {
        if (this.$refs.form3.validate()) {
          let response = await this.putMethod("updateSecurityQuestions", {
            partyId: this.$route.query.partyId,
            newQuestionId: this.questionThree,
            oldQuestionId: this.oldQuestionThree,
            newAnswer: this.answerThree,
          });
          if (response.responseMessage == "success") {
            this.isLoading = false;
          }
          this.getUserSecurityQuestions()
          this.seeSnackbar("Successfully updated","success")
        }else{
            this.seeSnackbar("Fill in the highlighted field","warning")
            this.isLoading = false;
        }
      }
    },
  },
  async created() {
    await this.getUserSecurityQuestions();
    await this.getSecurityQuestions();
  },
};
</script>