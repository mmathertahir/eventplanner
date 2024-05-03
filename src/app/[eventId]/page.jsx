"use client";
import React, { useEffect, useState } from "react";
import { getEventData, setEventData } from "@/lib/feature/EventSlice";
import { getDayOfWeek } from "@/lib/feature/actions";
import { getDocsbyID } from "@/lib/feature/EventSlice";
import { v4 as uuidv4 } from "uuid";

import { handlememberUpdate } from "@/lib/feature/EventSlice";

import { useDispatch, useSelector } from "react-redux";

import { useTimezoneSelect, allTimezones } from "react-timezone-select";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
  "Europe/Berlin": "Frankfurt",
};

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    userName: "",
    userId: "",
    password: "",
    eventId: "",
    availability: [],
    usertimezone: "",
  });

  const [eventDetails, setEventDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const [availability, setAvailability] = useState({});
  const [activeItem, setActiveItems] = useState(false);
  const [currentDate, setCurrentDate] = useState();
  const [userName, setUserName] = useState("");

  const toggleAvailability = (timeslot, weekday) => {
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [timeslot]: {
        ...prevAvailability[timeslot],
        [weekday]: !prevAvailability[timeslot]?.[weekday],
      },
    }));
  };

  console.log(params.eventId, "Current Param Id");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const uId = uuidv4();

    const updatedUserData = {
      ...userData,
      userId: uId,
      eventId: params.eventId,
    };

    console.log(uId, "Current User Id");
    const { userName, userId, eventId, usertimezone } = updatedUserData;

    if (!userName || !userId || !eventId || !usertimezone) {
      alert(
        "Invalid participant data: userName, userId, eventId, and timeZone are required."
      );
      return;
    }

    console.log(userData, "Event ID ");
    let commingData = await handlememberUpdate(eventId, updatedUserData);
    setUserData(commingData);
    setActiveItems(true);
    console.log(commingData, "Data on AddedUser");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const eventData = await getDocsbyID(params.eventId);
      dispatch(setEventData(eventData));
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch]);

  let eventData = useSelector((state) => state.eventdetail);

  useEffect(() => {
    if (eventData && eventData.specificDates) {
      const dates = getDayOfWeek(eventData.specificDates);
      setCurrentDate(dates);
    }
  }, [eventData]);

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
                      value={userData.usertimezone}
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
                    value={userData.userName}
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
                    value={userData.password}
                    name="password"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  // onClick={() => dispatch(logEventData())}

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

            <div
              className={`w-full   lg:w-6/12  flex flex-col   gap-6 bg-blackE  p-11 ${
                activeItem ? "block" : "hidden"
              } `}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-white font-bold text-[24px]">
                    {userData.userName}
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
                        <th key={weekday} className=" px-3 py-2 text-white">
                          {weekday}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="rounded-[20px]">
                    {eventData.hours?.map((timeslot) => (
                      <tr key={timeslot}>
                        <td className=" px-3 text-end  py-2 text-white">
                          {timeslot}
                        </td>
                        {currentDate?.map((weekday) => (
                          <td
                            key={`${timeslot}-${weekday}`}
                            className="border bg-gray-900   py-2 cursor-pointer  "
                            onClick={() =>
                              toggleAvailability(timeslot, weekday)
                            }
                            style={{
                              backgroundColor: availability[timeslot]?.[weekday]
                                ? "#14FF00"
                                : "black",
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
                  <p className="font-normal text-white">0/0 available</p>

                  <table width={100} className="rounded-[12px]">
                    <tr>
                      <td className="bg-greenF  py-6 px-6"></td>
                      <td className="bg-gray-900 py-6 px-6"></td>
                      <td className="bg-red-400  py-6 px-6"></td>
                    </tr>
                  </table>

                  <p className="font-normal text-white">0/0 available</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-auto border-collapse   w-full ">
                  <thead>
                    <tr>
                      <th className=""></th>
                      {currentDate?.map((weekday) => (
                        <th key={weekday} className=" px-3 py-2 text-white">
                          {weekday}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventData.hours.map((timeslot) => (
                      <tr key={timeslot}>
                        <td className=" px-3 text-end  py-2 text-white">
                          {timeslot}
                        </td>

                        {currentDate.map((weekday) => (
                          <td
                            key={`${timeslot}-${weekday}`}
                            className={`border bg-gray-900 py-2 cursor-pointer  relative  ${
                              !activeItem ? "disabled" : ""
                            }`}
                            onClick={() => {
                              if (activeItem) {
                                toggleAvailability(timeslot, weekday);
                              }
                            }}
                            style={{
                              backgroundColor: availability[timeslot]?.[weekday]
                                ? "#14FF00"
                                : "black",
                            }}
                          >
                            <div class="   border-y  w-full border-dotted "></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
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
