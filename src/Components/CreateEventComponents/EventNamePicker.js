"use client";
import React, { useState, useEffect } from "react";

import { logEventData } from "@/lib/feature/EventSlice";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { updateEventDetail } from "@/lib/feature/EventSlice";

export const navigateToEvent = (eventId) => {
  router.push(`/events/${eventId}`);
};

const EventNamePicker = () => {
  const dispatch = useDispatch();
  const [eventName, setEventName] = useState();
  const [paramid, setParamId] = useState();

  const handleEventName = () => {
    dispatch(updateEventDetail({ key: "eventName", value: eventName }));
  };

  useEffect(() => {
    handleEventName();
  }, [eventName]);

  const handleInputChange = (event) => {
    setEventName(event.target.value);
  };

  // const handleLogEventData = async (eventData) => {
  //   try {
  //     // Dispatch the logEventData action with the eventData from Redux state
  //     const newEventId = await dispatch(logEventData(eventData));

  //     // Handle the newEventId or any other logic after logging event data
  //     if (newEventId) {
  //       console.log("Event created with ID:", newEventId);
  //       // Navigate to a new route or perform any other action
  //     } else {
  //       console.log("Failed to create event.");
  //     }
  //   } catch (error) {
  //     console.error("Error logging event data:", error);
  //     // Handle error if needed
  //   }
  // };

  // const handleCreateEvent = async (eventData) => {
  //   const initialTime = state.initialTime;
  //   const finishTime = state.finishTime;
  //   const hoursDifference = calculateHoursArrayWithAMPM(
  //     initialTime,
  //     finishTime
  //   );
  //   dispatch(updateEventDetail({ key: "hours", value: hoursDifference }));

  //   const eventId = uuidv4();
  //   state.id = eventId;

  //   dispatch(updateEventDetail({ key: "id", value: state.id }));
  //   try {
  //     const response = await dispatch(createEvent(eventData));
  //     if (response.meta.requestStatus === "fulfilled") {
  //       const createdEvent = response.payload;
  //       navigate(`/events/${createdEvent.id}`); // Dispatch navigation action
  //     } else if (response.meta.requestStatus === "rejected") {
  //       // Handle errors (optional)
  //     }
  //   } catch (err) {
  //     // Handle errors (optional)
  //   }
  // };

  // console.log(eventName);
  return (
    <div>
      <div className="flex  flex-col gap-5">
        <h3 className="text-2xl text-white font-bold">
          {" "}
          Create a <span className="text-greenF">New Event</span>
        </h3>

        <div class=" flex flex-col lg:flex-row  lg:items-center  gap-y-3  ">
          <div className="text-white text-[12px]  w-full lg:w-[17%]  ">
            Event Name
          </div>

          <input
            className="w-full px-[24px] py-[12px]  bg-gray-900  text-white  rounded-[12px] border-none appearance-none focus:outline-none "
            placeholder="Enter Event Name"
            value={eventName}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default EventNamePicker;
