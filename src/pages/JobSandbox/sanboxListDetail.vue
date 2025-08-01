<template>
    <v-card>
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


    <!-- <v-container fluid> -->
    <!-- SEARCH -->
    <v-row>
      <v-col xs="12" sm="6" md="4">
        <v-autocomplete 
          v-model="jobStatus"
          :items="serviceStatusList"
          label="Search By Job Status"
          item-text="key"
          item-value="value"
          outlined
          dense
          @change="searchOnServer(jobStatus)"
        ></v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col xs="12" sm="2" md="1" class="mt-3">
        <v-btn
          dark
          block
          color="rgb(231,87,83)"
          :to="{
            name: 'Dashboard',
          }"
          >Back</v-btn
        >
      </v-col>
    </v-row>
    <!-- DATA TABLE-->
    <v-row>
      <v-col xs="12">
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          :footer-props="{
            'items-per-page-options': [10, 20, 30]
          }"
          :loading="loading"
          class="elevation-1"
        >
          <!-- INDEX NO -->
          <template v-slot:[`item.indexNo`]="{ item }">
            <span>{{ (options.page * 10) - (10 - (items.indexOf(item) + 1) ) }}</span>
          </template>

          <!-- startDateTime -->
          <template v-slot:[`item.startDateTime`]="{ item }">
            {{ item.startDateTime ? moment(item.startDateTime).format("MMMM DD, YYYY, HH:mm") : '......................' }}
          </template>

          <!-- finishDateTime -->
           <template v-slot:[`item.finishDateTime`]="{ item }">
            {{ item.finishDateTime ? moment(item.finishDateTime).format("MMMM DD, YYYY, HH:mm") : '......................' }}
          </template>
         

          <!-- run Time -->
          <template v-slot:[`item.runTime`]="{ item }">
            {{ item.runTime ? moment(item.runTime).format("MMMM DD, YYYY, HH:mm") : '......................' }}
          </template>     
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  </v-card>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";
import moment from "moment";

export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      moment: moment,
      items: [],
      headers: [
        { text: "S.No",value: "indexNo",sortable: false},
        { text: "Job ID",value: "jobId",sortable: false},
        // { text: "Job Name", value: "jobName",sortable: false},
        { text: "Service Name", value: "serviceName",sortable: false},
        { text: "Status", value: "statusId",sortable: false},
        { text: "Start Date Time", value: "startDateTime", sortable: false},
        { text: "Finish Date Time", value: "finishDateTime",sortable: false},
        { text: "Run Time", value: "runTime",sortable: false},
        { text: "Job Result", value: "jobResult",sortable: false},
      ],
      totalItems: 0,
      //loading: false,
      options: {},
      jobStatus: "",
      serviceStatusList: [
        { key: "Failed", value: "SERVICE_FAILED" },
        { key: "Finished", value: "SERVICE_FINISHED" },
        { key: "Pending", value: "SERVICE_PENDING" },
        { key: "Running", value: "SERVICE_RUNNING" },
        { key: "All", value: "SERVICE_ALL" },
      ],
      userDocumentInfo: {},
      viewUserDocumentList: false,
    };
  },

  // mounted(){
  //   this.getMethod();
  // },

  watch: {
     dialogEdit(val) {
      val || this.closeEdit();
    },
    options: {
      async handler() {
        this.isLoading = true;
        let statusId = ''; // Declare and initialize the variable correctly

        if (this.jobStatus !== 'SERVICE_ALL') { 
          statusId = this.jobStatus; // Assign `this.jobStatus` if not 'SERVICE_ALL'
        }
        //this.loader = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getJobServices", {
          viewIndex: page,
          viewSize: itemsPerPage,
          statusId: statusId,
        });
        this.items = response.sandboxServices;
        this.totalItems = response.listSize;
        this.isLoading = false;
       // this.searchOnServer();
      },
      deep: true,
    },
  },

  methods: {
    async searchOnServer(jobStatus) {
      console.log("===========jobStatus============="+jobStatus);
      if (jobStatus == 'SERVICE_ALL') {
          return new Promise(async (resolve, reject) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;
          let response = await this.getMethod("getJobServices", {
            viewIndex: page,
            viewSize: itemsPerPage,
          });
          this.items = response.sandboxServices;
          this.totalItems = response.listSize;
          setTimeout(() => {
            this.isLoading = false;
            resolve({
              // items,
              //total,
            });
          }, 0);
        });
      }else{
        this.isLoading = true;
        return new Promise(async (resolve, reject) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;
          let response = await this.getMethod("getJobServices", {
            statusId: jobStatus,
            viewIndex: page,
            viewSize: itemsPerPage,
          });
          this.items = response.sandboxServices;
          this.totalItems = response.listSize;
          setTimeout(() => {
            this.isLoading = false;
            resolve({
              // items,
              //total,
            });
          }, 0);
        });
      }
      
    },
    
    closeUserModal() {
      this.viewUserDocumentList = false;
    },

  },
};
</script>
<style scoped>
table.v-table tbody td {
  font-size: 10px !important;
}
</style>