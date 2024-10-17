<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Courses
            <v-btn color="primary" @click="openDialog()">
              <v-icon left>mdi-plus</v-icon>
              Add Course
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="courses"
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
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.courseName"
                  label="Course Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.courseCode"
                  label="Course Code"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.credits"
                  label="Credits"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.programId"
                  :items="programs"
                  item-text="program"
                  item-value="_id"
                  label="Select Program"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import config from "@/config/index.js";

export default {
  data: () => ({
    dialog: false,
    search: '',
    loading: false,
    snackbar: false,
    snackbarText: '',
    snackbarColor: '',
    headers: [
      { text: 'Course Name', align: 'start', sortable: true, value: 'courseName' },
      { text: 'Course Code', align: 'start', sortable: true, value: 'courseCode' },
      { text: 'Credits', align: 'start', sortable: true, value: 'credits' },
      { text: 'Program', align: 'start', sortable: true, value: 'programId.program' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    courses: [],
    programs: [],
    editedIndex: -1,
    editedItem: {
      courseName: '',
      courseCode: '',
      credits: '',
      degreeId: ''
    },
    defaultItem: {
      courseName: '',
      courseCode: '',
      credits: '',
      degreeId: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Course' : 'Edit Course';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.fetchCourses();
    this.fetchPrograms(); 
  },

  methods: {
    async fetchCourses() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.url}/course`);
        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
          this.courses = response.data.data.items;
        } else {
          console.error('Unexpected response structure:', response.data);
          this.showSnackbar('Error fetching courses: Unexpected data structure', 'error');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        this.showSnackbar('Error fetching courses', 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchPrograms() {
      try {
        const response = await axios.get(`${config.url}/program`);
        console.log(response)
        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
          this.programs = response.data.data.items;
        } else {
          console.error('Unexpected response structure:', response.data);
          this.showSnackbar('Error fetching programs: Unexpected data structure', 'error');
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
        this.showSnackbar('Error fetching programs', 'error');
      }
    },

    editItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      if (!item || !item._id) {
        console.error('Invalid item for deletion:', item);
        this.showSnackbar('Error: Invalid item for deletion', 'error');
        return;
      }

      const index = this.courses.indexOf(item);
      if (confirm('Are you sure you want to delete this course?')) {
        try {
          const response = await axios.delete(`${config.url}/course/${item._id}`);
          if (response.status === 204) {
            this.courses.splice(index, 1);
            this.showSnackbar('Course deleted', 'success');
          } else {
            console.error('Unexpected response status:', response.status);
            this.showSnackbar('Error deleting course: Unexpected response', 'error');
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          this.showSnackbar('Error deleting course', 'error');
        }
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          if (!this.editedItem || !this.editedItem._id) {
            console.error('Invalid item for update:', this.editedItem);
            this.showSnackbar('Error: Invalid item for update', 'error');
            return;
          }

          const response = await axios.put(`${config.url}/course/${this.editedItem._id}`, this.editedItem);
          if (response.data && response.data.data && response.data.data.item) {
            const updatedItem = response.data.data.item;
            Object.assign(this.courses[this.editedIndex], updatedItem);
            this.showSnackbar('Course updated', 'success');
          } else {
            console.error('Unexpected response structure:', response.data);
            this.showSnackbar('Error updating course: Unexpected data structure', 'error');
          }
        } else {
          const response = await axios.post(`${config.url}/course`, this.editedItem);
          if (response.data && response.data.data && response.data.data.item) {
            // this.courses.push(response.data.data.item);
            this.fetchCourses()
            this.showSnackbar('Course added', 'success');
          } else {
            console.error('Unexpected response structure:', response.data);
            this.showSnackbar('Error adding course: Unexpected data structure', 'error');
          }
        }
      } catch (error) {
        console.error('Error saving course:', error);
        this.showSnackbar('Error saving course', 'error');
      } finally {
        this.close();
      }
    },

    openDialog() {
      this.dialog = true;
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  },
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>
