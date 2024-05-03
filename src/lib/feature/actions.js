import { setDoc, doc } from "firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/app/firebaseConfig";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid"; // Import the v4 function from the uuid library

export const createEvent = async (eventData) => {
  try {
    if (
      !eventData.eventName ||
      !eventData.initialTime ||
      !eventData.finishTime
    ) {
      alert(
        "Please fill in all required fields (Event Name, Initial Time, Finish Time)."
      );
      return; // Exit function if validation fails
    }
    await setDoc(doc(db, "events", eventData.id), eventData); // Use the generated UUID as the document ID
    alert("Event created successfully!");
    return eventData.id;
  } catch (err) {
    console.error("Error creating event:", err);
  }
};

// export const logEventData = async (state) => {
//   const router = useRouter();

//   try {
//     const initialTime = state.initialTime;
//     const finishTime = state.finishTime;
//     const hoursDifference = calculateHoursArrayWithAMPM(
//       initialTime,
//       finishTime
//     );
//     state.hours = hoursDifference;
//     console.log("Event Data:", state);
//     const eventId = uuidv4();
//     state.id = eventId;

//     await createEvent(state);

//     // Navigate to the new route with the eventId in the URL
//     // router.push(`/${eventId}`);

//     alert("Data Created");
//   } catch (err) {
//     console.error("Error logging event data:", err);
//   }
// };

export const logEventData = createAsyncThunk(
  "event/logEventData",
  async (state) => {
    try {
      const router = useRouter();
      const initialTime = state.initialTime;
      const finishTime = state.finishTime;
      const hoursDifference = calculateHoursArrayWithAMPM(
        initialTime,
        finishTime
      );
      state.hours = hoursDifference;
      console.log("Event Data:", state);
      const eventId = uuidv4();
      state.id = eventId;

      await createEvent(state);

      // Navigate to the new route with the eventId in the URL
      router.push(`/${eventId}`);
    } catch (err) {
      console.error("Error logging event data:", err);
      throw err; // Propagate error
    }
  }
);

function calculateHoursArrayWithAMPM(initialTime, finishTime) {
  const initialHour = parseInt(initialTime.split(":")[0], 10);
  const initialMinute = parseInt(initialTime.split(":")[1], 10);
  const finishHour = parseInt(finishTime.split(":")[0], 10);
  const finishMinute = parseInt(finishTime.split(":")[1], 10);

  const adjustedFinishHour =
    finishHour < initialHour ? finishHour + 12 : finishHour;

  let differenceInHours = adjustedFinishHour - initialHour;

  if (differenceInHours < 0) {
    differenceInHours += 24;
  }

  const hoursArray = [];
  for (let i = initialHour; i <= adjustedFinishHour; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 || i === 24 ? "AM" : "PM";
    hoursArray.push(
      `${hour.toString().padStart(2, "0")}:${initialMinute
        .toString()
        .padStart(2, "0")} ${ampm}`
    );
  }

  return hoursArray;
}
