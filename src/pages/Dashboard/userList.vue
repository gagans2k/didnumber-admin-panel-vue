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
        <div class="loader" v-if="showLoader">
            <v-progress-circular indeterminate color="white"></v-progress-circular>
        </div>
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
                    <template v-slot:[`item.statusId`]="{ item }">
                        <span v-if="item.statusId == 'INV_PROMISED'">Purchased</span>
                        <span v-if="item.statusId == 'INV_AVAILABLE'">Available</span>
                        <span v-if="item.statusId == 'INV_DELIVERED'">Delivered</span>
                        <span v-if="item.statusId == 'INV_SUSPENDED'">Suspended</span>
                        <span v-if="item.statusId == 'INV_DEACTIVATED'">Deactivated</span>
                        <span v-if="item.statusId == 'INV_TERMINATED'">Terminated</span>
                        <span v-if="item.statusId == 'INV_EXPIRED'">Expired</span>
                        <span v-if="item.statusId ==  null"> Pending Allocation</span>
                        <span v-if="item.statusId ==  'INV_DUMMY'">Dummy</span>
                        <span v-if="item.statusId ==  'INV_ALLO_CANCELLED'">Allocation Cancelled</span>
                    </template>
                    <template v-slot:[`item.edit`]="{ item }">
                        <v-btn
                            class="ma-2"
                            outlined
                            color="indigo"
                            @click="getLiveCalls(item)"
                            >
                        LIVE CALL
                        </v-btn>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn
                            class="ma-2"
                            outlined
                            color="indigo"
                            @click="getLiveCalls(item)"
                            >
                        LIVE CALL
                        </v-btn>
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
    export default {
      mixins: [AllApiCalls],
      data() {
        return {
          totalLiveCalls:'',
          dialogLiveCall:false,
          items: [],
          headers: [
            {
              text: "S.No",
              align: "start",
              sortable: false,
              value: "indexNo",
            },
            {
              text: "Country",
              align: "start",
              sortable: false,
              value: "countryName",
            },
            {
              text: "State",
              align: "start",
              sortable: false,
              value: "stateName",
            },
            {
              text: "City	",
              align: "start",
              sortable: false,
              value: "cityName",
            },
            {
              text: "Did Number",
              align: "start",
              sortable: false,
              value: "didNumber",
            },
            {
              text: "Status",
              align: "start",
              sortable: false,
              value: "statusId",
            },
            {
              text: "View Detail",
              align: "start",
              sortable: false,
              value: "firstName",
            },
            { 
                text: "History", 
                value: "viewAction", 
                sortable: false 
            },
          ],
          totalItems: 0,
          loading: false,
          options: {},
        };
      },
       watch: {
        options: {
          async handler() {
            this.loading = true;
            const { sortBy, sortDesc, page, itemsPerPage } = this.options;
            let response = await this.getMethod("getReceivedDidList", {
              viewIndex: page,
              viewSize: itemsPerPage,
            });
            if (response.responseMessage ="success") {
                this.loading = false;
            }
            this.items = response.didNumberList;
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
          this.dialogLiveCall = true;
          let response = await this.getMethod("getLiveCalls", {
            accountId: item.accountId,
            authToken: localStorage.getItem("authNew"),
          });
          if (response.liveCallsList.length > 0) {
            this.totalLiveCalls = response.liveCallsList;
          } else {
            this.totalLiveCalls = response.liveCallsList;
          }
        },
        cancelDialog(){
            this.dialogLiveCall = false;
        }
      },
      async created() {},
    };
</script>