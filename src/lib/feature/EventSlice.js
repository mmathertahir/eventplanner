import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  setDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
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
  particepents: [],
  isSuccess: false,
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
      console.log(state, "State in Redux");
      const initialTime = state.initialTime;
      const finishTime = state.finishTime;
      const hoursDifference = calculateHoursArrayWithAMPM(
        initialTime,
        finishTime
      );
      state.hours = hoursDifference;

      const eventId = uuidv4();
      state.id = eventId;

      if (createEvent(state)) {
        state.isSuccess = true;
      }
    },
    getEventData(state, action) {
      let data = getDocsbyID(action.payload);
      // state.id = data.id;
      // state.eventName = data.eventName;
      // state.timeZone = data.timeZone;
      // state.specificDates = data.specificDates;
      // state.specificDays = data.specificDays;
      // state.initialTime = data.initialTime;
      // state.finishTime = data.finishTime;
      // state.hours = data.hours;
      // state.particepents = data.particepents;
      // state.isSuccess = data.isSuccess;
    },
  },
});

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

let createEvent = async (eventData) => {
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
    return true;
    //  alert("Event created successfully!");
  } catch (err) {
    console.error("Error creating event:", err);
    return;
  }
};

// let getEventById = async (eventId) => {
//   console.log(eventId);
//   try {
//     let newdata = await getDocs(collection(db, "events"));

//     console.log(newdata.docs., "awais");
//     if (!doc.exists) {
//       throw new Error("No such document!");
//     }
//     console.log(doc.data(), "awais");
//     return doc.data();
//   } catch (error) {
//     return rejectWithValue(error.message);
//   }
// };

const getDocsbyID = async (eventID) => {
  console.log(eventID, "Mather");
  try {
    console.log(eventID, "Mather in Docs");
    const q = query(collection(db, "events"), where("id", "==", eventID));
    const querySnapshot = await getDocs(q);
    let documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    documents = doc[0];
    console.log(documents, "Documents Comming");
    return documents;
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
};

let getEventById = async (eventId) => {
  console.log(eventId, "Mather");
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "events"), where("id", "==", eventId))
    );

    if (querySnapshot.empty) {
      throw new Error("No such document!");
    }

    const eventData = querySnapshot.docs[0].data();
    return eventData;
  } catch (error) {
    console.error("Error getting event by ID:", error);
    throw error;
  }
};

export const { updateEventDetail, logEventData, getEventData } =
  eventSlice.actions;

export default eventSlice.reducer;
