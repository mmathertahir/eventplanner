"use client";
import React, { useEffect, useState } from "react";
import { getEventData } from "@/lib/feature/EventSlice";

import { useDispatch, useSelector } from "react-redux";

import { useTimezoneSelect, allTimezones } from "react-timezone-select";
const labelStyle = "original";
const timezones = {
  ...allTimezones,
  "Europe/Berlin": "Frankfurt",
};

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const [eventDetails, setEventDetails] = useState();
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const timeslots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 am",
    "2:00 AM",
    "3:00 AM",
    "4:00 AM",
    "5:00 PM",
  ];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [availability, setAvailability] = useState({});
  const [activeItem, setActiveItems] = useState(false);
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
  const handleActive = () => {
    console.log("Function Called");
    if (userName.trim() !== "") {
      setActiveItems(true);
    } else {
      // Optionally, you can show an error message or perform other actions
      alert("Please Enetr the UserName.");
    }
  };

  console.log(params.eventId, "Current Param Id");

  useEffect(() => {
    dispatch(getEventData(params.eventId));
  }, []);

  let eventData = useSelector((state) => state.eventdetail);

  console.log(eventData, "CurrentEventData");
  return (
    <div className="flex flex-col gap-4 w-full ">
      <div className="bg-blackE w-full  flex justify-center ">
        <div className=" px-5  md:px-20  py-9 ">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex flex-col gap-4 w-full  lg:w-3/4">
              <div className="text-white font-bold text-[24px]">
                {/* {eventDetails.eventName} */}
                Football
              </div>

              <p className="font-normal text-white ">
                To invite people to this event, you can 
                <span className="text-blue-900">email</span> them, send them a 
                <span className="text-blue-900">Facebook message</span>, or just
                direct them to
                <span className="text-blue-900"> here</span>.
              </p>
            </div>

            <div className="w-full  lg:w-1/4">
              <div className="flex flex-col  gap-y-3">
                <div className="text-white text-[16px] w-full ">Time Zone</div>
                <select
                  //   onChange={handleTimeZoneChange}
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
        <div
          className={`p-4 md:p-9  rounded-3xl  bg-black  w-full lg:w-6/12  flex flex-col gap-6  ${
            activeItem ? "hidden" : "block"
          }`}
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              ></input>
            </div>

            <div class=" flex flex-col lg:flex-row  lg:items-center  gap-y-3  ">
              <div className="text-white text-[12px]  w-full lg:w-1/4  ">
                Password(optional)
              </div>

              <input
                className="w-full px-[24px] py-[12px]  bg-gray-900  text-white  rounded-[12px] border-none appearance-none focus:outline-none "
                placeholder="Enter Event Name"
                // value={eventName}
                // onChange={handleInputChange}
              ></input>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              // onClick={() => dispatch(logEventData())}
              onClick={handleActive}
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
        </div>

        <div
          className={`w-full   lg:w-6/12  flex flex-col   gap-6 bg-blackE  p-11 ${
            activeItem ? "block" : "hidden"
          } `}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-white font-bold text-[24px]">
                Jhons Availability
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
                  {weekdays.map((weekday) => (
                    <th key={weekday} className=" px-3 py-2 text-white">
                      {weekday}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="rounded-[20px]">
                {timeslots.map((timeslot) => (
                  <tr key={timeslot}>
                    <td className=" px-3 text-end  py-2 text-white">
                      {timeslot}
                    </td>
                    {weekdays.map((weekday) => (
                      <td
                        key={`${timeslot}-${weekday}`}
                        className="border bg-gray-900   py-2 cursor-pointer  "
                        onClick={() => toggleAvailability(timeslot, weekday)}
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
                  {weekdays.map((weekday) => (
                    <th key={weekday} className=" px-3 py-2 text-white">
                      {weekday}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeslots.map((timeslot) => (
                  <tr key={timeslot}>
                    <td className=" px-3 text-end  py-2 text-white">
                      {timeslot}
                    </td>

                    {weekdays.map((weekday) => (
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
    </div>
  );
};

export default Page;
