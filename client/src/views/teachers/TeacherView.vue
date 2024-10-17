<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Teachers
            <v-btn color="primary" @click="openDialog()">
              <v-icon left>mdi-plus</v-icon>
              Add Teacher
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="teachers"
            :loading="loading"
            :search="search"
          >
            <template v-slot:[`item.select`]="{ item }">
              <router-link
                :to="{
                  name: 'Profile',
                  params: { id: item._id },
                }"
              >
                <v-btn x-small color="#2b3990" class="white--text">
                  select
                </v-btn>
              </router-link>
            </template>

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
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.firstName"
                    label="First Name"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.lastName"
                    label="Last Name"
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
                  <v-text-field
                    v-model="editedItem.suffix"
                    label="Suffix"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.phoneNo"
                    label="Phone No"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    v-model="employmentDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="editedItem.employmentDate"
                        label="Employment Date"
                        readonly
                        v-bind="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem.employmentDate"
                      @input="employmentDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.departmentId"
                    :items="departments"
                    item-text="departmentName"
                    item-value="_id"
                    label="Select Department"
                    required
                    multiple
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.status"
                    :items="statusOptions"
                    label="Status"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
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
import axios from "axios";
import config from "@/config/index.js";

export default {
  data() {
    return {
      teachers: [],
      departments: [],
      loading: true,
      dialog: false,
      editedItem: {
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        email: "",
        phoneNo: "",
        employmentDate: "",
        departmentId: "",
        status: "",
      },
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
      },
      statusOptions: ["Active", "Inactive"],
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      employmentDateMenu: false,
      valid: false,
      search: "",
      headers: [
        {
          text: "Select",
          align: "start",
          sortable: false,
          value: "select",
        },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Phone No", value: "phoneNo" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.editedItem._id ? "Edit Teacher" : "New Teacher";
    },
  },
  created() {
    this.fetchTeachers();
    this.fetchDepartments();
  },
  methods: {
    async fetchTeachers() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.url}/teacher`);
        this.teachers = response.data.data.items;
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchDepartments() {
      try {
        const response = await axios.get(`${config.url}/department`);
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.items)
        ) {
          this.departments = response.data.data.items;
        } else {
          console.error("Unexpected response structure:", response.data);
          this.showSnackbar(
            "Error fetching departments: Unexpected data structure",
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        this.showSnackbar("Error fetching departments", "error");
      }
    },
    openDialog() {
      this.dialog = true;
      this.resetForm();
    },
    resetForm() {
      this.editedItem = {
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        email: "",
        phoneNo: "",
        employmentDate: "",
        departmentId: "",
        status: "",
      };
    },
    editItem(item) {
      this.editedItem = { ...item };
      this.dialog = true;
    },
    async deleteItem(item) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this teacher?"
      );
      if (confirmDelete) {
        try {
          await axios.delete(`${config.url}/teacher/${item._id}`);
          this.fetchTeachers();
          this.showSnackbar("Teacher deleted", "success");
        } catch (error) {
          console.error("Error deleting teacher:", error);
          this.showSnackbar("Error deleting teacher", "error");
        }
      }
    },
    close() {
      this.dialog = false;
    },
    async save() {
      if (this.$refs.form.validate()) {
        try {
          let response;
          if (this.editedItem._id) {
            response = await axios.put(
              `${config.url}/teacher/${this.editedItem._id}`,
              this.editedItem
            );
          } else {
            response = await axios.post(
              `${config.url}/teacher`,
              this.editedItem
            );
          }

          if (response.data && response.data.data && response.data.data.item) {
            if (this.editedItem._id) {
              const index = this.teachers.findIndex(
                (teacher) => teacher._id === this.editedItem._id
              );
              if (index !== -1) {
                this.teachers.splice(index, 1, response.data.data.item);
              }
            } else {
              this.teachers.push(response.data.data.item);
            }
            this.showSnackbar("Teacher saved", "success");
          } else {
            console.error("Unexpected response structure:", response.data);
            this.showSnackbar(
              "Error saving teacher: Unexpected data structure",
              "error"
            );
          }
        } catch (error) {
          console.error("Error saving teacher:", error);
          this.showSnackbar("Error saving teacher", "error");
        } finally {
          this.close();
        }
      }
    },
    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color === "error" ? "red" : "green";
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
