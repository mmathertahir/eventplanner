"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Assuming db is your Firebase Firestore instance
import EventTimePicker from "@/Components/CreateEventComponents/EventTimePicker";
import EventNamePicker from "@/Components/CreateEventComponents/EventNamePicker";
import EventDatePicker from "@/Components/CreateEventComponents/EventDatePicker";

async function addToFirebase(name, email, message) {}

export default function Page() {
  // Added state for message

  return (
    <div className="">
      <div className="container  flex  flex-col lg:flex-row  gap-4 py-10">
        <div>
          <EventDatePicker />
        </div>

        <div className="flex flex-col justify-between gap-4">
          <EventTimePicker />
          <EventNamePicker />
        </div>
      </div>
      ;
    </div>
  );
}
