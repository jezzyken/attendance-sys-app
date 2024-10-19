<template>
  <v-container>
    <v-card class="elevation-2">
      <v-card-title class="headline primary white--text">
        <v-btn icon dark @click="$router.go(-1)" class="mr-4">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        {{ isEditing ? "Edit Class Schedule" : "Create Class Schedule" }}
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="valid">
          <v-select
            v-model="schedule.courseId"
            :items="courses"
            item-text="courseName"
            item-value="_id"
            label="Course*"
            :rules="[rules.required]"
            outlined
          ></v-select>

          <v-menu
            ref="startTimeMenu"
            v-model="startTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatTimeDisplay(schedule.startTime)"
                label="Start Time*"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required]"
                outlined
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="startTimeMenu"
              v-model="schedule.startTime"
              full-width
              format="ampm"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="startTimeMenu = false"
                >Cancel</v-btn
              >
              <v-btn
                text
                color="primary"
                @click="$refs.startTimeMenu.save(schedule.startTime)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-menu>

          <v-menu
            ref="endTimeMenu"
            v-model="endTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatTimeDisplay(schedule.endTime)"
                label="End Time*"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required]"
                outlined
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="endTimeMenu"
              v-model="schedule.endTime"
              full-width
              format="ampm"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="endTimeMenu = false"
                >Cancel</v-btn
              >
              <v-btn
                text
                color="primary"
                @click="$refs.endTimeMenu.save(schedule.endTime)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-menu>

          <v-select
            v-model="schedule.dayOfWeek"
            :items="daysOfWeek"
            label="Days of Week*"
            multiple
            chips
            :rules="[rules.required]"
            outlined
          ></v-select>

          <v-select
            v-model="schedule.students"
            :items="students"
            item-text="fullName"
            item-value="_id"
            label="Students"
            multiple
            chips
            outlined
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="$router.go(-1)">Cancel</v-btn>
        <v-btn
          color="primary"
          @click="save"
          :loading="loading"
          :disabled="!valid"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>

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
    valid: false,
    loading: false,
    startTimeMenu: false,
    endTimeMenu: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "",
    schedule: {
      courseId: "",
      startTime: "",
      endTime: "",
      dayOfWeek: [],
      students: [],
    },
    courses: [],
    students: [],
    daysOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    rules: {
      required: (value) => !!value || "Required.",
    },
  }),

  computed: {
    isEditing() {
      return !!this.$route.params.id;
    },
    teacherId() {
      return this.$route.params.teacherId;
    },
  },

  created() {
    this.fetchCourses();
    this.fetchStudents();
    if (this.isEditing) {
      this.fetchSchedule();
    }
  },

  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get(`${config.url}/course`);
        this.courses = response.data.data.items;
      } catch (error) {
        console.error("Error fetching courses:", error);
        this.showSnackbar("Error fetching courses", "error");
      }
    },

    async fetchStudents() {
      try {
        const response = await axios.get(`${config.url}/student`);
        this.students = response.data.data.items.map((student) => ({
          ...student,
          fullName: `${student.firstName} ${student.lastName}`,
        }));
      } catch (error) {
        console.error("Error fetching students:", error);
        this.showSnackbar("Error fetching students", "error");
      }
    },

    async fetchSchedule() {
      try {
        const response = await axios.get(
          `${config.url}/schedule/${this.$route.params.id}`
        );
        const scheduleData = response.data.data.item;

        const classesResponse = await axios.get(
          `${config.url}/class/schedule/item?classScheduleId=${scheduleData._id}`
        );
        const studentIds = classesResponse.data.data.item.map(
          (classItem) => classItem.studentId
        );

        this.schedule = {
          ...scheduleData,
          students: studentIds,
          startTime: this.formatTimeDisplay(scheduleData.startTime),
          endTime: this.formatTimeDisplay(scheduleData.endTime),
        };
      } catch (error) {
        console.error("Error fetching schedule:", error);
        this.showSnackbar("Error fetching schedule", "error");
      }
    },

    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        const scheduleData = {
          ...this.schedule,
          teacherId: this.teacherId,
          startTime: this.formatTimeForBackend(this.schedule.startTime),
          endTime: this.formatTimeForBackend(this.schedule.endTime),
        };

        if (this.isEditing) {
          await axios.put(
            `${config.url}/schedule/${this.$route.params.id}`,
            scheduleData
          );
        } else {
          await axios.post(`${config.url}/schedule`, scheduleData);
        }

        this.showSnackbar(
          this.isEditing ? "Schedule updated" : "Schedule added",
          "success"
        );
        this.$router.go(-1);
      } catch (error) {
        console.error("Error saving schedule:", error);
        this.showSnackbar("Error saving schedule", "error");
      } finally {
        this.loading = false;
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

    formatTimeForBackend(time) {
      if (!time) return null;
      return moment(time, "hh:mm A").format("HH:mm");
    },
  },
};
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}

.v-card-title {
  font-weight: 500;
}

.v-btn {
  text-transform: none;
}
</style>
