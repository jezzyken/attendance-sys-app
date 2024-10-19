<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Class Schedules
            <v-btn
              color="primary"
              :to="{
                name: 'Add Class',
                params: {
                  teacherId,
                },
              }"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Schedule
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="schedules"
            :loading="loading"
            :search="search"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
                prepend-icon="mdi-magnify"
              ></v-text-field>
            </template>
            <template v-slot:[`item.startTime`]="{ item }">
              {{ formatTimeDisplay(item.startTime) }}
            </template>
            <template v-slot:[`item.endTime`]="{ item }">
              {{ formatTimeDisplay(item.endTime) }}
            </template>
            <template v-slot:[`item.dayOfWeek`]="{ item }">
              {{ item.dayOfWeek.join(", ") }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import config from "@/config/index.js";
import moment from "moment";

export default {
  data: () => ({
    search: "",
    loading: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "",
    headers: [
      {
        text: "Course",
        align: "start",
        sortable: true,
        value: "courseId.courseName",
      },
      {
        text: "Start Time",
        align: "start",
        sortable: true,
        value: "startTime",
      },
      { text: "End Time", align: "start", sortable: true, value: "endTime" },
      {
        text: "Days of Week",
        align: "start",
        sortable: true,
        value: "dayOfWeek",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    schedules: [],
  }),

  computed: {
    teacherId() {
      return this.$route.params.id;
    },
  },

  created() {
    this.fetchSchedules();
  },

  methods: {
    async fetchSchedules() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${config.url}/schedule/teacher/${this.teacherId}`
        );
        this.schedules = response.data.data.items;
      } catch (error) {
        console.error("Error fetching schedules:", error);
        this.showSnackbar("Error fetching schedules", "error");
      } finally {
        this.loading = false;
      }
    },

    editItem(item) {
      this.$router.push({ name: "Edit Class", params: { id: item._id } });
    },

    async deleteItem(item) {
      if (confirm("Are you sure you want to delete this schedule?")) {
        try {
          await axios.delete(`${config.url}/schedule/${item._id}`);
          this.schedules = this.schedules.filter((s) => s._id !== item._id);
          this.showSnackbar("Schedule deleted", "success");
        } catch (error) {
          console.error("Error deleting schedule:", error);
          this.showSnackbar("Error deleting schedule", "error");
        }
      }
    },

    showSnackbar(message, type) {
      this.snackbarText = message;
      this.snackbarColor = type === "error" ? "red" : "green";
      this.snackbar = true;
    },

    formatTimeDisplay(time) {
      if (!time) return "";
      return moment(time, "HH:mm").format("hh:mm A");
    },
  },
};
</script>
