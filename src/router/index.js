import { createRouter, createWebHistory } from "vue-router";
import Paths from "./path";

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL || '/'),
	routes: Paths
});

export default router;
