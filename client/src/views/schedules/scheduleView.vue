<template>
  <v-container fluid class="pa-4">
    <!-- Clean, minimal header -->
    <header class="mb-8">
      <v-row align="center" justify="end">
        <!-- <v-col cols="auto">
          <div class="d-flex align-center">
            <v-avatar size="64" class="mr-4">
              <v-img :src="teacher.avatar" :alt="teacher.name">
                <template v-slot:placeholder>
                  <v-icon size="32">mdi-account</v-icon>
                </template>
              </v-img>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-medium mb-1">
                {{ teacher.name }}
              </h1>
              <div class="d-flex align-center">
                <v-chip small outlined color="primary" class="mr-2">
                  {{ teacher.subject }}
                </v-chip>
                <span class="text-caption grey--text">{{
                  teacher.department
                }}</span>
              </div>
            </div>
          </div>
        </v-col> -->
        <v-col cols="auto">
          <v-btn
            color="primary"
            elevation="0"
            class="px-6"
            @click="showAddDialog = true"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Class
          </v-btn>
        </v-col>
      </v-row>
    </header>

    <!-- Main calendar card with soft shadow -->
    <v-card elevation="2" class="calendar-card">
      <!-- Calendar toolbar -->
      <v-toolbar flat class="border-bottom" height="64">
        <div class="d-flex align-center">
          <v-btn icon @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <h2 class="text-h6 font-weight-medium grey--text text--darken-2 ml-4">
            {{ focus }}
          </h2>
        </div>
        <v-spacer></v-spacer>
        <v-btn-toggle
          v-model="calendarType"
          mandatory
          class="elevation-0 border"
          rounded
          dense
        >
          <v-btn small value="week" class="px-4">Week</v-btn>
          <v-btn small value="month" class="px-4">Month</v-btn>
        </v-btn-toggle>
      </v-toolbar>

      <!-- Calendar -->
      <v-sheet height="700">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :type="calendarType"
          :events="calendarEvents"
          :event-color="getEventColor"
          :first-interval="8"
          :interval-minutes="30"
          :interval-count="24"
          :weekdays="[1, 2, 3, 4, 5]"
          class="custom-calendar"
          @click:event="showEvent"
          @click:time="createEvent"
        >
          <template v-slot:event="{ event }">
            <div class="event-card">
              <div class="event-name">{{ event.name }}</div>
              <div class="event-details">
                <span class="room">Room {{ event.room }}</span>
              </div>
            </div>
          </template>
        </v-calendar>
      </v-sheet>
    </v-card>

    <!-- Simplified Event Dialog -->
    <v-dialog
      v-model="showEventDialog"
      max-width="400"
      transition="dialog-transition"
    >
      <v-card class="event-dialog">
        <v-card-title class="d-flex justify-space-between pa-6">
          <span class="text-h6">{{ selectedEvent?.name }}</span>
          <v-btn icon small @click="showEventDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <div class="event-info-grid">
            <div class="info-item">
              <v-icon color="grey darken-1">mdi-clock-outline</v-icon>
              <span>{{ selectedEvent?.start }} - {{ selectedEvent?.end }}</span>
            </div>
            <div class="info-item">
              <v-icon color="grey darken-1">mdi-door</v-icon>
              <span>Room {{ selectedEvent?.room }}</span>
            </div>
            <div class="info-item" v-if="selectedEvent?.description">
              <v-icon color="grey darken-1">mdi-text</v-icon>
              <span>{{ selectedEvent?.description }}</span>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="grey darken-1"
            class="px-4"
            @click="showEventDialog = false"
          >
            Close
          </v-btn>
          <v-btn color="primary" class="px-4" elevation="0" @click="editEvent">
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "TeacherSchedule",
  data: () => ({
    focus: new Date(),
    calendarType: "week",
    showAddDialog: false,
    showEventDialog: false,
    startMenu: false,
    endMenu: false,
    valid: false,
    saving: false,
    selectedEvent: null,
    events: [],
    teacher: {
      name: "Sarah Johnson",
      subject: "Mathematics",
      department: "Science Department",
      avatar: "path/to/avatar.jpg",
    },
    eventForm: {
      name: "",
      startDate: "",
      endDate: "",
      start: "",
      end: "",
      color: "",
      room: "",
      description: "",
    },
    colorOptions: [
      { text: "Blue", value: "blue" },
      { text: "Green", value: "green" },
      { text: "Purple", value: "purple" },
      { text: "Orange", value: "orange" },
      { text: "Red", value: "red" },
    ],
    snackbar: {
      show: false,
      text: "",
      color: "success",
    },
  }),

  computed: {
    calendarEvents() {
      return this.events.map((event) => ({
        name: event.name,
        start: event.start,
        end: event.end,
        color: event.color,
        timed: true,
        room: event.room,
        description: event.description,
      }));
    },
    formattedStartDate() {
      return this.formatDateTime(this.eventForm.start);
    },
    formattedEndDate() {
      return this.formatDateTime(this.eventForm.end);
    },
  },

  methods: {
    getEventColor(event) {
      return event.color;
    },

    formatDateTime(date) {
      if (!date) return "";
      return new Date(date).toLocaleString();
    },

    formatEventDateTime(date) {
      if (!date) return "";
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    showEvent({ event }) {
      this.selectedEvent = event;
      this.showEventDialog = true;
    },

    createEvent({ date }) {
      this.eventForm = {
        name: "",
        start: date,
        end: new Date(new Date(date).getTime() + 60 * 60 * 1000), // 1 hour later
        color: "blue",
        room: "",
        description: "",
      };
      this.showAddDialog = true;
    },

    editEvent() {
      this.eventForm = { ...this.selectedEvent };
      this.showEventDialog = false;
      this.showAddDialog = true;
    },

    async saveEvent() {
      if (this.$refs.form.validate()) {
        this.saving = true;
        try {
          const newEvent = {
            ...this.eventForm,
            id: this.selectedEvent ? this.selectedEvent.id : Date.now(),
          };

          if (this.selectedEvent) {
            const index = this.events.findIndex(
              (e) => e.id === this.selectedEvent.id
            );
            this.events.splice(index, 1, newEvent);
          } else {
            this.events.push(newEvent);
          }

          this.showSnackbar(
            this.selectedEvent
              ? "Class updated successfully"
              : "Class added successfully"
          );
          this.closeDialog();
        } catch (error) {
          this.showSnackbar("Error saving class", "error");
        } finally {
          this.saving = false;
        }
      }
    },

    async deleteEvent() {
      if (confirm("Are you sure you want to delete this class?")) {
        try {
          const index = this.events.findIndex(
            (e) => e.id === this.selectedEvent.id
          );
          this.events.splice(index, 1);
          this.showSnackbar("Class deleted successfully");
          this.showEventDialog = false;
        } catch (error) {
          this.showSnackbar("Error deleting class", "error");
        }
      }
    },

    closeDialog() {
      this.showAddDialog = false;
      this.$refs.form.reset();
      this.selectedEvent = null;
      this.eventForm = {
        name: "",
        startDate: "",
        endDate: "",
        start: "",
        end: "",
        color: "blue",
        room: "",
        description: "",
      };
    },

    showSnackbar(text, color = "success") {
      this.snackbar = {
        show: true,
        text,
        color,
      };
    },

    // Utility method to check for schedule conflicts
    hasScheduleConflict(newEvent) {
      return this.events.some((event) => {
        if (event.id === this.selectedEvent?.id) return false;

        const newStart = new Date(newEvent.start);
        const newEnd = new Date(newEvent.end);
        const existingStart = new Date(event.start);
        const existingEnd = new Date(event.end);

        return (
          newStart.getDay() === existingStart.getDay() &&
          ((newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd))
        );
      });
    },

    // Method to handle event drag-and-drop
    updateEventTime({ event, start, end }) {
      const eventToUpdate = this.events.find((e) => e.id === event.id);
      if (eventToUpdate) {
        eventToUpdate.start = start;
        eventToUpdate.end = end;
      }
    },

    // Export schedule to iCal format
    exportSchedule() {
      // Implementation for exporting schedule
      // You can use a library like ical-generator
    },
  },

  created() {
    // Sample events - replace with API call
    this.events = [
      {
        id: 1,
        name: "Advanced Mathematics",
        start: "2024-10-10 09:00",
        end: "2024-10-10 10:30",
        color: "blue",
        room: "101",
        description: "Calculus and Linear Algebra",
      },
      {
        id: 2,
        name: "Statistics",
        start: "2024-10-10 11:00",
        end: "2024-10-10 12:30",
        color: "green",
        room: "203",
        description: "Probability and Statistical Analysis",
      },
      // Add more sample events as needed
    ];
  },
};
</script>

<style scoped>
.calendar-card {
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.border {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

::v-deep .custom-calendar {
  --event-border-radius: 6px;
  --time-column-width: 80px;

  .v-calendar-weekly__head {
    background: #f8f9fa;
  }

  .v-calendar-weekly__head-weekday {
    padding: 8px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .v-calendar-weekly__day {
    border-color: rgba(0, 0, 0, 0.04);
  }

  .v-event {
    border: none !important;
    border-radius: var(--event-border-radius) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
  }

  .v-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

/* Event card styling */
.event-card {
  padding: 3px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-name {
  font-weight: 500;
  font-size: 13px;
  line-height: 1.3;
  color: white;
}

.event-details {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
}

.event-dialog {
  border-radius: 12px;
}

.event-info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(0, 0, 0, 0.7);
}

.info-item .v-icon {
  flex-shrink: 0;
}

.event-blue {
  background: linear-gradient(135deg, #1976d2, #2196f3);
}
.event-green {
  background: linear-gradient(135deg, #388e3c, #4caf50);
}
.event-purple {
  background: linear-gradient(135deg, #7b1fa2, #9c27b0);
}
.event-orange {
  background: linear-gradient(135deg, #f57c00, #ff9800);
}
.event-red {
  background: linear-gradient(135deg, #d32f2f, #f44336);
}
</style>
