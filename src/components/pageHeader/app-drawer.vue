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
  </v-navigation-drawer>
</template>

<script>
import { ref, reactive, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import menu from "@/side-nav/menu";
import profileAPI from "@/services/profileAPI.js";
import dummyImg from "../../assets/images/dummyProfile.jpeg";

export default {
  name: "app-drawer",
  
  setup() {
    const router = useRouter();
    const eventBus = inject('eventBus');
    
    const mini = ref(false);
    const drawer = ref(true);
    const menus = ref([]);
    const userData = reactive({});
    const showImageDialog = ref(false);
    const checkImg = ref("");
    const userDetail = ref(null);

    const logout = () => {
      localStorage.clear();
      router.push("/login");
    };

    const toProfileImage = () => {
      showImageDialog.value = false;
      router.push("/profileimage");
    };

    const getUserDetail = async () => {
      let userDataParam = {
        accountId: userDetail.value.accountId,
        userId: userDetail.value.userId,
      };
      try {
        let response = await profileAPI.getUserDetail(userDataParam);
        Object.assign(userData, response.userDetail);
        checkImg.value = response.profileImageData;
        userData.profileImageData = `data:image/jpg;base64,${response.profileImageData}`;
      } catch (error) {}
    };

    onMounted(() => {
      menus.value = menu.userMenu;
      userDetail.value = JSON.parse(localStorage.getItem("userDetail"));
      getUserDetail();
      
      // Listen for events using the new event bus
      if (eventBus) {
        eventBus.on("CHANGE_PROFILE_DATA", (data) => {
          userData.name = data.name;
        });
        eventBus.on("CHANGE_PROFILE_IMAGE", (data) => {
          userData.profileImageData = data.imageData;
        });
        eventBus.on("TOGGLE_DRAWER", () => {
          drawer.value = !drawer.value;
        });
      }
    });

    return {
      mini,
      drawer,
      menus,
      userData,
      dummyImg,
      showImageDialog,
      checkImg,
      logout,
      toProfileImage,
      getUserDetail
    };
  }
};
</script>
