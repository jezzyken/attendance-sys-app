<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Students
            <v-btn color="primary" @click="openDialog">
              <v-icon left>mdi-plus</v-icon>
              Add Student
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="students"
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
                  v-model="editedItem.firstName"
                  label="First Name*"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.lastName"
                  label="Last Name*"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.middleName"
                  label="Middle Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.birthDate"
                      label="Birth Date*"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.birthDate"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.yearLevel"
                  :items="yearLevels"
                  label="Year Level*"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.guardianName"
                  label="Guardian Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.guardianPhone"
                  label="Guardian Phone"
                  type="tel"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.guardianEmail"
                  label="Guardian Email"
                  type="tel"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.programId"
                  :items="programs"
                  item-text="programAbr"
                  item-value="_id"
                  label="Program"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="loading">Save</v-btn>
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
import axios from "axios";
import config from "@/config/index.js";
import moment from "moment";

export default {
  data: () => ({
    dialog: false,
    menu: false,
    search: "",
    loading: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "",
    headers: [
      { text: "First Name", align: "start", sortable: true, value: "firstName" },
      { text: "Last Name", align: "start", sortable: true, value: "lastName" },
      { text: "Middle Name", align: "start", sortable: true, value: "middleName" },
      { text: "Birth Date", align: "start", sortable: true, value: "birthDate" },
      { text: "Year Level", align: "start", sortable: true, value: "yearLevel" },
      { text: "Guardian Name", align: "start", sortable: true, value: "guardianName" },
      { text: "Guardian Phone", align: "start", sortable: true, value: "guardianPhone" },
      { text: "Guardian Email", align: "start", sortable: true, value: "guardianEmail" },
      { text: "Program", align: "start", sortable: true, value: "programId.programAbr" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    students: [],
    editedIndex: -1,
    editedItem: {
      firstName: "",
      lastName: "",
      middleName: "",
      birthDate: "",
      yearLevel: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      programId: "",
    },
    defaultItem: {
      firstName: "",
      lastName: "",
      middleName: "",
      birthDate: "",
      yearLevel: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      programId: "",
    },
    yearLevels: ["First Year", "Second Year", "Third Year", "Fourth Year"],
    programs: [],
    rules: {
      required: value => !!value || 'Required.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Student" : "Edit Student";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.fetchStudents();
    this.fetchPrograms();
  },

  methods: {
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },

    async fetchStudents() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.url}/student`);
        if (response.data?.data?.items) {
          this.students = response.data.data.items.map(student => ({
            ...student,
            birthDate: moment(student.birthDate).format('YYYY-MM-DD')
          }));
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        this.showSnackbar("Error fetching students", "error");
      } finally {
        this.loading = false;
      }
    },

    async fetchPrograms() {
      try {
        const response = await axios.get(`${config.url}/program`);
        if (response.data?.data?.items) {
          this.programs = response.data.data.items;
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        this.showSnackbar("Error fetching programs", "error");
      }
    },

    editItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      if (!item?._id) {
        this.showSnackbar("Error: Invalid item for deletion", "error");
        return;
      }

      if (confirm("Are you sure you want to delete this student?")) {
        try {
          await axios.delete(`${config.url}/student/${item._id}`);
          this.students = this.students.filter(s => s._id !== item._id);
          this.showSnackbar("Student deleted", "success");
        } catch (error) {
          console.error("Error deleting student:", error);
          this.showSnackbar("Error deleting student", "error");
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
      if (!this.isValidForm()) {
        this.showSnackbar("Please fill in all required fields", "error");
        return;
      }

      try {
        const studentData = {
          ...this.editedItem,
          birthDate: moment(this.editedItem.birthDate).format('YYYY-MM-DD')
        };

        let response;
        if (this.editedIndex > -1) {
          response = await axios.put(`${config.url}/student/${studentData._id}`, studentData);
        } else {
          response = await axios.post(`${config.url}/student`, studentData);
        }

        if (response.data?.data?.item) {
          const updatedStudent = response.data.data.item;
          if (this.editedIndex > -1) {
            Object.assign(this.students[this.editedIndex], updatedStudent);
          } else {
            this.students.push(updatedStudent);
          }
          this.showSnackbar(this.editedIndex > -1 ? "Student updated" : "Student added", "success");
          this.close();
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error saving student:", error);
        this.showSnackbar("Error saving student", "error");
      }
    },

    isValidForm() {
      return (
        this.editedItem.firstName.trim() !== "" &&
        this.editedItem.lastName.trim() !== "" &&
        this.editedItem.birthDate !== "" &&
        this.editedItem.yearLevel.trim() !== ""
      );
    },

    showSnackbar(message, type) {
      this.snackbarText = message;
      this.snackbarColor = type === "error" ? "red" : "green";
      this.snackbar = true;
    },
  },
};
</script>