<template>
  <v-sheet
    class="pa-12 d-flex flex-column align-center justify-center"
    rounded
    color="#000033"
    height="100vh"
  >
    <div class="text-center mb-4">
      <span class="text-h4 text-uppercase white--text">Login</span>
    </div>
    <v-card class="px-6 py-8" width="400">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            label="Email"
            clearable
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            class="mt-n3"
            v-model="password"
            label="Password"
            placeholder="Enter your password"
            outlined
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            block
            class="mt-n3"
            @click="login"
            :disabled="isLoading"
          >
            Sign In
          </v-btn>
        </v-col>
      </v-row>

      <br />
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="3000" color="red" top>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-sheet>
</template>

<script>
export default {
  data: () => ({
    form: false,
    email: null,
    password: null,
    loading: false,
    show: false,
    isLoading: false,
    snackbar: false,
    snackbarMessage: "",
  }),

  methods: {
    async login() {
      this.isLoading = true;
      const user = {
        email: this.email,
        password: this.password,
      };
      const response = await this.$store.dispatch("auth/login", user);
      if (response.status === 500) {
        this.snackbarMessage = "Invalid login credentials";
        this.snackbar = true;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.v-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
