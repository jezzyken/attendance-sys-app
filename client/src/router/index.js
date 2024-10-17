import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "",
    component: () => import("@/views/dashboard"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView"),
        meta: { requiresAuth: true },
      },
      {
        path: "/courses",
        name: "Courses",
        component: () => import("@/views/courses/CourseView"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/departments",
        name: "Departments",
        component: () => import("@/views/departments/DepartmentView"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/degrees",
        name: "Degrees",
        component: () => import("@/views/degrees/DegreeView"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/views/users/UserView"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/teachers",
        name: "Teachers",
        component: () => import("@/views/teachers/TeacherView"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/teachers/:id",
        name: "Profile",
        component: () => import("@/views/teachers/TeacherProfile"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/students",
        name: "Students",
        component: () => import("@/views/students/StudentView"),
        props: { mode: "add" },
        meta: { requiresAuth: true },
      },
      {
        path: "/schedules",
        name: "Schedules",
        component: () => import("@/views/schedules/scheduleView"),
        meta: { requiresAuth: true },
      },
      {
        path: '/users/:id/:action(add|edit|view)',
        name: "EditSales",
        component: () => import("@/views/users/UserForm"),
        props: true,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginForm"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters["auth/isAuthenticated"]) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else if (to.path === "/login" && store.getters["auth/isAuthenticated"]) {
    next({ path: "/dashboard" });
  } else {
    next();
  }
});

export default router;
