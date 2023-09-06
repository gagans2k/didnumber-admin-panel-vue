<template>
  <v-navigation-drawer
    app
    :mini-variant.sync="mini"
    v-model="drawer"
    width="256"
    color="#1d2228"
  >
    <v-list-item :class="mini && 'px-2'" class="pt-2" dark dense>
      <v-list-item-avatar>
        <img
          v-if="checkImg"
          :src="userData.profileImageData"
          alt="user"
          width="40"
        />
        <img v-else :src="dummyImg" alt="dummyuser" width="40" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ userData.name }} </v-list-item-title>
        <v-list-item-subtitle> Admin Panel</v-list-item-subtitle>
      </v-list-item-content>
      <v-icon @click="mini = !mini">menu</v-icon>
    </v-list-item>
    <v-list dense dark :class="mini ? 'px-0' : 'px-3'">
      <v-divider class="pb-4"></v-divider>
      <template v-for="item in menus">
        <v-list-item
          :to="item.path"
          v-if="!item.group"
          :key="item.name"
          class="mb-2 light-font"
        >
          <v-list-item-icon class="mr-0" v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              v-text="item.title"
              class="subtitle-text pl-4 font-weight-regular"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-if="item.group"
          color="white"
          ripple
          :key="item.name"
          no-action
          class="mb-2"
        >
          <template v-slot:activator>
            <v-list-item-icon class="mr-0" v-if="item.icon">
              <v-icon class="light-fonts">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.title"
                class="subtitle-text pl-4 light-fonts font-weight-regular"
              ></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.name"
            :to="child.path"
            class="pl-8 light-font"
          >
            <v-list-item-icon class="mr-0" v-if="child.icon">
              <v-icon small>{{ child.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>

    <!-- <v-dialog v-model="showImageDialog" max-width="50%" persistent>
      <v-card flat class="Card-style pa-2">
        <v-container fluid>
          <v-card-title>Profile Picture</v-card-title>
          <v-row>
            <v-col cols="12" md="6">
              <v-layout class="form-field">
                <v-flex sm12>
                  <v-btn @click="toProfileImage" color="primary" depressed>
                    Select Image
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout class="form-field">
                <v-flex sm12>
                  <v-btn
                    @click="showImageDialog = false"
                    color="error"
                    depressed
                    >Cancel</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-col>
            <v-col cols="12" md="6">
              <img
                :src="userData.profileImageData"
                onerror="this.src='/images/user.png';"
                style="width: 90%"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog> -->
  </v-navigation-drawer>
</template>

<script>
import menu from "@/side-nav/menu";
import profileAPI from "@/services/profileAPI.js";
import dummyImg from "../../assets/images/dummyProfile.jpeg";

export default {
  name: "app-drawer",
  data: () => ({
    barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",

    mini: false,
    drawer: true,
    menus: [],
    userData: {},
    dummyImg: dummyImg,
    showImageDialog: false,
    checkImg: "",
  }),
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    toProfileImage() {
      this.showImageDialog = false;
      this.$router.push("/profileimage");
    },
    async getUserDetail() {
      let userData = {
        accountId: this.userDetail.accountId,
        userId: this.userDetail.userId,
      };
      try {
        let response = await profileAPI.getUserDetail(userData);
        this.userData = response.userDetail;
        this.checkImg = response.profileImageData;
        this.userData.profileImageData = `data:image/jpg;base64,${response.profileImageData}`;
      } catch (error) {}
    },
  },

  created() {
    this.menus = menu.userMenu;
  },

  mounted() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.getUserDetail();
    this.$root.$on("CHANGE_PROFILE_DATA", (data) => {
      this.userData.name = data.name;
    });
    this.$root.$on("CHANGE_PROFILE_IMAGE", (data) => {
      this.userData.profileImageData = data.imageData;
      this.$forceUpdate();
    });
    this.$root.$on("TOGGLE_DRAWER", () => {
      this.drawer = !this.drawer;
    });
  },
};
</script>
