import { RouteRecordRaw } from "vue-router";
import Register from "../Views/Register.vue";
import Login from "../Views/Login.vue";
import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Admindashboard from "../Views/Admindashboard.vue";
import SalesDashboard from "../Views/Salesdashboard.vue";
import CustomerList from "../Views/CustomerList.vue";
import Unauthorized from "../Views/Unauthorized.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/admin", component: Admindashboard,
    meta: { requiresAuth: true, role: "Admin" }
   }, 
  { path: "/sales", component: SalesDashboard, meta: { requiresAuth: true, role: "SalesRep" } },
  { path: "/customers", name: "Customers", component: CustomerList, meta: { requiresAuth: true } },
  { path: "/", redirect: "/login" },
  {
    path: "/support",
    name: "SupportDashboard",
    component: () => import("../Views/Supportdashboard.vue"),
    meta: { requiresAuth: true, role: "SupportUser" },
  },
  { path: "/unauthorized", component: Unauthorized },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth as boolean | undefined;
  const requiredRole = to.meta.role as string | undefined;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (requiresAuth) {
    if (!token) {
      return next("/unauthorized");
    }
    // Quick client-side role check:
    if ( to.meta.role && to.meta.role !== role) {
      return next("/unauthorized");
    }
  }
  next();
});

export default router;

