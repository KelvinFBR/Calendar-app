import { createSlice } from "@reduxjs/toolkit";

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvent: true,
    events: [],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) {
          return payload;
        }
        return event;
      });

      state.activeEvent = null;
    },
    onDeleteEvent: (state) => {
      if (!state.activeEvent) return;

      state.events = state.events.filter(
        (event) => event.id !== state.activeEvent.id
      );

      state.activeEvent = null;
    },
    onLoadEvents: (state, { payload = [] }) => {
      state.isLoadingEvent = false;

      payload.forEach((event) => {
        const exists = state.events.some((dbEvent) => dbEvent.id === event.id);

        if (!exists) {
          state.events.push(event);
        }
      });
    },
    onLogoutCalendar: (state) => {
      (state.isLoadingEvent = true),
        (state.events = []),
        (state.activeEvent = null);
    },
  },
});

export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
} = calendarSlice.actions;
