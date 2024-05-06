"use client";
import React, { useEffect, useState } from "react";
import { getParticipantEventData } from "@/lib/feature/actions";
import {
  getEventData,
  setEventData,
  handleAvailabilityUpdate,
  handlememberUpdate,
} from "@/lib/feature/EventSlice";

import {
  convertDateFormat,
  getDayOfWeek,
  toggleAvailability,
  getAllEvents,
  getCurrentUserData,
  getCurrentEventData,
  getParticularEventdata,
  getParticepentEventdata,
} from "@/lib/feature/actions";
import { getDocsbyID } from "@/lib/feature/EventSlice";
import { v4 as uuidv4 } from "uuid";

import { useDispatch, useSelector } from "react-redux";

import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import AvailabilityShowModel from "@/Components/AvailabilityShowModel";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
  "Europe/Berlin": "Frankfurt",
};

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const [filteredParticipant, setFilteredParticipant] = useState(null);
  const [CallAvailability, setCallAvailability] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [userData, setUserData] = useState({
    userName: "",
    userId: "",
    password: "",
    eventId: "",
    availability: [],
    usertimezone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [allEvent, setAllEvent] = useState();
  const [currentEventData, setCurrentData] = useState();
  const [availableParticipants, setAvailableParticipants] = useState("");
  const [unavailableParticipants, setUnavailableParticipants] = useState("");
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const [activeItem, setActiveItems] = useState(false);
  const [currentDate, setCurrentDate] = useState();
  const [availableCount, setAvailableCount] = useState(0);
  const [unavailableCount, setUnavailableCount] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  let eventData = useSelector((state) => state.eventdetail);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const uId = uuidv4();

    const updatedUserData = {
      ...userData,
      userId: uId,
      eventId: params.eventId,
    };

    const { userName, userId, eventId, usertimezone } = updatedUserData;

    if (!userName || !userId || !eventId || !usertimezone) {
      alert(
        "Invalid participant data: userName, userId, eventId, and timeZone are required."
      );
      return;
    }

    try {
      let commingData = await handlememberUpdate(eventId, updatedUserData);
      setUserData(commingData);
      setActiveItems(true);

      const allEvents = await getAllEvents(); // Assuming getAllEvents returns the events
      dispatch(setEventData(allEvents));

      const currentUser = await getParticipantEventData(
        params.eventId,
        userData.userName
      );

      console.log(currentUser, "Current Data in Databade");
      if (currentUser) {
        setUserData((prevState) => ({
          ...prevState,
          ...currentUser,
        }));
      } else {
        console.log("No user data found for the specified username");
      }
    } catch (error) {
      console.error("Failed to handle form submission:", error);
    }

    console.log(userData, "UserData after Fetyching the ");
  };
  useEffect(() => {
    if (eventData && eventData.specificDates) {
      const dates = getDayOfWeek(eventData.specificDates);
      setCurrentDate(dates);
    }
  }, [eventData]);

  useEffect(() => {
    const updateAndFetchData = async () => {
      if (userData && userData.availability) {
        await handleAvailabilityUpdate(params.eventId, userData);

        const eventData = await getParticularEventdata(params.eventId);
        console.log(eventData, "My Current Event");
        setCurrentData(eventData);
        dispatch(setEventData(eventData));
      }
    };

    updateAndFetchData();
  }, [userData.availability, params.eventId, dispatch]);

  const [modalInfo, setModalInfo] = useState({ isOpen: false, content: "" });

  const handleMouseEnter = (timeslot, weekday) => {
    const available = Object.entries(eventData.participants)
      .filter(([_, participant]) =>
        participant.availability?.[weekday]?.includes(timeslot)
      )
      .map(([name]) => name);

    const unavailable = Object.entries(eventData.participants)
      .filter(
        ([_, participant]) =>
          !participant.availability?.[weekday]?.includes(timeslot)
      )
      .map(([name]) => name);

    setAvailableParticipants(available);
    setUnavailableParticipants(unavailable);

    setCallAvailability(true);
    setModalInfo({ isOpen: true, content: "" });
  };

  const calculateParticipantCounts = () => {
    let available = 0;
    let unavailable = 0;

    eventData.hours.forEach((timeslot) => {
      currentDate.forEach((weekday) => {
        const isAvailable = Object.values(eventData.participants).some(
          (participant) =>
            participant.availability?.[weekday]?.includes(timeslot)
        );

        if (isAvailable) {
          available++;
        } else {
          unavailable++;
        }
      });
    });

    setAvailableCount(available);
    setUnavailableCount(unavailable);
  };

  useEffect(() => {
    calculateParticipantCounts();
  }, [eventData, currentDate]);
  return (
    <div className="flex flex-col gap-4 w-full ">
      {isLoading ? (
        <div class="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
          <span class="sr-only">Loading...</span>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="h-8 w-8 bg-black rounded-full animate-bounce"></div>
        </div>
      ) : (
        <>
          <div className="bg-blackE w-full  flex justify-center ">
            <div className=" px-5  md:px-20  py-9 ">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-col gap-4 w-full  lg:w-3/4">
                  <div className="text-white font-bold text-[24px]">
                    {eventData.eventName}
                  </div>

                  <p className="font-normal text-white ">
                    To invite people to this event, you can 
                    <span className="text-blue-900">email</span> them, send them
                    a 
                    <span className="text-blue-900">Facebook message</span>, or
                    just direct them to
                    <span className="text-blue-900"> here</span>.
                  </p>
                </div>

                <div className="w-full  lg:w-1/4">
                  <div className="flex flex-col  gap-y-3">
                    <div className="text-white text-[16px] w-full ">
                      Your Time Zone
                    </div>
                    <select
                      value={userData?.usertimezone}
                      onChange={handleChange}
                      name="usertimezone"
                      className="w-full px-[24px] py-[12px] bg-gray-900 text-white rounded-[12px] border-none appearance-none focus:outline-none"
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 md:px-20  py-9   flex flex-col gap-3 lg:flex-row">
            <form
              className={`p-4 md:p-9  rounded-3xl  bg-black  w-full lg:w-6/12  flex flex-col gap-6  ${
                activeItem ? "hidden" : "block"
              }`}
              onSubmit={handleSubmit}
            >
              <div className="text-white font-bold text-[24px]">Sign In</div>

              <div className="flex flex-col  gap-2">
                <div class=" flex flex-col lg:flex-row  lg:items-center  gap-y-3  ">
                  <div className="text-white text-[12px]  w-full lg:w-1/4  ">
                    Your Name
                  </div>

                  <input
                    className="w-full px-[24px] py-[12px]  bg-gray-900  text-white  rounded-[12px] border-none appearance-none focus:outline-none "
                    placeholder="Enter Event Name"
                    value={userData?.userName}
                    name="userName"
                    onChange={handleChange}
                  ></input>
                </div>

                <div class=" flex flex-col lg:flex-row  lg:items-center  gap-y-3  ">
                  <div className="text-white text-[12px]  w-full lg:w-1/4  ">
                    Password(optional)
                  </div>

                  <input
                    className="w-full px-[24px] py-[12px]  bg-gray-900  text-white  rounded-[12px] border-none appearance-none focus:outline-none "
                    placeholder="Enter Event Name"
                    value={userData?.password}
                    name="password"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  class=" w-fit  text-blackOA bg-greenF hover:bg-blue-800 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
                >
                  Sign In
                </button>
              </div>

              <ul className="flex flex-col gap-3">
                <li className="text-white opacity-[40%] list-disc text-base font-normal">
                  Name / Password are only for this event.
                </li>
                <li className="text-white list-disc opacity-[40%] text-base font-normal">
                  New to this event? Make up a password.
                </li>
                <li className="text-white list-disc opacity-[40%] text-base font-normal">
                  Returning? Use the same Name / Password.
                </li>
              </ul>
            </form>

            {/* 
            <div className={`${CallAvailability ? "block" : "hiddden"}`}>
              <div className="flex  justify-between">
                <div className="flex flex-col gap-2">
                  <strong className="text-greenF">Available:</strong>
                  <ul>
                    {availableParticipants?.map((participant) => (
                      <li key={participant} className="text-white">
                        {participant}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <strong className="text-greenF">Unavailable:</strong>
                  <ul>
                    {unavailableParticipants.map((participant) => (
                      <li key={participant} className="text-white">
                        {participant}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> */}

            <div
              className={`w-full   lg:w-6/12  flex flex-col   gap-6 bg-blackE  p-11 ${
                activeItem ? "block" : "hidden"
              } `}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-white font-bold text-[24px]">
                    {userData?.userName}
                  </div>

                  <p className="font-normal text-white">
                    Click and drag to toggle, save immediately
                  </p>
                </div>

                <div className="flex  flex-row mx-0 gap-3 justify-center items-center">
                  <div className="flex flex-row gap-4 items-center">
                    <p className="font-normal text-white">Unavailable</p>

                    <div className="py-6 px-10 bg-white"></div>
                  </div>

                  <div className="flex flex-row gap-4 items-center">
                    <p className="font-normal text-white">Available</p>

                    <div className="py-6 px-10 bg-greenF"></div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-auto border-collapse  w-full">
                  <thead>
                    <tr>
                      <th className=""></th>
                      {currentDate?.map((weekday) => (
                        <th
                          key={weekday}
                          className=" px-3 py-2 text-white  text-[10px]   sm:text-[14px]"
                        >
                          {weekday}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="rounded-[20px]">
                    {eventData.hours?.map((timeslot) => (
                      <tr key={timeslot}>
                        <td className=" px-3 text-end  py-2 text-white  text-[10px]   sm:text-[14px]">
                          {timeslot}
                        </td>
                        {currentDate?.map((weekday) => (
                          <td
                            key={`${timeslot}-${weekday}`}
                            name="availability"
                            value={userData.availability}
                            className="border bg-gray-900   py-2 cursor-pointer  "
                            onClick={() =>
                              toggleAvailability(
                                timeslot,
                                weekday,
                                userData,
                                setUserData,
                                setCallAvailability
                              )
                            }
                            style={{
                              backgroundColor: userData?.availability?.[
                                weekday
                              ]?.includes(timeslot)
                                ? "#14FF00" // If the timeslot "05:00 PM" exists for this weekday
                                : "black", // If the timeslot "05:00 PM" doesn't exist for this weekday
                            }}
                          >
                            <div class="   border-y  w-full border-dotted  "></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full   lg:w-6/12  flex flex-col   gap-6 p-11">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-white font-bold text-[24px]">
                    Group’s Availability
                  </div>

                  <p className="font-normal text-white">
                    Mouse over the calendar to see who is available
                  </p>
                </div>

                <div className="flex  flex-row mx-0 gap-3 justify-center items-center">
                  <p className="font-normal text-white">
                    <p className="font-normal text-white">
                      {availableCount}/{availableCount + unavailableCount}{" "}
                      available
                    </p>
                  </p>

                  <table width={100} className="rounded-[12px]">
                    <tr>
                      <td className="bg-greenF  py-6 px-6"></td>
                      <td className="bg-white  py-6 px-6"></td>
                    </tr>
                  </table>

                  <p className="font-normal text-white">
                    {unavailableCount}/{availableCount + unavailableCount}{" "}
                    unavailable
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-auto border-collapse   w-full ">
                  <thead>
                    <tr>
                      <th className=""></th>
                      {currentDate?.map((weekday) => (
                        <th
                          key={weekday}
                          className=" px-3 py-2 text-white  text-[10px]   sm:text-[14px]"
                        >
                          {weekday}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventData.hours.map((timeslot) => (
                      <tr key={timeslot}>
                        <td className=" px-3 text-end  py-2 text-white  text-[10px]  sm:text-[14px]">
                          {timeslot}
                        </td>

                        {currentDate?.map((weekday) => (
                          <td
                            key={`${timeslot}-${weekday}`}
                            className={`border bg-gray-900 py-2 cursor-pointer  relative  ${
                              !activeItem ? "disabled" : ""
                            }`}
                            style={{
                              backgroundColor: Object.values(
                                eventData.participants
                              ).some((participant) =>
                                participant.availability?.[weekday]?.includes(
                                  timeslot
                                )
                              )
                                ? "#14FF00"
                                : "black",
                            }}
                            onMouseEnter={() =>
                              handleMouseEnter(timeslot, weekday)
                            }
                            // onMouseLeave={handleMouseLeave}
                          >
                            <div class="   border-y  w-full border-dotted "></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <AvailabilityShowModel
                    isOpen={modalInfo.isOpen}
                    availableParticipants={availableParticipants}
                    unavailableParticipants={unavailableParticipants}
                    onClose={() => setModalInfo({ isOpen: false })}
                  />
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
