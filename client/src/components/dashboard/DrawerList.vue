<template>
  <div>
    <v-list>
      <!-- <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1721001600&semt=ais_user"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ userName }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item> -->

      <v-list-item class="px-2 py-4">
      <v-list-item-avatar size="64">
        <v-img src="https://cdn.myanimelist.net/r/200x268/images/voiceactors/2/73659.jpg?s=20b62556680c5751919ba6d4bf20b3fc"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-subtitle-2 font-weight-bold">
          {{ (userName).toUpperCase() }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ user.role }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    </v-list>

    <v-divider></v-divider>

    <v-list v-for="item in items" :key="item.title">
      <v-list-item :to="item.route">
        <v-list-item-icon>
          <v-icon>{{ item.action }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      <v-list-group v-for="list in item.list" :key="list.title" v-model="list.active" :prepend-icon="list.action"
        @click.prevent="openRoute(list)" :append-icon="list.appendIcon" no-action link active-class="white--text">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="list.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="child in list.items" :key="child.title" :to="child.route" link active-class="white--text">
          <v-list-item-title v-text="child.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    admins: [
      ["Management", "mdi-account-multiple-outline"],
      ["Settings", "mdi-cog-outline"],
    ],
    items: [
      {
        action: "mdi-home",
        title: "Dashboard",
        route: "/dashboard",
        list: [
          {
            action: "mdi-account-group",
            title: "Students",
            appendIcon: "",
            route: "/users",
          },
          {
            action: "mdi-account-group",
            title: "Teachers",
            appendIcon: "",
            route: "/users",
          },
          {
            action: "mdi-account-group",
            title: "Courses",
            appendIcon: "",
            route: "/courses",
          },
          {
            action: "mdi-account-group",
            title: "Degrees",
            appendIcon: "",
            route: "/degrees",
          },
          {
            action: "mdi-account-group",
            title: "Classes",
            appendIcon: "",
            route: "/users",
          },
          {
            action: "mdi-account-group",
            title: "Departments",
            appendIcon: "",
            route: "/departments",
          },
          {
            action: "mdi-account-group",
            title: "Attendance",
            appendIcon: "",
            route: "/users",
          },
          {
            action: "mdi-account-group",
            title: "Accounts",
            appendIcon: "",
            route: "/users",
          },
          {
            action: "mdi-chart-box",
            title: "Reports",
            appendIcon: "",
          },
        ],
      },
    ],
  }),
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "user"]),
    userName() {
      return this.user && this.user.username
        ? `${this.user.username}`
        : "";
    },
  },
  methods: {
    openRoute(items) {
      let route = items.route;

      if (items.route === undefined) return;

      if (route === this.$route.path) return;

      this.$router.push(items.route);
    },
  },
};
</script>

