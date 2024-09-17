<template>
  <v-card elevation="1" class="mt-10">
    <v-card-title style="text-transform: capitalize">{{
      type.replace("_", " ").toLowerCase()
    }}</v-card-title>
    <v-data-table
      :headers="headers"
      :items="didList"
      :options.sync="options"
      :server-items-length="totalItem"
    >
      <template v-slot:[`item.indexNo`]="{ item }">
        {{
          (options.page - 1) * options.itemsPerPage +
          (didList.indexOf(item) + 1)
        }}
      </template>
      <template v-slot:[`item.prefix`]="{ item }">
        {{ item.prefix }}
      </template>
      <template v-slot:[`item.name`]="{ item }">
        {{ item.geoName }}
      </template>
      <template v-slot:[`item.endUserRegistration`]="{ item }">
        {{ item.wellKnownText ? "R" : "N.R" }}
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
        ${{ item.perMinCharge }}
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
      <!-- <tbody>
        <tr class="v-data-table__empty-wrapper">
          <td class="" colspan="6">No matching records found</td>
        </tr>
      </tbody> -->
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["didList","getData", "type", "headers", "totalItem", "addToCart","enableDisableStatus"],
  data() {
    return {
      options: {},
    };
  },
  watch: {
    options: {
      handler() {
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
          return 'Voice IN and Voice OUT supported.';
        case 'Y-N':
          return 'Only Voice IN supported.';
        case 'N-Y':
          return 'Only Voice OUT supported.';
        case 'Y-G':
          return 'Voice IN supported | Voice OUT via Global Routes supported.';
        case 'N-G':
          return 'Only Voice OUT via Global Routes supported.';
        case 'G-N':
          return 'Only Voice IN via Global Routes supported.';
        case 'G-Y':
          return 'Voice IN via Global Routes supported | Voice OUT supported.';
        case 'G-G':
          return 'Voice IN and Voice OUT via Global Routes supported.';
        default:
          return 'Voice IN and OUT not supported.';
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
