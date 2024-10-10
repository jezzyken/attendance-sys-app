<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="isLoading"
      class="elevation-1 mt-4"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <div style="width: 400px">
            <v-text-field
              v-model="search"
              filled
              rounded
              dense
              hide-details
              placeholder="Search"
              append-icon="mdi-filter-variant"
            ></v-text-field>
          </div>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{}">
              <v-btn
                color="#000033"
                dark
                class="mb-2"
                small
                @click="showDlalog"
              >
                new
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.degree"
                        label="Degree"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.degreeAbr"
                        label="Degree Abbr"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="editedItem.departmentId"
                        :items="departments"
                        item-text="departmentName"
                        item-value="_id"
                        label="Department"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Delete Confirmation Dialog -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">
                Are you sure you want to delete this item?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu bottom left>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(action, i) in actions"
              :key="i"
              @click="handleAction(action.title, item)"
            >
              <v-list-item-title>{{ action.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:no-data>
        <v-btn color="#000033" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Degree",
        align: "start",
        sortable: false,
        value: "degree",
      },
      {
        text: "Abbreviation",
        align: "start",
        sortable: false,
        value: "degreeAbr",
      },
      {
        text: "Department",
        value: "departmentId.departmentName",
        sortable: false,
      },

      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      degree: "",
      degreeAbr: "",
      departmentId: null,
    },
    defaultItem: {
      degree: "",
      degreeAbr: "",
      departmentId: null,
    },
    itemId: null,
    isLoading: false,
    search: "",
    actions: [{ title: "Edit" }, { title: "Delete" }],
    departments: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Department" : "Edit Department";
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions({
      getDepartments: "departments/getItems",
      getItems: "degrees/getItems",
      addItem: "degrees/addItem",
      removeItem: "degrees/deleteItem",
      updateItem: "degrees/updateItem",
    }),

    showDlalog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },

    async initialize() {
      this.isLoading = true;
      const [degreeResults, departmentResults] = await Promise.all([
        this.getItems(),
        this.getDepartments(),
      ]);
      this.items = degreeResults.data || [];
      this.departments = departmentResults.data;
      this.isLoading = false;
    },


    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.itemId = item._id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.removeItem(this.itemId);
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        await this.updateItem(this.editedItem);
      } else {
        await this.addItem(this.editedItem);
        this.items.push(this.editedItem);
      }
      this.initialize();
      this.close();
    },

    handleAction(action, item) {
      switch (action) {
        case "Edit":
          this.editItem(item);
          break;
        case "Delete":
          this.deleteItem(item);
          break;
      }
    },
  },
};
</script>
