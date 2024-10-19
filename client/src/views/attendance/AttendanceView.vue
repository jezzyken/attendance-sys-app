<template>
  <v-container>
    <v-card>
      <v-card-title>
        Attendance Overview
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="attendanceItems"
        :search="search"
        :loading="loading"
      >
        <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-btn small color="primary" @click="viewStudents(item)">
            View Students
          </v-btn>
        </template> -->
        <template v-slot:no-data>
          No attendance data available
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Students Attendance</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="studentHeaders"
            :items="studentsAttendance"
            :loading="loadingStudents"
          >
            <template v-slot:no-data>
              No student data available
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import config from "@/config/index.js";

export default {
  data: () => ({
    search: '',
    loading: true,
    loadingStudents: false,
    dialog: false,
    headers: [
      { text: 'Date', value: 'attendanceDate' },
      { text: 'Day of Week', value: 'dayOfWeek' },
      { text: 'Course Name', value: 'courseName' },
      { text: 'Start Time', value: 'startTime' },
      { text: 'End Time', value: 'endTime' },
      { text: 'Teacher Name', value: 'teacherName' },
      { text: 'Number of Students', value: 'numberOfStudents' },
      // { text: 'Actions', value: 'actions', sortable: false }
    ],
    studentHeaders: [
      { text: 'Student Name', value: 'studentName' },
      { text: 'Remarks', value: 'remarks' }
    ],
    attendanceItems: [],
    studentsAttendance: []
  }),

  created() {
    this.fetchAttendanceData();
  },

  methods: {
    async fetchAttendanceData() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.url}/attendance/`);
        if (response.data && Array.isArray(response.data)) {
          this.attendanceItems = response.data.map((item) => ({
            attendanceDate: new Date(item.attendanceDate).toLocaleDateString(),
            dayOfWeek: item.dayOfWeek,
            courseName: item.courseName,
            startTime: item.startTime,
            endTime: item.endTime,
            teacherName: item.teacherName,
            numberOfStudents: item.numberOfStudents,
          }));
        } else {
          console.error("Unexpected response structure:", response.data);
          this.showSnackbar(
            "Error fetching attendance data: Unexpected data structure",
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        this.showSnackbar("Error fetching attendance data", "error");
      } finally {
        this.loading = false;
      }
    },

    async viewStudents(item) {
      this.loadingStudents = true;
      this.dialog = true;
      try {
        const response = await axios.get(`${config.url}/students/attendance/overview/attendance/${item._id}`);

        console.log(response)
        if (response.data && Array.isArray(response.data)) {
          this.studentsAttendance = response.data;
        } else {
          console.error('Unexpected response structure:', response.data);
          this.showSnackbar('Error fetching student data: Unexpected data structure', 'error');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        this.showSnackbar('Error fetching student data', 'error');
      } finally {
        this.loadingStudents = false;
      }
    },

    showSnackbar(text, color) {
      console.log(text, color);
    },
  },
};
</script>
