<template>
  <div id="app">
    <template v-if="isAuthenticated()">
      <v-app>
        <AppDrawer
          :menus="menus"
          :drawer="drawer"
          @update:drawer="drawer = $event"
        />
        <AppToolbar :drawer="drawer" @update:drawer="drawer = $event" />
        <v-main>
          <router-view></router-view>
        </v-main>
        <v-snackbar
          timeout="3000"
          top
          right
          :color="snackbar.color"
          v-model="snackbar.show"
        >
          {{ snackbar.text }}
        </v-snackbar>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
      <v-snackbar
        timeout="3000"
        top
        right
        :color="snackbar.color"
        v-model="snackbar.show"
      >
        {{ snackbar.text }}
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import AppDrawer from "@/components/pageHeader/app-drawer";
import AppToolbar from "@/components/pageHeader/app-toolbar";
import menu from "@/side-nav/menu";
import { useMainStore } from "@/store";
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    AppDrawer,
    AppToolbar,
  },

  setup() {
    const router = useRouter();
    const store = useMainStore();
    const eventBus = inject("eventBus");

    const menus = ref([]);
    const drawer = ref(true);
    const snackbar = ref({
      show: false,
      text: "",
      color: "",
    });

    const isIdle = computed(() => store.isIdle);

    const isAuthenticated = () => {
      return localStorage.getItem("auth");
    };

    const checkSession = () => {
      if (store.isIdle) {
        localStorage.clear();
        router.push({
          name: "Login",
        });
      }
    };

    const showSnackbar = (data) => {
      snackbar.value = {
        show: true,
        text: data.text,
        color: data.color,
      };
    };

    onMounted(() => {
      menus.value = menu;

      // Listen for snackbar events
      if (eventBus) {
        eventBus.on("SHOW_SNACKBAR", showSnackbar);
      }
    });

    return {
      menus,
      drawer,
      snackbar,
      isIdle,
      isAuthenticated,
      checkSession,
    };
  },
};
</script>

<style></style>
