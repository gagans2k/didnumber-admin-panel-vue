import { createPinia } from "pinia";
import { createApp } from "vue";
import JsonCSV from "vue-json-csv";
import Loading from "vue-loading-overlay";
import App from "./App.vue";
import "./assets/vue-loading.css";
import { createIdleVue } from "./plugins/idle-vue";
import vuetify from "./plugins/vuetify";
import router from "./router";

document.addEventListener("contextmenu", (event) => event.preventDefault());

const app = createApp(App);

// Global components
app.component("loading-overlay", Loading);
app.component("downloadCsv", JsonCSV);

// Create Pinia store
const pinia = createPinia();
app.use(pinia);

// Use plugins
app.use(router);
app.use(vuetify);

// Create idle vue instance
createIdleVue({
  store: pinia,
  router,
  idleTime: 1200000, // 20 minutes
  startAtIdle: false,
});

// Provide global event bus replacement
app.provide("eventBus", {
  emit: (event, data) => {
    // Use provide/inject pattern instead of global event bus
    const eventBus = app._context.provides.eventBus;
    if (eventBus && eventBus.listeners && eventBus.listeners[event]) {
      eventBus.listeners[event].forEach((callback) => callback(data));
    }
  },
  on: (event, callback) => {
    const eventBus = app._context.provides.eventBus;
    if (!eventBus.listeners) eventBus.listeners = {};
    if (!eventBus.listeners[event]) eventBus.listeners[event] = [];
    eventBus.listeners[event].push(callback);
  },
});

app.mount("#app");
