import Vue from "vue";
import VueRouter from "vue-router";
import Paths from "./path"

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL || '/',
	routes: Paths
});

export default router;
