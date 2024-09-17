<template>
  <v-card elevation="1" class="mt-5">
    <v-card-title>{{
      type.replace("_", " ").toLowerCase()
    }}</v-card-title>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="tollFreeDIDList"
      :options.sync="options"
      :server-items-length="totalItem"
    >
      <template v-slot:[`item.indexNo`]="{ item }">
        {{
          (options.page - 1) * options.itemsPerPage +
          (tollFreeDIDList.indexOf(item) + 1)
        }}
      </template>
      <template v-slot:[`item.prefix`]="{ item }">
        {{ item.prefix }}
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <span v-if="item.didType == 'LOCAL_DID'">LOCAL</span>
        <span v-if="item.didType == 'NATIONAL_DID'">NATIONAL</span>
        <span v-if="item.didType == 'MOBILE_DID'">MOBILE</span>
        <span v-if="item.didType == 'VIRTUAL_PRI_DID'">VIRTUAL PRI</span>
        <span v-if="item.didType == 'TOLL_FREE'">TOLL FREE</span>
        <span v-if="item.didType == 'SHARED_COST'">SHARED COST</span>
      </template>
      <template v-slot:[`item.endUserRegistration`]="{ item }">
        {{
          item.requireDocument == "Y"
            ? "R"
            : item.wellKnownText
            ? "R"
            : "N.R"
        }}
        <v-tooltip top v-if="item.wellKnownText" max-width="400">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="black"> info </v-icon>
            </v-btn>
          </template>
          <span v-html="item.wellKnownText"></span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.voiceIn`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <!-- Dynamic class to handle conditions -->
            <v-avatar :style="getAvatarStyle(item)" size="20" v-bind="attrs" v-on="on"></v-avatar>
          </template>
          <span>{{ getTooltipText(item) }}</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.t38Fax`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-if="item.t38Fax === 'Y'" v-bind="attrs" v-on="on">
              <v-avatar color="success" size="20"></v-avatar>
            </span>
            <span v-else v-bind="attrs" v-on="on">
              <v-avatar color="grey" size="20"></v-avatar>
            </span>
          </template>
          <span v-if="item.t38Fax === 'Y'">T.38/Fax support</span>
          <span v-else>T.38/Fax not supported</span>
        </v-tooltip>
      </template> 
      <template v-slot:[`item.smsIn`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-if="item.smsIn === 'Y'" v-bind="attrs" v-on="on">
              <v-avatar color="success" size="20"></v-avatar>
            </span>
            <span v-else v-bind="attrs" v-on="on">
              <v-avatar color="grey" size="20"></v-avatar>
            </span>
          </template>
          <span v-if="item.smsIn === 'Y'">SMS In support</span>
          <span v-else>SMS IN not supported</span>
        </v-tooltip>
      </template>  
      <template v-slot:[`item.smsOutP2P`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <!-- Dynamic class to handle conditions -->
            <v-avatar :style="getAvatarStyleForSMS(item)" size="20" v-bind="attrs" v-on="on"></v-avatar>
          </template>
          <span>{{ getTooltipTextForSMS(item) }}</span>
        </v-tooltip>
      </template>  
      <template v-slot:[`item.emergency`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-if="item.emergency === 'Y'" v-bind="attrs" v-on="on">
              <v-avatar color="success" size="20"></v-avatar>
            </span>
            <span v-else v-bind="attrs" v-on="on">
              <v-avatar color="grey" size="20"></v-avatar>
            </span>
          </template>
          <span v-if="item.emergency === 'Y'">Emergency In support</span>
          <span v-else>Emergency not supported</span>
        </v-tooltip>
      </template>  
      <template v-slot:[`item.cnamOut`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-if="item.cnamOut === 'Y'" v-bind="attrs" v-on="on">
              <v-avatar color="success" size="20"></v-avatar>
            </span>
            <span v-else v-bind="attrs" v-on="on">
              <v-avatar color="grey" size="20"></v-avatar>
            </span>
          </template>
          <span v-if="item.cnamOut === 'Y'">CNAM OUT In support</span>
          <span v-else>CNAM OUT not supported</span>
        </v-tooltip>
      </template>                    
      <template v-slot:[`item.perMinCharge`]="{ item }">
        ${{ item.perMinChargeFixed }}
        <v-tooltip top class="px-0 mx-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="black"> info </v-icon>
            </v-btn>
          </template>
          <table id="myTable" class="white black--text">
            <tr>
              <th>Source</th>
              <th>Cost</th>
            </tr>
            <tr>
              <td>Fixed</td>
              <td>$ {{ item.perMinChargeFixed }}</td>
            </tr>
            <tr>
              <td>Mobile</td>
              <td>$ {{ item.perMinChargeMobile }}</td>
            </tr>
            <tr>
              <td>Payphone</td>
              <td>$ {{ item.perMinChargePayphone }}</td>
            </tr>
          </table>
        </v-tooltip>
      </template>
      <template v-slot:[`item.setupCost`]="{ item }">
        ${{ item.setupCost }}
      </template>
      <template v-slot:[`item.price`]="{ item }"> ${{ item.price }} </template>
      <template v-slot:[`item.enable`]="{ item }">
        <v-switch
          v-if="item.enable == 'Y'"
          :input-value="true"
          color="primary"
          @click="enableDisableStatus('disabled', item)" 
          :readonly="false"
        ></v-switch>
        <v-switch
          v-else
          :input-value="false"
          @click="enableDisableStatus('enabled', item)"
          :readonly="false"
        ></v-switch>
      </template>
      <template v-slot:[`item.createdStamp`]="{ item }"> {{ item.createdStamp }} </template>
      <template v-slot:[`item.lastUpdatedStamp`]="{ item }"> {{ item.lastUpdatedStamp }} </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["tollFreeDIDList", "getData", "type", "headers", "totalItem", "addToCart", "enableDisableStatus"],
  data() {
    return {
      options: {},
    };
  },
  watch: {
    options: {
      handler() {
        // this.tollFreeDIDList.forEach((result) => {
        //   if (result.didType == result.didType) {
        //     this.dataName = result.didType;
        //   }
        //   switch (result.didType == result.didType) {
        //     case result.didType == "LOCAL_DID":
        //       this.titleName = "LOCAL";
        //       break;
        //     case result.didType == "NATIONAL_DID":
        //       this.titleName = "NATIONAL";
        //       break;
        //     case result.didType == "MOBILE_DID":
        //       this.titleName = "MOBILE";
        //       break;
        //     case result.didType == "VIRTUAL_PRI":
        //       this.titleName = "VIRTUAL PRI DID";
        //       break;
        //     case result.didType == "TOLL_FREE":
        //       this.titleName = "TOLL FREE";
        //       break;
        //     case result.didType == "SHARED_COST":
        //       this.titleName = "SHARED COST";
        //       break;
        //   }
        // });
        // this.getData(this.dataName, this.options);
        //this.getData("TOLL_FREE", this.options);
        //console.log("this.dataName",this.dataName,this.options)
        this.getData(this.type, this.options, this.totalItem);
      },
      deep: true,
    },
  },
  methods: {
    getAvatarStyle(item) {
      let background;

      // Combine voiceIn and voiceOut into a single key
      const key = `${item.voiceIn}-${item.voiceOut}`;

      switch (key) {
        case 'Y-Y':
          // Full green
          background = 'linear-gradient(90deg, green 100%, green 100%)';
          break;
        case 'Y-N':
          // Half green, half grey
          background = 'linear-gradient(90deg, green 50%, grey 50%)';
          break;
        case 'N-Y':
          // Half grey, half green
          background = 'linear-gradient(90deg, grey 50%, green 50%)';
          break;
        case 'Y-G':
          // Half green, half blue
          background = 'linear-gradient(90deg, green 50%, blue 50%)';
          break;
        case 'N-G':
          // Half grey, half blue
          background = 'linear-gradient(90deg, grey 50%, blue 50%)';
          break;
        case 'G-N':
          // Half blue, half grey
          background = 'linear-gradient(90deg, blue 50%, grey 50%)';
          break;
        case 'G-Y':
          // Half blue, half green
          background = 'linear-gradient(90deg, blue 50%, green 50%)';
          break;
        case 'G-G':
          // Full blue
          background = 'linear-gradient(90deg, blue 100%, blue 100%)';
          break;
        default:
          // Full grey (default case)
          background = 'linear-gradient(90deg, grey 100%, grey 100%)';
      }

      return {
        background,
      };
    },
    getTooltipText(item) {
      const key = `${item.voiceIn}-${item.voiceOut}`;

      switch (key) {
        case 'Y-Y':
          return 'Voice In and Voice Out supported.';
        case 'Y-N':
          return 'Only Voice In supported.';
        case 'N-Y':
          return 'Only Voice Out supported.';
        case 'Y-G':
          return 'Voice In supported | Voice Out via Global Routes supported.';
        case 'N-G':
          return 'Only Voice Out via Global Routes supported.';
        case 'G-N':
          return 'Only Voice In via Global Routes supported.';
        case 'G-Y':
          return 'Voice In via Global Routes supported | Voice Out supported.';
        case 'G-G':
          return 'Voice In and Voice Out via Global Routes supported.';
        default:
          return 'Voice In and Out not supported.';
      }
    },
    getTooltipTextForSMS(item) {
      const key = `${item.smsOutP2P}-${item.smsOutA2P}`;

      switch (key) {
        case 'Y-Y':
          return 'SMS OUT P2P and SMS OUT A2P supported.';
        case 'Y-N':
          return 'Only SMS OUT P2P supported.';
        case 'N-Y':
          return 'Only SMS OUT A2P supported.';
        default:
          return 'SMS OUT P2P and A2P not supported.';
      }
    },
    getAvatarStyleForSMS(item) {
      let background;

      // Combine smsOutP2P and smsOutA2P into a single key
      const key = `${item.smsOutP2P}-${item.smsOutA2P}`;

      switch (key) {
        case 'Y-Y':
          // Full green
          background = 'linear-gradient(90deg, green 100%, green 100%)';
          break;
        case 'Y-N':
          // Half green, half grey
          background = 'linear-gradient(90deg, green 50%, grey 50%)';
          break;
        case 'N-Y':
          // Half grey, half green
          background = 'linear-gradient(90deg, grey 50%, green 50%)';
          break;
        default:
          // Full grey (default case)
          background = 'linear-gradient(90deg, grey 100%, grey 100%)';
      }

      return {
        background,
      };
    },  
  },
};
</script>

<style scoped>
#myTable {
  border: 1px solid black;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
}
#myTable td {
  border: 1px solid black;
  padding: 5px;
}
</style>
