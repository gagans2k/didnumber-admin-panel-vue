<template>
  <div>
    <v-card elevation="1">
      <v-container fluid>
        <v-row>
          <loading :active="isLoading" :loader="loader" />
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-toolbar elevation="0">
            <v-spacer></v-spacer>
            <v-btn @click="back()" outlined class="error mt-2" dark>BACK</v-btn>
          </v-toolbar>
        </v-row>
        <v-row>
          <v-col xs="12">
            <v-data-table
              :headers="headers"
              :items="smsHttpTrunks"
              :server-items-length="totalSmsHttpTrunks"
              :options.sync="options"
               :footer-props="{
                'items-per-page-options': [10, 20, 30],
              }"
              :items-per-page="10"
            >
              <template v-slot:[`item.indexNo`]="{ item }">
                {{
                  (options.page - 1) * options.itemsPerPage +
                  (smsHttpTrunks.indexOf(item) + 1)
                }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import AllApiCalls from "@/services/AllApiCalls";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  mixins: [AllApiCalls],
  components: {
    Loading,
  },
  data() {
    return {
      moment: moment,
      search: "",
      isLoading: false,
      loader: "bars",
      rowsPerPageItems: [10, 20, 30],
      totalSmsHttpTrunks: 0,
      headers: [
        { text: "#", value: "indexNo", width: "5%" },
        { text: "SMS Time", value: "smsTime", width: "15%", align: "center", sortable: true },
        { text: "Src Addr.", value: "smsSrcAddr", width: "15%", align: "center", sortable: true },
        { text: "DID Number", value: "smsDstAddr", width: "15%", align: "center", sortable: true },
        { text: "SMS Text", value: "smsText", align: "center", sortable: true }
      ],
      smsHttpTrunks: [],
      userDetail: {},
      options: {},
    };
  },
  watch: {
    options: {
      async handler() {
        this.isLoading = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let response = await this.getMethod("getSMSTrunks", {
          viewIndex: page,
          viewSize: itemsPerPage,
          partyId: this.$route.query.partyId,
        });
        this.isLoading = false;
         this.totalSmsHttpTrunks = response.listSize || 0;
          this.smsHttpTrunks = response.smsHttpTrunks || [];
      },
      deep: true,
    },
  },
   mounted() {
    // this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
     back() {
      this.$router.go(-1);
    }
  },
}
</script>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}
</style>
