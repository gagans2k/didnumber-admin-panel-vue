<template>
  <v-app-bar app color="#fff" class="elevation-0">
    <v-app-bar-nav-icon
      @click="toggleDrawer()"
      class="d-lg-none"
      src="https://picsum.photos/1920/1080?random"
    ></v-app-bar-nav-icon>
    <h3 class="font-weight-medium">{{ $route.name }}</h3>
    <v-spacer></v-spacer>
    <!-- <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          color="error"
          :content="String(noOfCartItem)"
          :value="String(noOfCartItem)"
          overlap
          class="style-btn"
        >
          <v-icon v-bind="attrs" v-on="on" @click="toShoppingCart"
            >shopping_cart</v-icon
          >
        </v-badge>
      </template>
      <span>Shopping cart</span>
    </v-tooltip> -->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-avatar v-bind="attrs" v-on="on">
          <img
            v-if="checkImg"
            :src="userData.profileImageData"
            alt="user"
            width="50"
          />
          <img v-else :src="dummyImg" alt="dummyuser" width="50" />
        </v-list-item-avatar>
      </template>
      <v-card width="130">
        <!-- <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img
                v-if="checkImg"
                :src="userData.profileImageData"
                alt="user"
                width="50"
              />
              <img v-else :src="dummyImg" alt="dummyuser" width="50" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ userData.name }}
              </v-list-item-title>
              <v-list-item-subtitle>Admin of DID Panel</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list> -->
        <!-- <v-divider></v-divider> -->
        <!-- <v-list class="pt-2 pb-4">
          <v-list-item>
            <v-list-item-action class="mr-2">
              <v-icon color="primary">mail</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ userData.email }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action class="mr-2">
              <v-icon color="info">monetization_on </v-icon>
            </v-list-item-action>
            <v-list-item-title>${{ credit }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-action class="mr-2">
              <v-icon color="green">call </v-icon>
            </v-list-item-action>
            <v-list-item-title> {{ noOfDID }} DID </v-list-item-title>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  x-small
                  class="mx-2"
                  fab
                  dark
                  to="/purchasedid"
                  color="indigo"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon dark> mdi-plus </v-icon>
                </v-btn>
              </template>
              <span>Purchase DID</span>
            </v-tooltip>
          </v-list-item>
        </v-list> -->
        <!-- <v-divider></v-divider> -->
        <v-card-actions class="py-4">
          <!-- <v-spacer></v-spacer> -->
          <!-- <v-btn small text to="/profile">
            <v-icon small left color="info">edit</v-icon> Edit Profile
          </v-btn> -->
          <v-btn small text @click="logout">
            <v-icon small left color="error">lock</v-icon> Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import dashboardAPI from "@/services/dashboardAPI.js";
import shoppingCartAPI from "@/services/shoppingCartAPI.js";
import profileAPI from "@/services/profileAPI.js";
import dummyImg from "../../assets/images/dummyProfile.jpeg";

export default {
  name: "app-toolbar",
  props: ["drawer", "showDrawer"],
  data: () => ({
    userDetail: {},
    credit: 0,
    userData: {},
    cartData: {},
    cartList: [],
    noOfDID: {},
    noOfCartItem: 0,
    dummyImg: dummyImg,
    checkImg: "",
  }),

  methods: {
    // async getBalanceKazoo() {
    //   let balanceDetail = {
    //     accountId: this.userDetail.accountId,
    //   };
    //   try {
    //     let response = await dashboardAPI.getBalanceKazoo(balanceDetail);
    //     this.credit = response.balance;
    //   } catch (error) {
    //   }
    // },

    // async getCartItem() {
    //   try {
    //     let response = await shoppingCartAPI.getCartItem();
    //     this.cartData = response;
    //     this.cartList = response.cartItemList;
    //     this.noOfCartItem = this.cartList.length;
    //   } catch (error) {
    //   }
    // },

    // async getUserDetail() {
    //   let userData = {
    //     accountId: this.userDetail.accountId,
    //     userId: this.userDetail.userId,
    //   };
    //   try {
    //     let response = await profileAPI.getUserDetail(userData);
    //     this.userData = response.userDetail;
    //     this.userData.email = response.userDetail.emailAddress.emailAddress;
    //     this.checkImg = response.profileImageData;
    //     this.userData.profileImageData = `data:image/jpg;base64,${response.profileImageData}`;
    //   } catch (error) {
    //   }
    // },

    // async getPhoneNumList() {
    //   let phoneNumberDetail = {
    //     accountId: this.userDetail.accountId,
    //   };
    //   try {
    //     let response = await dashboardAPI.getPhoneNumList(phoneNumberDetail);
    //     this.noOfDID = Object.keys(response.phonenosList.numbers).length;
    //   } catch (error) {
    //   }
    // },

    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },

    // toShoppingCart() {
    //   this.$router.push("/shoppingcart");
    // },

    // toggleDrawer() {
    //   this.$root.$emit("TOGGLE_DRAWER");
    // },
  },

  mounted() {
    // this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    // //this.getBalanceKazoo();
    // this.getUserDetail();
    // //this.getCartItem();
    // //this.getPhoneNumList();
    // this.$root.$on("CHANGE_PROFILE_DATA", (data) => {
    //   this.userData.name = data.name;
    // });
    // this.$root.$on("MODIFY_CART", (data) => {
    //   this.noOfCartItem = Number(this.noOfCartItem) + Number(data.quantity);
    // });
  },
};
</script>

<style scoped>
.style-btn {
  margin: 6px 8px;
}

.user-info {
  font-size: 14px;
  font-weight: bold;
}
</style>
