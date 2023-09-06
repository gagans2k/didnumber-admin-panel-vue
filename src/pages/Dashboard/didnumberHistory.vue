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
        <v-row>
          <loading :active="isLoading" :loader="loader" />
        </v-row>
        <!-- SEARCH -->
        <!-- <v-row>
            <v-col xs="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                outlined
                dense
                hide-details
                v-on:keyup.enter="searchOnServer()"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col xs="12" sm="2">
              <v-btn
                dark
                block
                color="rgb(231,87,83)"
                :to="{
                  name: 'AccountDetails',
                  query: $route.query,
                }"
                >Back</v-btn
              >
            </v-col>
            </v-row> -->
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
                        <span>{{ items.indexOf(item) + 1 }}</span>
                    </template>
                    <!-- EDIT DELETE BUTTONS -->
                    <template v-slot:[`item.didStatus`]="{ item }">
                        <span v-if="item.didStatus == 'DID_ACTIVATED'">ACTIVATED</span>
                        <span v-if="item.didStatus == 'DID_INACTIVE'">INACTIVE</span>
                        <span v-if="item.didStatus == 'DID_PENDING'">PENDING</span>
                        <span v-if="item.didStatus == 'DID_SUSPENDED'">SUSPENDED</span>
                        <span v-if="item.didStatus == 'DID_TERMINATED'">TERMINATED</span>
                    </template>
                    <template v-slot:[`item.firstName`]="{ item }">
                        {{item.firstName}} {{item.lastName}}
                    </template>
                    <template v-slot:[`item.creationDate`]="{ item }">
                        {{ (item.creationDate).slice(0,10) }}
                    </template>
                    <template v-slot:[`item.lastRenewalDate`]="{ item }">
                        {{ new Date(item.lastRenewalDate).toLocaleDateString() }}
                    </template>
                    <template v-slot:[`item.nextRenewalDate`]="{ item }">
                        {{ new Date(item.nextRenewalDate).toLocaleDateString() }}
                    </template>
                    <!-- DIALOG BOX -DELETE ITEM -->
                    <template v-slot:[`item.viewAction`]="{ item }">
                      <v-icon @click="viewOrder(item)" color="info">visibility</v-icon>
                    </template>
            </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import AllApiCalls from "@/services/AllApiCalls";
    import Loading from "vue-loading-overlay";
    import "vue-loading-overlay/dist/vue-loading.css";
    export default {
      mixins: [AllApiCalls],
      components: {
        Loading,
      },
      data() {
        return {
          totalLiveCalls:'',
          dialogLiveCall:false,
          isLoading: false,
          loader: "bars",
          items: [],
          headers: [
            {
              text: "S.No",
              align: "start",
              sortable: false,
              value: "indexNo",
            },
            {
              text: "User Name",
              align: "start",
              sortable: false,
              value: "firstName",
            },
            {
              text: "Phone Number",
              align: "start",
              sortable: false,
              value: "serialNumber",
            },
            {
              text: "Status",
              align: "start",
              sortable: false,
              value: "didStatus",
            },
            {
              text: "Creation Date",
              align: "start",
              sortable: false,
              value: "creationDate",
            },
            {
              text: "Last Renewal Date",
              align: "start",
              sortable: false,
              value: "lastRenewalDate",
            },
            {
              text: "Next Renewal Date",
              align: "start",
              sortable: false,
              value: "nextRenewalDate",
            },
          ],
          totalItems: 0,
          options: {},
        };
      },
       watch: {
        options: {
          async handler() {
            this.isLoading = true;
            const { sortBy, sortDesc, page, itemsPerPage } = this.options;
            let response = await this.getMethod("didNumberHistory", {
              serialNumber: this.$route.query.serialNumber,
              viewIndex: page,
              viewSize: itemsPerPage,
            });
            if (response.responseMessage ="success") {
                this.isLoading = false;
            }
            this.items = response.didNumberUsers;
            this.totalItems = response.listSize;
            this.isLoading = false;
          },
          deep: true,
        },
        dialogLiveCall(val) {
          val || this.cancelDialog();
        },
      },
      methods: {
        async getLiveCalls(item) {
        //   this.dialogLiveCall = true;
        //   let response = await this.getMethod("getLiveCalls", {
        //     accountId: item.accountId,
        //     authToken: localStorage.getItem("authNew"),
        //   });
        //   if (response.liveCallsList.length > 0) {
        //     this.totalLiveCalls = response.liveCallsList;
        //   } else {
        //     this.totalLiveCalls = response.liveCallsList;
        //   }
        },
        cancelDialog(){
            this.dialogLiveCall = false;
        }
      },
      async created() {
      },
    };
</script>