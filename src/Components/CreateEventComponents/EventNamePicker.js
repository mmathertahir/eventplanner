"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEventDetail, logEventData } from "@/lib/feature/EventSlice";

const EventNamePicker = () => {
  const dispatch = useDispatch();
  const [eventName, setEventName] = useState();

  const handleEventName = (eventName) => {
    dispatch(updateEventDetail({ key: "eventName", value: eventName }));
  };

  const handleInputChange = (event) => {
    const newName = event.target.value;
    setEventName(newName);
    handleEventName(eventName);
  };
  console.log(eventName);
  return (
    <div>
      <div className="p-9  rounded-3xl  bg-blackD  flex flex-col gap-6  ">
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

          <div className="flex flex-row justify-end items-center gap-3">
            <div className="text-white text-[12px]     ">Ready?</div>
            <button
              type="button"
              onClick={() => dispatch(logEventData())}
              class="text-blackOA bg-greenF hover:bg-blue-800 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventNamePicker;
