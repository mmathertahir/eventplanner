import { createSlice } from "@reduxjs/toolkit";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { v4 as uuidv4 } from "uuid"; // Import the v4 function from the uuid library

const initialState = {
  id: "",
  eventName: "",
  timeZone: "",
  specificDays: [],
  specificDates: [],
  initialTime: "",
  finishTime: "",
  hours: [],
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateEventDetail(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    logEventData(state) {
      const initialTime = state.initialTime;
      const finishTime = state.finishTime;
      const hoursDifference = calculateHours(initialTime, finishTime);
      state.hours = hoursDifference;
      console.log("Event Data:", state);
      const eventId = uuidv4();
      state.id = eventId;
      createEvent(state);
    },
  },
});

// Define the calculateHours function

function calculateHours(initialTime, finishTime) {
  const initialHour = parseInt(initialTime.split(":")[0], 10);
  const finishHour = parseInt(finishTime.split(":")[0], 10);

  // Adjust the finish hour if it's earlier than the initial hour
  const adjustedFinishHour =
    finishHour < initialHour ? finishHour + 12 : finishHour;

  // Calculate the difference in hours
  let differenceInHours = adjustedFinishHour - initialHour;

  // Ensure the difference is non-negative
  if (differenceInHours < 0) {
    differenceInHours += 24;
  }

  return differenceInHours;
}

const createEvent = async (eventData) => {
  try {
    await setDoc(doc(db, "events", eventData.id), eventData); // Use the generated UUID as the document ID
    alert("Event created successfully!");
  } catch (err) {
    console.error("Error creating event:", err);
  }
};

export const { updateEventDetail, logEventData } = eventSlice.actions;
export default eventSlice.reducer;
