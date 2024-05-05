import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
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
  participants: {},
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
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      alert("Event not found", "error");

      return;
    }

    const member = eventSnap.data();

    if (member.participants) {
      if (member.participants[participant.userName]) {
        alert("Participant already exists ", "warning");
        return participant;
      }
    }
    member.participants = member.participants || {};
    member.participants[participant.userName] = participant;

    await setDoc(eventRef, member, { merge: true });
    alert("Event is Updated Successfully", "success");
    return participant;
  } catch (err) {
    console.error(err);
    alert("Something went wrong", "error");
  }
};

export const handleAvailabilityUpdate = async (eventId, participant) => {
  console.log("current Comming Data", participant);

  try {
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
          // Participant already exists, update availability
          if (!participantObject.availability) {
            participantObject.availability = []; // Ensure availability array is initialized
          }
          console.log(participant, "Availability in function");
          participantObject.availability.push(participant.availability);

          await setDoc(eventRef, member); // Save the updated member object
          alert("Participant's availability updated successfully", "success");
          return participant;
        }
      }
    }

    member.participants = member.participants || {};
    member.participants[participant.userName] = participant;
    await setDoc(eventRef, member, { merge: true });
    alert("Participant added successfully", "success");
    return participant;
  } catch (err) {
    console.error(err);
    alert("Something went wrong", "error");
  }
};


export const getParticipantByUsername = async (
  eventId,
  userName,
  setFilteredParticipant
) => {
  try {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const eventData = docSnap.data();
      console.log("Event data:", eventData);

      // Check if the participants object exists
      if (eventData.participants) {
        const participants = eventData.participants;

        // Iterate over the participants object to find the participant by username
        for (const participantKey in participants) {
          if (participants.hasOwnProperty(participantKey)) {
            const participant = participants[participantKey];
            if (participant.userName === userName) {
              console.log("Participant found:", participant);
              setFilteredParticipant({ eventId: docSnap.id, participant });
              return; // Exit the loop once participant is found
            }
          }
        }
      }

      console.log("No participant found with username:", userName);
      setParticipant(null);
    } else {
      console.log("No event found for the specified ID:", eventId);
      setParticipant(null);
    }
  } catch (error) {
    console.error("Error getting participant by username:", error);
    setParticipant(null);
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
