<template>
  <v-card class="mx-auto mt-0" >
    <!-- <v-toolbar color="#3e6b96" dark>
      <v-toolbar-title>Order Details</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar> -->

    <v-list>
        <!-- Category -->
      <v-list-item class="grey lighten-4">
        <v-list-item-content>
          <v-list-item-title>Category :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.category"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Action -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Action :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.quantity"></v-list-item-title>
        </v-list-item-content>
        <!-- File Name -->
      </v-list-item>
      <v-list-item class="grey lighten-4">
        <v-list-item-content>
          <v-list-item-title>File Name :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.statusId"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Csv -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Csv :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Status -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Status :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Success Count --> 
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Success Count :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Failure Count -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Failure Count :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Total Count -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Total Count :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Created Date -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Created Date :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Start Time -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Start Time :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- End Time -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>End Time :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item-title v-text="taskDetailData.itemTotal"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-col xs="12" sm="2">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'Rate Upload',
          }"
          >Back</v-btn
        >
      </v-col>
    </v-card-actions>
    <loading :active="isLoading" :loader="loader" />
  </v-card>
</template>

<script>
import rateAPI from "@/services/rateAPI.js";
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";

export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },

  data: () => ({
    orderDetails: [],
    getTaskId:'',
    loader: "bars",
    isLoading: false,
    taskDetails:'',
  }),

  mounted() {
    this.getTaskId = this.$route.query.taskId;
    this.getTaskDetailSync();
  },

  methods: {
    async getTaskDetailSync() {
      this.isLoading = true;
      let jsontaskId = {
        taskId: this.getTaskId,
      };
      try {
        let response = await rateAPI.getTaskDetail(jsontaskId);
        this.isLoading = false;
        if (response.responseMessage == 'success') {
            this.taskDetails = response.taskDetail.data._read_only;
            this.isLoading = false;
        }
        //this.orderDetails = response.orderDetails.orderItemList;
      } catch (err) {
        this.isLoading = false;
      }
    },
  },
};
</script>