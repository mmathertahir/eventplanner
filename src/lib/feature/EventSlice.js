import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  setDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  arrayUnion,
  documents,
  push,
} from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

import { v4 as uuidv4 } from "uuid"; // Import the v4 function from the uuid library
import { useDispatch } from "react-redux";

const initialState = {
  id: "",
  eventName: "",
  timeZone: "",
  specificDays: [],
  specificDates: [],
  initialTime: "",
  finishTime: "",
  hours: [],
  participants: [],
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

    setEventData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    updateParticipants(state, action) {
      state.participants.push(action.payload);
      // Push new participant to participants array
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

export const getDocsbyID = async (eventID) => {
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

    const eventData = documents[0].data;

    return eventData;
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
};

export const handlememberUpdate = async (eventId, participant) => {
  try {
    // Fetch the todo with the specific event ID
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      alert("Event not found", "error");

      return;
    }

    const member = eventSnap.data();
    if (member.participants) {
      for (let i = 0; i < member.participants.length; i++) {
        const participantObject = member.participants[i];
        if (participantObject.userName === participant.userName) {
          alert("Participant already exists ", "warning");
          return participant;
        }
      }
    }

    member.participants = member.participants || []; // Ensure participants is initialized as an array
    member.participants.push(participant);

    await setDoc(eventRef, member, { merge: true });
    alert("Event is Updated Successfully", "success");
    return participant;
  } catch (err) {
    console.error(err);
    alert("Something went wrong", "error");
  }
};

export const {
  updateEventDetail,
  logEventData,
  getEventData,
  setEventData,
  updateParticipants,
} = eventSlice.actions;

export default eventSlice.reducer;
