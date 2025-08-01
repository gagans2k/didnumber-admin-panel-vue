<template>
  <div>
    <v-tabs>
      <v-tab @click="getSubscriptionNew()">
        <v-icon left> language </v-icon>
        All
        <v-avatar color="green white--text" size="20" class="ml-2 pa-3">
          {{ didStatusListSize.DID_ACTIVATED }}
        </v-avatar>
      </v-tab>
      <v-tab @click="getCustomSubscriptionNew('DID_ACTIVATED')">
        <v-icon left> person </v-icon> Active
        <v-avatar color="green white--text" size="20" class="ml-2 pa-3">
          {{ didStatusListSize.DID_ACTIVATED }}
        </v-avatar>
      </v-tab>
      <v-tab @click="getCustomSubscriptionNew('DID_EXPIRING_SOON')">
        <v-icon left> error </v-icon> EXPIRING SOON
        <v-avatar
          color="yellow darken-2 white--text"
          size="20"
          class="ml-2 pa-3"
        >
          {{ didStatusListSize.DID_EXPIRING_SOON }}
        </v-avatar>
      </v-tab>
      <v-tab @click="getCustomSubscriptionNew('DID_INACTIVE')">
        <v-icon left> schedule </v-icon> AWAITING REGISTRATION
        <v-avatar
          color="yellow darken-2 white--text"
          size="20"
          class="ml-2 pa-3"
        >
          {{ didStatusListSize.DID_INACTIVE }}
        </v-avatar>
      </v-tab>
      <v-tab @click="getCustomSubscriptionNew('DID_SUSPENDED')">
        <v-icon left> privacy_tip </v-icon> SUSPENDED
        <v-avatar
          color="error lighten-1 white--text"
          size="20"
          class="ml-2 pa-3"
        >
          {{ didStatusListSize.DID_SUSPENDED }}
        </v-avatar>
      </v-tab>
      <v-tab-item>
        <numberSubscriptionDataTable :status="status" />
      </v-tab-item>
      <v-tab-item>
        <numberSubscriptionDataTable :status="status" />
      </v-tab-item>
      <v-tab-item>
        <numberSubscriptionDataTable :status="status" />
      </v-tab-item>
      <v-tab-item>
        <numberSubscriptionDataTable :status="status" />
      </v-tab-item>
      <v-tab-item>
        <numberSubscriptionDataTable :status="status" />
      </v-tab-item>
    </v-tabs>
    <loading :active="isLoading" :loader="loader" />
  </div>
</template>


<script>
import numberManagerAPI from "@/services/numberManagerAPI.js";
import numberSubscriptionDataTable from "./numberSubscriptionDataTable.vue";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "@/assets/vue-loading.css";

export default {
  name: "numberManage",
  components: {
    Loading,
    numberSubscriptionDataTable,
  },
  data() {
    return {
      isLoading: false,
      loader: "bars",
      moment: moment,
      userDetail: {},
      didStatusListSize: {},
      status: "",
      didStatusList: [
        "DID_TERMINATED",
        "DID_ACTIVATED",
        "DID_INACTIVE",
        "DID_SUSPENDED",
        "DID_EXPIRING_SOON",
      ],
    };
  },
  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getNumberManagerListSize();
  },

  methods: {
    async getNumberManagerListSize() {
      try {
        let response = await numberManagerAPI.getNumberManagerListSize({
          partyId: this.userDetail.partyId,
          didStatusList: this.didStatusList,
        });
        var didStatusList = [];
        didStatusList = response.didStatusListSize;
        this.didStatusListSize = didStatusList.reduce(
          (a, b) => Object.assign(a, b),
          {}
        );
      } catch (error) {
      }
    },
    getCustomSubscriptionNew(status) {
      this.status = status;
    },
  },
};
</script>