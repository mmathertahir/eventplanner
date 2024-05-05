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
export const toggleAvailability = async (
  timeslot,
  weekday,
  userData,
  setUserData
) => {
  let timeslot2 = [timeslot];
  weekday = convertDateFormat(weekday);

  await setUserData((prevUserData) => {


let prevdata=Object.values(prevUserData.availability[weekday]);
    const newAvailability = {
      //       ...prevUserData.availability,
      //       [weekday]: {
      //         ...(prevUserData.availability[weekday] || {}),
      // [timeslot]:!prevUserData.availability[weekday]?.[timeslot]

      //       },

      ...prevUserData.availability,
      [weekday]: [

        prevdata?{...prevdata,...timeslot2}:{...timeslot2}
        
      ],
    };
    return {
      ...prevUserData,

      availability: newAvailability,
    };
  });
};

// export const toggleAvailability = async (
//   timeslot,
//   weekday,
//   userData,
//   setUserData
// ) => {
//   weekday = convertDateFormat(weekday);

//   await setUserData((prevUserData) => {
//     const newAvailability = {
//       ...prevUserData.availability,
//       [weekday]: {
//         ...(prevUserData?.availability[weekday] || {}),
//         [timeslot]: !prevUserData.availability[weekday]?.[timeslot],
//       },
//     };
//     return {
//       ...prevUserData,
//       availability: newAvailability,
//     };
//   });
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

export const getDayOfWeek = (specificDates) => {
  console.log(specificDates, "Dates are");
  return specificDates?.map((dateString) => {
    const [day, month, year] = dateString.split("/");
    const formattedDate = `20${year}-${month}-${day}`;
    console.log("Formatted Date:", formattedDate);

    const date = new Date(formattedDate);
    console.log("Parsed Date:", date);

    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()} ${days[date.getDay()]}

    ${date.getFullYear()}
    `;
  });
};

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

export function convertDateFormat(dateString) {
  // Remove leading/trailing whitespaces and split the date string by newline and spaces
  const parts = dateString.trim().split(/[\n\s]+/);

  // Check if the parts array has the expected length
  if (parts.length !== 4) {
    console.error("Invalid date string format");
    return null; // Return null if the format is invalid
  }

  // Extract month, day, year from the split parts
  const month = parts[0];
  const day = parseInt(parts[1]);
  const year = parseInt(parts[3]); // Parsing the full year

  // Create a mapping for month names to their corresponding numeric values
  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  // Convert month name to its numeric value
  const numericMonth = monthMap[month];

  // Check if month abbreviation is valid
  if (!numericMonth) {
    console.error("Invalid month abbreviation:", month);
    return null; // Return null if the month abbreviation is invalid
  }

  // Return the formatted date string
  return `${day}/${numericMonth}/${year}`;
}

// Example usage:
const originalDate = "May 14 Tue 2024";
const convertedDate = convertDateFormat(originalDate);
console.log(convertedDate); // Output: 14/5/24

export const getAllEvents = async (setAllEvent) => {
  try {
    const array = [];
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id, " => ", data);
      array.push({ id: doc.id, ...data }); // Include the document ID in the data object
    });
    setAllEvent(array);
  } catch (error) {
    console.error("Error getting all events: ", error);
  }
};
