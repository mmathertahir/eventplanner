"use client";
import React from "react";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
const labelStyle = "original";
const timezones = {
  ...allTimezones,
  "Europe/Berlin": "Frankfurt",
};

const Page = ({ params }) => {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-blackE w-full  flex justify-center ">
        <div className=" px-20  py-9">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex flex-col gap-4 w-full  lg:w-3/4">
              <div className="text-white font-bold text-[24px]">
                My Event Name
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

      <div className="px-20">
        <div className="p-9  rounded-3xl  bg-black  w-6/12  flex flex-col gap-6">
          <div className="text-white font-bold text-[24px]">Sign In</div>

          <div className="flex flex-col  gap-2">
            <div class=" flex flex-col lg:flex-row  lg:items-center  gap-y-3  ">
              <div className="text-white text-[12px]  w-full lg:w-1/4  ">
                Your Name
              </div>

              <input
                className="w-full px-[24px] py-[12px]  bg-gray-900  text-white  rounded-[12px] border-none appearance-none focus:outline-none "
                placeholder="Enter Event Name"
                // value={eventName}
                // onChange={handleInputChange}
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

          <button
            type="button"
            // onClick={() => dispatch(logEventData())}
            class=" w-fit  text-blackOA bg-greenF hover:bg-blue-800 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
