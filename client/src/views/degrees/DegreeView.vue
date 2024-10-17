<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Programs
            <v-btn color="primary" @click="openDialog()">
              <v-icon left>mdi-plus</v-icon>
              Add Program
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="programs"
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
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
                  v-model="editedItem.program"
                  label="Program"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.programAbr"
                  label="Program Abbreviation"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.departmentId"
                  :items="departments"
                  item-text="departmentName"
                  item-value="_id"
                  label="Select Department"
                  required
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
import axios from "axios";
import config from "@/config/index.js";

export default {
  data: () => ({
    dialog: false,
    search: "",
    loading: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "",
    headers: [
      { text: "Programs", align: "start", sortable: true, value: "program" },
      {
        text: "Program Abbreviation",
        align: "start",
        sortable: true,
        value: "programAbr",
      },
      {
        text: "Department",
        align: "start",
        sortable: true,
        value: "departmentId.departmentName",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    programs: [],
    departments: [],
    editedIndex: -1,
    editedItem: {
      program: "",
      programAbr: "",
      departmentId: "",
    },
    defaultItem: {
      program: "",
      programAbr: "",
      departmentId: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Program" : "Edit Program";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.fetchDepartments();
    this.fetchPrograms();
  },

  methods: {
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

    async fetchPrograms() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.url}/program`);
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.items)
        ) {
          this.programs = response.data.data.items;
        } else {
          console.error("Unexpected response structure:", response.data);
          this.showSnackbar(
            "Error fetching programs: Unexpected data structure",
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        this.showSnackbar("Error fetching programs", "error");
      } finally {
        this.loading = false;
      }
    },

    editItem(item) {
      this.editedIndex = this.programs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      if (!item || !item._id) {
        console.error("Invalid item for deletion:", item);
        this.showSnackbar("Error: Invalid item for deletion", "error");
        return;
      }

      const index = this.programs.indexOf(item);
      if (confirm("Are you sure you want to delete this program?")) {
        try {
          const response = await axios.delete(
            `${config.url}/program/${item._id}`
          );
          if (response.status === 204) {
            this.programs.splice(index, 1);
            this.showSnackbar("Program deleted", "success");
          } else {
            console.error("Unexpected response status:", response.status);
            this.showSnackbar(
              "Error deleting program: Unexpected response",
              "error"
            );
          }
        } catch (error) {
          console.error("Error deleting program:", error);
          this.showSnackbar("Error deleting program", "error");
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
          const response = await axios.put(
            `${config.url}/program/${this.editedItem._id}`,
            this.editedItem
          );
          if (response.data && response.data.data && response.data.data.item) {
            const updatedItem = response.data.data.item;
            Object.assign(this.programs[this.editedIndex], updatedItem);
            this.showSnackbar("Program updated", "success");
          } else {
            console.error("Unexpected response structure:", response.data);
            this.showSnackbar(
              "Error updating program: Unexpected data structure",
              "error"
            );
          }
        } else {
          const response = await axios.post(
            `${config.url}/program`,
            this.editedItem
          );
          if (response.data && response.data.data && response.data.data.item) {
            await this.fetchPrograms();
            this.showSnackbar("Program added", "success");
          } else {
            console.error("Unexpected response structure:", response.data);
            this.showSnackbar(
              "Error adding program: Unexpected data structure",
              "error"
            );
          }
        }
      } catch (error) {
        console.error("Error saving program:", error);
        this.showSnackbar("Error saving program", "error");
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
    },
  },
};
</script>
